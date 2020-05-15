import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { MapboxLayer } from "@deck.gl/mapbox";
import { ScatterplotLayer } from "@deck.gl/layers";
import MapGL, { CustomLayer } from "@urbica/react-map-gl";
import { Button, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import groupBy from "lodash.groupby";
import keyBy from "lodash.keyby";

import MaskLayer from "../MaskLayer";

import "../../node_modules/@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import 'mapbox-gl/dist/mapbox-gl.css';

import {
  eacCodes,
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

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiYXphdmVhIiwiYSI6IkFmMFBYUUUifQ.eYn6znWt8NzYOa3OrWop8A";

export default () => {
  const config = useContext(ConfigurationContext);

  const [viewport, setViewport] = useState(config.defaults.viewport);

  const [activeCaseType, setActiveCaseType] = useState(caseTypes[0]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const radius = 50;

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
    cases: {
      caseData,
      setCaseData,
      indexedCaseData,
      setIndexedCaseData,
      caseDates,
      setCaseDates,
    },
  } = useContext(StateContext);

  // Set the active tab.
  useEffect(() => setActiveTab(tabCodes.mobility), [setActiveTab]);

  useEffect(() => {
    if (!dataLoaded) {
      fetch("/data/jhu-case-data.json")
        .then((response) => response.json())
        .then((data) => {
          const loadedDates = Array.from(
            new Set(data.map((d) => d.date))
          ).sort();
          const grouped = groupBy(data, "date");
          const indexed = Object.entries(grouped).reduce(
            (acc, [k, v]) => ({
              ...acc,
              [k]: keyBy(v, "code"),
            }),
            {}
          );
          setCaseDates(loadedDates);
          setCaseData(data);
          setIndexedCaseData(indexed);
          setReady(true);
          setDataLoaded(true);
        });
    }
  }, [dataLoaded, setCaseData, setCaseDates, setIndexedCaseData, setReady]);

  // Setup tab data on mount and when data is loaded
  useEffect(() => {
    if (dataLoaded) {
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
  }, [activeTab, dataLoaded]);

  const activeData = dataLoaded
    ? indexedCaseData[dates[selectedDateIndex]]
    : null;

  const chartTime = dataLoaded
    ? new Date(dates[selectedDateIndex]).getTime()
    : undefined;

  const isSelectedCountry = useCallback(
    (countryCode, countryName) => {
      return (
          selectedCountryId === countryCode ||
              selectedCountryId === 'global' ||
              (selectedCountryId === "eac" && eacCodes.includes(countryCode))
      );
    },
    [selectedCountryId]
  );

  const chartData = useMemo(
    () =>
      caseData
        .filter((d) => d.code === selectedCountryId)
        .sort((a, b) => (a.date > b.date ? 1 : -1))
        .map((d, i) => ({
          x: new Date(d.date).getTime(),
          y: d[activeCaseType.id],
        })),
    [activeCaseType.id, caseData, selectedCountryId]
  );

  const scatterPlotLayer = useMemo(
    () =>
      new MapboxLayer({
        id: "scatter-layer",
        type: ScatterplotLayer,
        minZoom: 8,
        maxZoom: 12,
        opacity: 0.4,
        filled: true,
        stroked: true,
        highlightColor: [87, 102, 32],
        lineWidthUnits: "pixels",
        getPosition: (d) => d.coordinates,
        pickable: true,
      }),
    []
  );

  scatterPlotLayer.setProps({
    data: caseData.filter((d) => !!d.coordinates && d.date === dates[selectedDateIndex]),
    getLineWidth: (d) =>
          isSelectedCountry(d.code, d.name) ? 1 : 0.5,
    getRadius: (d) =>
          radius * 700 * Math.pow(d[activeCaseType.id], 0.3),
    getFillColor: (d) =>
          isSelectedCountry(d.code, d.name)
          ? activeCaseType.colorArray
          : [220, 220, 220],
  });

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
                mapStyle="mapbox://styles/mapbox/light-v9"
                maxBounds={[
                  [-180, -90],
                  [180, 90],
                ]}
                accessToken={MAPBOX_ACCESS_TOKEN}
                renderWorldCopies={false}
              >
                <CustomLayer layer={scatterPlotLayer} />
                { config.features.maskFeature && <MaskLayer /> }
              </MapGL>
            </div>
          </section>
        </div>
        <div className="secondary">
          {dataLoaded && !!activeData && (
            <>
              <section className={`section-numeral`}>
                <Numbers eac={activeData[selectedCountryId]} />
                {config.features.tableFeature &&
                  selectedCountryId === "eac" && (
                    <Table countries={activeData} />
                  )}
              </section>
              <section className="section-chart">
                <Chart
                  color={activeCaseType.colorHex}
                  data={chartData}
                  date={chartTime}
                  indicator={activeData[selectedCountryId][activeCaseType.id]}
                />
              </section>
              {config.features.tableFeature &&
               selectedCountryId !== "eac" && (
                <section className="section-numeral">
                  <h3 style={{ marginTop: 0 }}>Other countries</h3>
                  <Table
                    countries={activeData}
                    selectedCountryId={selectedCountryId}
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
