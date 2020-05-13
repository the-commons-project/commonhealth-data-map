import React, { useContext, useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as _ from "underscore";
import MapGL, { CustomLayer, Layer, Source, MapContext } from "@urbica/react-map-gl";
import { MapboxLayer } from "@deck.gl/mapbox";
import { ScatterplotLayer } from "@deck.gl/layers";
import { Button, Card, MenuItem, Icon, Elevation } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import Loading from "../Loading";

import "../../node_modules/@blueprintjs/datetime/lib/css/blueprint-datetime.css";

import "./index.css";
import { loadConfig, mobilityLayerConfig, aggregationTypes } from "./config";
import { getLayerPaint } from "./mapStyles";
import PopupContent from "./PopupContent";
import Legend from "./Legend";
import Table from "./Table";
import Chart from "./Chart";

import {
  eacCodes,
  eacCountries,
  caseTypes,
  changeDates,
  tabCodes,
  changeCountrySelectEntries
} from "../util";
import StateContext from "../State";

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiYXphdmVhIiwiYSI6IkFmMFBYUUUifQ.eYn6znWt8NzYOa3OrWop8A";

const boundarySource = {
  type: "vector",
  tiles: [window.location.origin + "/data/tiles/country/{z}/{x}/{y}.pbf"],
  minzoom: 0,
  maxzoom: 8
};

const maskLayerSource = {
  id: "mask",
  type: "geojson",
  data: "/eac-mask.json"
};

const maskLayerStyle = {
  id: "mask",
  type: "fill",
  source: "mask",
  layout: {},
  paint: {
    "fill-color": "#000",
    "fill-opacity": 0.45
  }
};

export default () => {
  // TODO: If implementing multiple aggregation types,
  // use this from State.
  const aggType = "country";

  const {
    dates,
    setDates,
    activeTab,
    setActiveTab,
    selectedDateIndex,
    setSelectedDateIndex,
    selectedCountryId,
    setReady,
    setCountrySelectEntries,
    setSelectedCountryId,
    mobility: { mobilityData, setMobilityData, mobilityDates, setMobilityDates }
  } = useContext(StateContext);

  const [viewport, setViewport] = useState({
    latitude: 0.27,
    longitude: 33.45,
    zoom: 4,
    bearing: 0,
    pitch: 0
  });

  const [mapInitNeeded, setMapInitNeeded] = useState(true);

  const [selectedLayer, setSelectedLayer] = useState(
    _.filter(Object.entries(mobilityLayerConfig), ([key, config]) => config.default)[0][0]
  );

  const selectedLayerConfig = mobilityLayerConfig[selectedLayer];

  const [codeToId, setCodeToId] = useState(null);

  const [dataLoaded, setDataLoaded] = useState(false);

  const [popupEnabled, setPopupEnabled] = useState(false);
  const [popupDetails, setPopupDetails] = useState();

  const selectedDate = dates[selectedDateIndex];

  const chartTime = dataLoaded ? new Date(dates[selectedDateIndex]).getTime() : undefined;
  const mapElement = useRef(null);

  const alpha3 = eacCountries[selectedCountryId].alpha3,
    countryIntId = dataLoaded ? codeToId[alpha3.toString()] : 0,
    countryData = mobilityData && countryIntId in mobilityData ? mobilityData[countryIntId] : null;

  let currentBreaks =
    aggregationTypes[aggType].breaks && selectedLayer
      ? aggregationTypes[aggType].breaks[selectedLayer]
      : null;

  // Set the active tab.
  useEffect(() => setActiveTab(tabCodes.mobility), [setActiveTab]);

  // Fetch all the data for this tab.
  useEffect(() => {
    if (!dataLoaded) {
      Promise.all([
        fetch("data/mobility/config.json").then(r => r.json()),
        fetch("data/mobility/data.json").then(r => r.json()),
        fetch("data/country_alpha_3_to_id.json").then(r => r.json())
      ]).then(responses => {
        const [config, data, code2id] = responses;
        loadConfig(config);
        setMobilityData(data);
        setMobilityDates(config.dates);
        setCodeToId(code2id);
        setDataLoaded(true);
        setReady(true);
      });
    }
  }, []);

  // Setup tab data on mount and when data is loaded
  useEffect(() => {
    if (dataLoaded) {
      // set the date slider to the mobility data dates.
      changeDates(dates, mobilityDates, selectedDateIndex, setDates, setSelectedDateIndex);

      // TODO: A better way of doing this if we keep the country select around.
      changeCountrySelectEntries(
        eacCountries,
        selectedCountryId,
        setCountrySelectEntries,
        setSelectedCountryId
      );
    }
  }, [activeTab, dataLoaded]);

  const chartData = useMemo(() => {
    if (dataLoaded) {
      const alpha3 = eacCountries[selectedCountryId].alpha3,
        countryId = codeToId[alpha3],
        dataByDate = !!countryData ? countryData[selectedLayer] : {};

      return Object.entries(dataByDate)
        .sort((kv1, kv2) => (kv1[0] > kv1[0] ? 1 : -1))
        .map(([date, value]) => ({
          x: new Date(date).getTime(),
          y: value
        }));
    } else {
      return null;
    }
  }, [selectedLayer, mobilityData, selectedCountryId, dataLoaded]);

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
  }, [selectedLayer, selectedDateIndex, mapInitNeeded]);

  const mapInit = map => {
    if (mapInitNeeded) {
      map.fitBounds([[24.12, -11.78], [41.89, 12.26]]);
      setMapInitNeeded(false);
    }
  };

  const popup = popupEnabled ? (
    <PopupContent
      feature={popupDetails.feature}
      coordinates={popupDetails.coords}
      mobilityData={mobilityData}
      aggType={aggType}
      selectedDate={selectedDate}
    />
  ) : null;

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
                  <div className="color-circle" style={{ backgroundColor: config.color }}></div>
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
                    <span>
                      <MenuItem
                        onClick={handleClick}
                        active={selectedLayer == layerId}
                        key={layerId}
                        text={mobilityLayerConfig[layerId].label}
                      />
                    </span>
                  );
                }}
                filterable={false}
                noResults={<MenuItem disabled={true} text="No results." />}
                onItemSelect={item => {
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
                onViewportChange={viewport => setViewport(viewport)}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/light-v9"
                accessToken={MAPBOX_ACCESS_TOKEN}
                renderWorldCopies={false}
                maxBounds={[[-180,-90], [180,90]]}
                ref={mapElement}
              >
                <MapContext.Consumer>
                  {map => {
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
                  onHover={e => {
                    setPopupDetails({ coords: e.lngLat, feature: e.features[0] });
                    setPopupEnabled(true);
                  }}
                  onLeave={e => {
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
                    "line-width": ["interpolate", ["linear"], ["zoom"], 3, 0.5, 10, 3],
                    "line-color": "#000",
                    "line-opacity": 0.25
                  }}
                />
                <Source {...maskLayerSource} />
                {popup}
                <Layer {...maskLayerStyle} />
                <Legend classBreaks={currentBreaks} selectedLayer={selectedLayer} />
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
                    {eacCountries[selectedCountryId].name} data not available
                  </h3>
                  <p>Try switching to a different country to view its mobility indicators</p>
                  <h3 className="moblity-data-not-available-footer">Other countries</h3>
                </>
              )}
              {countryDataAvailable && (
                <div className="item">
                  <div className="item-label">Compared to pre-COVID baseline</div>
                  <div className="item-number" style={{ color: selectedLayerConfig.color }}>
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
                  value={!!countryData ? countryData[selectedLayer][selectedDate] : 0}
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
            <section style={{ padding: "0 10px 10px" }}>
              <div className="source">
                <b>Source:</b>{" "}
                <a href="https://www.google.com/covid19/mobility/">Google Mobility Data</a>
              </div>
            </section>
          </>
        </div>
      </main>
    </div>
  ) : (
    <Loading />
  );
};