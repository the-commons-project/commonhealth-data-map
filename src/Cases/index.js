import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { MapboxLayer } from "@deck.gl/mapbox";
import { ScatterplotLayer } from "@deck.gl/layers";
import MapGL, {
  Layer,
  NavigationControl,
  AttributionControl,
  MapContext,
  Source,
} from "@urbica/react-map-gl";
import { Button, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import groupBy from "lodash.groupby";
import keyBy from "lodash.keyby";

import MaskLayer from "../MaskLayer";
import PopupContent from "./PopupContent";
import CountriesLayer from "../CountriesLayer";
import { getCirclePaintStyle } from "./mapStyles.js";

import "../../node_modules/@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import "mapbox-gl/dist/mapbox-gl.css";
import mapStyle from "../mapStyle.json";

import {
  eacCodes,
  eacAlpha2,
  caseTypes,
  changeDates,
  tabCodes,
  eacCountries,
  changeCountrySelectEntries,
} from "../util";
import Chart from "./Chart";
import Numbers from "./Numbers";
import Table from "./Table";
import StateContext from "../State";
import { ConfigurationContext } from "../ConfigurationProvider";

const pointLayerSource = {
  id: "case-points",
  type: 'vector',
  tiles: [
    window.location.origin +
      '/data/cases/tiles/{z}/{x}/{y}.pbf',
  ],
  minzoom: 0,
  maxzoom: 12,
};

export default () => {
  const config = useContext(ConfigurationContext);

  const radius = 50;
  const radius2 = 70000;

  const [viewport, setViewport] = useState(config.defaults.viewport);

  const [activeCaseType, setActiveCaseType] = useState(caseTypes[0]);

  const [nationalDataLoaded, setNationalDataLoaded] = useState(false);
  const [countyDataLoaded, setCountyDataLoaded] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);

  const [popupEnabled, setPopupEnabled] = useState(false);
  const [popupDetails, setPopupDetails] = useState();

  const [mapInitNeeded, setMapInitNeeded] = useState(true);

  const mapElement = useRef(null);

  const {
    setLastUpdatedDate,
    setSources,
    setDateSelectorEnabled,
    dates,
    setDates,
    activeTab,
    setActiveTab,
    selectedDateIndex,
    setSelectedDateIndex,
    setCountrySelectorEnabled,
    selectedCountryId,
    setReady,
    countrySelectEntries,
    setCountrySelectEntries,
    setSelectedCountryId,
    cases: {
      nationalData,
      setNationalData,
      countyData,
      setCountyData,
      caseDates,
      setCaseDates,
      maxDatePerId,
      setMaxDatePerId,
      alpha2ToId,
      setAlpha2ToId
    },
  } = useContext(StateContext);

  // On tab activation.
  useEffect(() => {
    setDateSelectorEnabled(true);
    setCountrySelectorEnabled(true);

    setActiveTab(tabCodes.mobility);

    if(!!caseDates) {
      setLastUpdatedDate(caseDates[caseDates.length - 1]);
    } else {
      setLastUpdatedDate(null);
    }
    setSources([
      <a href="https://github.com/CSSEGISandData/COVID-19">JHU</a>,
      "EAC Secretariat"
    ]);
  }, [setActiveTab, configLoaded]);

  useEffect(() => {
    if (!nationalDataLoaded) {
      fetch("/data/cases/case-data.json")
        .then((response) => response.json())
        .then((data) => {
          setNationalData(data);
          setNationalDataLoaded(true);
        });
    }
  }, []);

  useEffect(() => {
    if (config.features.countyCasesFeature && !countyDataLoaded) {
      fetch("/data/cases/county-case-data.json")
        .then((response) => response.json())
        .then((data) => {
          setCountyData(data);
          setCountyDataLoaded(true);
        });
    }
  }, []);

  useEffect(() => {
    if (!configLoaded) {
      fetch("/data/cases/case-config.json")
        .then((response) => response.json())
        .then((data) => {
          const countries = data['countries'],
                dates = data['dates'],
                maxDates = data['maxDates'],
                alpha2ToId = data['alpha2ToId'];

          Object.keys(maxDates).forEach((key) => {
            maxDates[key] = {
              'date': maxDates[key],
              'time': new Date(maxDates[key]).getTime()
            };
          });

          setMaxDatePerId(maxDates);
          setCaseDates(dates);
          setAlpha2ToId(alpha2ToId);

          setConfigLoaded(true);
        });
    }
  }, []);

  // Setup tab data on mount and when data is loaded
  useEffect(() => {
    if (configLoaded) {
      // set the date slider to the case data dates.
      changeDates(
        dates,
        caseDates,
        selectedDateIndex,
        setDates,
        setSelectedDateIndex
      );

      // All eac countries are selectable.
      changeCountrySelectEntries(
        config.defaults.countries,
        selectedCountryId,
        setCountrySelectEntries,
        setSelectedCountryId,
        config.defaults.country
      );
    }
  }, [activeTab, configLoaded]);

  const selectedDate = dates[selectedDateIndex],
        selectedTime = configLoaded ? new Date(selectedDate).getTime() : null,
        selectedCountry = countrySelectEntries[selectedCountryId],
        selectedCountryKey = configLoaded ? alpha2ToId[selectedCountry.alpha2] : null;

  const selectedDataDate = configLoaded ? (
    selectedTime > maxDatePerId[selectedCountryKey]['time'] ? (
      maxDatePerId[selectedCountryKey]['date']
    ) : selectedDate
  ) : selectedDate;

  const selectedData = (configLoaded && nationalDataLoaded) ? (
    nationalData[alpha2ToId[selectedCountry.alpha2]]['dates'][selectedDataDate]
  ) : null;

  const chartTime = !!selectedDataDate ? new Date(selectedDataDate).getTime() : undefined;

  const chartData = useMemo(
    () => {
      if(configLoaded && nationalDataLoaded) {
        return Object.entries(nationalData[selectedCountryKey]['dates'])
          .sort((kv1, kv2) => (new Date(kv1[0]).getTime() > new Date(kv2[0]).getTime() ? 1 : -1))
          .map((kv) => ({
            x: new Date(kv[0]).getTime(),
            y: kv[1][activeCaseType.id],
          }));
      }
      return [];
    },
    [configLoaded, nationalDataLoaded, activeCaseType.id, configLoaded, selectedCountryId]
  );

  const isSelectedCountry = useCallback(
    (alpha2) => {
      if(!!countrySelectEntries) {
        return (
          selectedCountry.alpha2 === alpha2 ||
            selectedCountryId === 'global' ||
            (selectedCountryId === "eac" && eacAlpha2.includes(alpha2))
        );
      } else {
        return true;
      }

    },
    [selectedCountryId]
  );

  const popup = popupEnabled ? (
    <PopupContent
      details={popupDetails}
      data={nationalData}
      selectedDate={selectedDate}
      maxDatePerId={maxDatePerId}
    />
  ) : null;

  useEffect(() => {
    if(!mapInitNeeded && configLoaded) {
      if(selectedCountryId in countrySelectEntries) {
        mapElement.current._map.fitBounds(countrySelectEntries[selectedCountryId].bounds, {
          padding: 20
        });
      }
    }
  }, [selectedCountryId]);

  const mapInit = map => {
    if (mapInitNeeded) {
      setMapInitNeeded(false);
    }
  };

  // Style the map through setting the feature state
  useEffect(() => {
    if (!mapInitNeeded && configLoaded) {
      if(nationalDataLoaded) {
        Object.entries(nationalData).forEach(([key, data]) => {
          if(data.map) {
            const valueDate = (selectedTime > maxDatePerId[key]['time'] ? (
              maxDatePerId[key]['date']) : selectedDate),
                  dataAtDate = data ? data['dates'][valueDate] : null,
                  value = dataAtDate ? dataAtDate[activeCaseType.id] : 0.0,
                  isSelected = isSelectedCountry(data.a2),
                  lineWidth = isSelected ? 1 : 0.5;

            mapElement.current._map.setFeatureState(
              { source: "case-points", sourceLayer: "points", id: parseInt(key) },
              {
                isActive: isSelected ? 1 : 0,
                visible: data.map ? 1 : 0,
                radius: radius2 * Math.pow(value, 0.3),
                lineWidth: lineWidth
              }
            );
          }
        });
      }
    }
  }, [
    selectedCountryId,
    selectedDateIndex,
    mapInitNeeded,
    nationalDataLoaded,
    countyDataLoaded,
    configLoaded,
    activeCaseType,
  ]);

  const countriesToList = Object.entries(eacCountries)
        .filter(kv => eacAlpha2.includes(kv[1].alpha2))
        .reduce((obj, kv) => {
          obj[kv[0]] = kv[1];
          return obj;
        }, {});

  return (
    <div className="viz cases">
      <main>
        <div className="primary">
          <section className="section-map">
            <div className="type-toggle">
              <div className="type-buttons">
                <Button
                  minimal={true}
                  active={activeCaseType.id === "cases"}
                  onClick={() => {
                    setActiveCaseType(caseTypes[0]);
                  }}
                >
                  <div className="color-circle background-color-cases"></div>
                  Total cases
                </Button>
                <Button
                  minimal={true}
                  active={activeCaseType.id === "active"}
                  onClick={() => {
                    setActiveCaseType(caseTypes[1]);
                  }}
                >
                  <div className="color-circle background-color-active"></div>
                  Active
                </Button>
                <Button
                  minimal={true}
                  active={activeCaseType.id === "recovered"}
                  onClick={() => {
                    setActiveCaseType(caseTypes[2]);
                  }}
                >
                  <div className="color-circle background-color-recovered"></div>
                  Recovered
                </Button>
                <Button
                  minimal={true}
                  active={activeCaseType.id === "deaths"}
                  onClick={() => {
                    setActiveCaseType(caseTypes[3]);
                  }}
                >
                  <div className="color-circle background-color-deaths"></div>
                  Deaths
                </Button>
              </div>
              <div className="type-dropdown">
                <Select
                  items={caseTypes}
                  popoverProps={{ minimal: true }}
                  itemRenderer={(type, { handleClick, modifiers }) => {
                    return (
                      <span key={type.id}>
                        <MenuItem
                          onClick={handleClick}
                          active={modifiers.active}
                          disabled={type.disabled}
                          key={type.id}
                          text={type.name}
                        />
                      </span>
                    );
                  }}
                  filterable={false}
                  noResults={<MenuItem disabled={true} text="No results." />}
                  onItemSelect={(item) => {
                    setActiveCaseType(item);
                  }}
                >
                  <span className="dropdown-label">Visualize by</span>
                  <Button
                    text={activeCaseType.name}
                    rightIcon="double-caret-vertical"
                  />
                </Select>
              </div>
            </div>
            <div className="map-container">
              <MapGL
                {...viewport}
                onViewportChange={(viewport) => setViewport(viewport)}
                style={{ width: "100%", height: "100%" }}
                mapStyle={mapStyle}
                maxBounds={[
                  [-180, -90],
                  [180, 90],
                ]}
                renderWorldCopies={false}
                ref={mapElement}
              >
                <MapContext.Consumer>
                  {map => {
                    mapInitNeeded && mapInit(map);
                  }}
                </MapContext.Consumer>
                <NavigationControl showZoom position='top-right' />
                <AttributionControl
                  compact={true}
                  position="bottom-right"
                  customAttribution='Sources: Esri, HERE, Garmin, FAO, NOAA, USGS, © OpenStreetMap contributors, and the GIS User Community'
                />

                <Source {...pointLayerSource} />
                <Layer
                  id="case-points"
                  type="circle"
                  source="case-points"
                  source-layer="points"
                  paint={getCirclePaintStyle(activeCaseType)}
                  onHover={(e) => {
                    setPopupDetails({
                      coords: e.lngLat,
                      feature: e.features[0],
                    });
                    setPopupEnabled(true);
                  }}
                  onLeave={(e) => {
                    setPopupEnabled(false);
                  }}
                />


                {/* Mask Layer */}
                {config.features.maskFeature && <MaskLayer />}

                {/* Countries Layer */}
                <CountriesLayer />

                {popup}
              </MapGL>
            </div>
          </section>
        </div>
        <div className="secondary">
          {!!selectedData && (
            <>
              <section className={`section-numeral`}>
                <Numbers selectedData={selectedData} />
                {config.features.tableFeature && nationalDataLoaded && configLoaded &&
                 selectedCountryId === "eac" && (
                   <Table
                     countries={countriesToList}
                     nationalData={nationalData}
                     selectedDate={selectedDate}
                     alpha2ToId={alpha2ToId}
                     maxDatePerId={maxDatePerId}
                   />
                  )}
              </section>
              <section className="section-chart">
                <Chart
                  color={activeCaseType.colorHex}
                  data={chartData}
                  date={chartTime}
                  indicator={selectedData[activeCaseType.id]}
                />
              </section>
              {config.features.tableFeature && nationalDataLoaded && configLoaded &&
               selectedCountryId !== "eac" && (
                <section className="section-numeral">
                  <h3 style={{ marginTop: 0 }}>Other countries</h3>
                  <Table
                    countries={countriesToList}
                    selectedCountryId={selectedCountryId}
                    nationalData={nationalData}
                    selectedDate={selectedDate}
                    alpha2ToId={alpha2ToId}
                    maxDatePerId={maxDatePerId}
                  />
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};
