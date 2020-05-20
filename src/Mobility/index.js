import React, { useContext, useState, useEffect, useMemo, useRef } from "react";
import * as _ from "underscore";
import MapGL, { Layer, Source, MapContext, NavigationControl } from "@urbica/react-map-gl";
import { Button, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import Loading from "../Loading";

import MaskLayer from "../MaskLayer";
import CountriesLayer from "../CountriesLayer";

import { loadConfig, mobilityLayerConfig, aggregationTypes } from "./config";
import { getLayerPaint } from "./mapStyles";
import PopupContent from "./PopupContent";
import Legend from "./Legend";
import Table from "./Table";
import Chart from "./Chart";

import {
  changeDates,
  tabCodes,
  changeCountrySelectEntries,
} from "../util";

import "./index.css";
import "../../node_modules/@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import 'mapbox-gl/dist/mapbox-gl.css';

import StateContext from "../State";
import { ConfigurationContext } from "../ConfigurationProvider";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiYXphdmVhIiwiYSI6IkFmMFBYUUUifQ.eYn6znWt8NzYOa3OrWop8A";

const boundarySource = {
  type: "vector",
  tiles: [window.location.origin + "/data/tiles/country/{z}/{x}/{y}.pbf"],
  minzoom: 0,
  maxzoom: 8,
};

export default () => {
  // TODO: If implementing multiple aggregation types,
  // use this from State.
  const aggType = "country";

  const config = useContext(ConfigurationContext);

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
    mobility: {
      mobilityData,
      setMobilityData,
      mobilityDates,
      setMobilityDates,
    },
  } = useContext(StateContext);

  const [viewport, setViewport] = useState(config.defaults.viewport);

  const [mapInitNeeded, setMapInitNeeded] = useState(true);

  const [selectedLayer, setSelectedLayer] = useState(
    _.filter(
      Object.entries(mobilityLayerConfig),
      ([key, config]) => config.default
    )[0][0]
  );

  const selectedLayerConfig = mobilityLayerConfig[selectedLayer];

  const [codeToId, setCodeToId] = useState(null);

  const [dataLoaded, setDataLoaded] = useState(false);

  const [popupEnabled, setPopupEnabled] = useState(false);
  const [popupDetails, setPopupDetails] = useState();

  const selectedDate = !!mobilityDates && mobilityDates[mobilityDates.length - 1] < dates[selectedDateIndex] ? (
    mobilityDates[mobilityDates.length - 1]) : dates[selectedDateIndex];

  const chartTime = dataLoaded ? new Date(selectedDate).getTime() : undefined;
  const mapElement = useRef(null);

  const alpha3 = countrySelectEntries[selectedCountryId].alpha3,
    countryIntId = dataLoaded ? codeToId[alpha3.toString()] : 0,
    countryData =
      mobilityData && countryIntId in mobilityData
        ? mobilityData[countryIntId]
        : null;

  let currentBreaks =
    aggregationTypes[aggType].breaks && selectedLayer
      ? aggregationTypes[aggType].breaks[selectedLayer]
      : null;

  // On tab activation.
  useEffect(() => {
    setDateSelectorEnabled(true);
    setCountrySelectorEnabled(true);


    setActiveTab(tabCodes.mobility);
    if(!!mobilityDates) {
      setLastUpdatedDate(mobilityDates[mobilityDates.length - 1]);
    } else {
      setLastUpdatedDate(null);
    }
    setSources([
      <a href="https://www.google.com/covid19/mobility/">Google Mobility Data</a>
    ]);

  }, [setActiveTab]);

  // Fetch all the data for this tab.
  useEffect(() => {
    if (!dataLoaded) {
      Promise.all([
        fetch("/data/mobility/config.json").then((r) => r.json()),
        fetch("/data/mobility/data.json").then((r) => r.json()),
        fetch("/data/country_alpha_3_to_id.json").then((r) => r.json()),
      ]).then((responses) => {
        const [config, data, code2id] = responses;
        loadConfig(config);
        setMobilityData(data);
        setMobilityDates(config.dates);
        setLastUpdatedDate(config.dates[config.dates.length - 1]);
        setCodeToId(code2id);
        setDataLoaded(true);
        setReady(true);
      });
    }
  }, [dataLoaded, setMobilityData, setMobilityDates, setReady]);

  // Setup tab data on mount and when data is loaded
  useEffect(() => {
    if (dataLoaded) {
      // set the date slider to the mobility data dates.
      changeDates(
        dates,
        mobilityDates,
        selectedDateIndex,
        setDates,
        setSelectedDateIndex
      );

      // TODO: A better way of doing this if we keep the country select around.
      changeCountrySelectEntries(
        config.defaults.countries,
        selectedCountryId,
        setCountrySelectEntries,
        setSelectedCountryId,
        config.defaults.country
      );
    }
  }, [activeTab, dataLoaded]);

  const chartData = useMemo(() => {
    if (dataLoaded) {
      const alpha3 = countrySelectEntries[selectedCountryId].alpha3,
        countryId = codeToId[alpha3],
        dataByDate = !!countryData ? countryData[selectedLayer] : {};

      return (
        Object.entries(dataByDate)
          // .sort((kv1, kv2) => (kv1[0] > kv1[0] ? 1 : -1))
          .map(([date, value]) => ({
            x: new Date(date).getTime(),
            y: value,
          }))
      );
    } else {
      return null;
    }
  }, [dataLoaded, selectedCountryId, codeToId, countryData, selectedLayer]);

  // Handle setting feature state based on selected layer.
  useEffect(() => {
    if (!mapInitNeeded) {
      Object.entries(mobilityData).forEach(([key, data]) => {
        const layerData = data[selectedLayer],
          valueAtDate = layerData ? layerData[selectedDate] : null,
          value = valueAtDate ? valueAtDate : 0.0;

        mapElement.current._map.setFeatureState(
          { source: "boundaries", sourceLayer: "country", id: parseInt(key) },
          { value: value, hasValue: 1 }
        );
      });
    }
  }, [
    selectedLayer,
    selectedDateIndex,
    mapInitNeeded,
    mobilityData,
    selectedDate,
  ]);

  // Zoom to selected country, if the selected country has bounds defined.
  useEffect(() => {
    if(!mapInitNeeded) {
      if(!!config.defaults.countries[selectedCountryId].bounds) {
        mapElement.current._map.fitBounds(config.defaults.countries[selectedCountryId].bounds, {
          padding: 20
        });
      }
    }
  }, [selectedCountryId]);

  const mapInit = (map) => {
    if (mapInitNeeded) {
      setMapInitNeeded(false);
    }
  };

  const popup = popupEnabled && (
    popupDetails.feature && !!mobilityData[popupDetails.feature.id.toString()]
  ) && (
    <PopupContent
      feature={popupDetails.feature}
      coordinates={popupDetails.coords}
      mobilityData={mobilityData}
      aggType={aggType}
      selectedDate={selectedDate}
    />
  );

  const countryDataAvailable = !!mobilityData && countryIntId in mobilityData;

  let value = "No Data";
  if (countryDataAvailable) {
    const v = mobilityData[countryIntId][selectedLayer][selectedDate];
    if (v > 0) {
      value = `+${v}%`;
    } else {
      value = `${v}%`;
    }
  }

  return dataLoaded ? (
    <div className="viz mobility">
      <main>
        <div className="mobility-filters menu">
          <section className="section-mobility-sidebar">
            <div className="type-buttons">
              {Object.entries(mobilityLayerConfig).map(([key, config]) => (
                <Button
                  key={key}
                  onClick={() => setSelectedLayer(key)}
                  active={selectedLayer === key}
                >
                  <div
                    className="color-circle"
                    style={{ backgroundColor: config.color }}
                  ></div>
                  <strong>{config.label}</strong>
                </Button>
              ))}
            </div>
            <div className="type-dropdown">
              <Select
                items={Object.keys(mobilityLayerConfig)}
                popoverProps={{ minimal: true }}
                itemRenderer={(layerId, { handleClick, modifiers }) => {
                  return (
                    <span key={layerId}>
                      <MenuItem
                        onClick={handleClick}
                        active={selectedLayer === layerId}
                        key={layerId}
                        text={mobilityLayerConfig[layerId].label}
                      />
                    </span>
                  );
                }}
                filterable={false}
                noResults={<MenuItem disabled={true} text="No results." />}
                onItemSelect={(item) => {
                  setSelectedLayer(item);
                }}
              >
                <span className="dropdown-label">Category</span>
                <Button
                  text={mobilityLayerConfig[selectedLayer].label}
                  rightIcon="double-caret-vertical"
                />
              </Select>
            </div>
          </section>
        </div>
        <div className="primary">
          <section className="section-map">
            <div className="map-container">
              <MapGL
                {...viewport}
                onViewportChange={(viewport) => setViewport(viewport)}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/light-v9"
                accessToken={MAPBOX_ACCESS_TOKEN}
                renderWorldCopies={false}
                maxBounds={[
                  [-180, -90],
                  [180, 90],
                ]}
                ref={mapElement}
              >
                <MapContext.Consumer>
                  {(map) => {
                    mapInitNeeded && mapInit(map);
                  }}
                </MapContext.Consumer>
                <Source id="boundaries" {...boundarySource} />
                <Layer
                  id="country-fill"
                  type="fill"
                  source="boundaries"
                  source-layer="country"
                  before="water-label"
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
                  paint={getLayerPaint("country")(
                    dates,
                    currentBreaks,
                    selectedDateIndex,
                    selectedLayer,
                    aggType
                  )}
                />
                ,
                <Layer
                  id="country-line"
                  type="line"
                  source="boundaries"
                  source-layer="country"
                  before="water-label"
                  paint={{
                    "line-width": [
                      "interpolate",
                      ["linear"],
                      ["zoom"],
                      3,
                      0.5,
                      10,
                      3,
                    ],
                    "line-color": "#000",
                    "line-opacity": 0.25,
                  }}
                />
                {popup}
                { config.features.maskFeature && <MaskLayer opacity={0.45}/> }
                <CountriesLayer />
                <Legend
                  classBreaks={currentBreaks}
                  selectedLayer={selectedLayer}
                />
                <NavigationControl showZoom position='top-right' />
              </MapGL>
            </div>
          </section>
        </div>
        <div className="secondary">
          <>
            <section className={`section-numeral`}>
              {!countryDataAvailable && (
                <>
                  <h3 className="mobility-data-not-available-header">
                    {countrySelectEntries[selectedCountryId].name} data not available
                  </h3>
                  <p>
                    Try switching to a different country to view its mobility
                    indicators
                  </p>
                  <h3 className="moblity-data-not-available-footer">
                    Other countries
                  </h3>
                </>
              )}
              {countryDataAvailable && (
                <div className="item">
                  <div className="item-label">
                    Compared to pre-COVID baseline
                  </div>
                  <div
                    className="item-number"
                    style={{ color: selectedLayerConfig.color }}
                  >
                    {value}
                  </div>
                </div>
              )}
              {(!countryDataAvailable || selectedCountryId === "eac") && (
                <Table
                  selectedLayer={selectedLayer}
                  selectedDate={selectedDate}
                  mobilityData={mobilityData}
                  codeToId={codeToId}
                />
              )}
            </section>
            {countryDataAvailable && (
              <section className="section-chart">
                <Chart
                  color={selectedLayerConfig.color}
                  data={chartData}
                  date={chartTime}
                  value={
                    !!countryData ? countryData[selectedLayer][selectedDate] : 0
                  }
                />
              </section>
            )}
            {selectedCountryId !== "eac" && countryDataAvailable && (
              <section className="section-numeral">
                <h3 style={{ marginTop: 0 }}>Other countries</h3>
                <Table
                  selectedCountryId={selectedCountryId}
                  selectedLayer={selectedLayer}
                  selectedDate={selectedDate}
                  mobilityData={mobilityData}
                  codeToId={codeToId}
                />
              </section>
            )}
          </>
        </div>
      </main>
    </div>
  ) : (
    <Loading />
  );
};
