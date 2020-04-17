import React from "react";
import { eacCodes, eacCountries, caseTypes } from "./util";
import Loading from "./Loading";
import Chart from "./Chart";
import Numbers from "./Numbers";
import Table from "./Table";
import { MapboxLayer } from "@deck.gl/mapbox";
import { ScatterplotLayer } from "@deck.gl/layers";
import MapGL, { CustomLayer, Layer, Source } from "@urbica/react-map-gl";
import { withRouter } from "react-router-dom";

import { Slider, Button, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import { DateInput } from "@blueprintjs/datetime";
import "../node_modules/@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import moment from "moment";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiYXphdmVhIiwiYSI6IkFmMFBYUUUifQ.eYn6znWt8NzYOa3OrWop8A";

class Dashboard extends React.Component {
  formatDateToData = date => {
    return moment(date).format("YYYY-MM-DD");
  };
  formatDateReadable = date => {
    return moment(date).format("l");
  };
  state = {
    viewport: {
      latitude: 0.27,
      longitude: 33.45,
      zoom: 4,
      bearing: 0,
      pitch: 0
    },
    activeDate: 0,
    activeType: caseTypes[0],
    activeCountry: this.props.match.params.countryId
      ? this.props.match.params.countryId
      : "eac",
    radius: 50,
    continentZoom: {
      Africa: 3,
      "North America": 3,
      "South America": 2.5,
      Europe: 2.75,
      Asian: 2.5,
      Oceania: 3.25,
      Australia: 3.25
    }
  };

  hover = false;

  handleDateSliderChange = event => {
    this.setState({
      activeDate: parseInt(event)
    });
  };

  handleDateInputChange = event => {
    const dateFormatted = this.formatDateToData(event);
    const dateIndex = this.state.dates.indexOf(dateFormatted);
    this.setState({
      activeDate: dateIndex !== -1 ? dateIndex : this.state.dates.length - 1
    });
  };

  handleRadiusChange = event => {
    this.setState({
      radius: parseInt(event.target.value) + 1
    });
  };

  handleCountryChange = countryCode => {
    this.setState({
      activeCountry: countryCode
    });
  };

  getDate = number => {
    return this.state.dates[number];
  };

  getActiveData = () => {
    return Object.assign(
      {},
      ...this.data
        .filter(d => {
          return (
            d.date === this.getDate(this.state.activeDate) &&
            eacCodes.includes(d.code)
          );
        })
        .map(item => ({ [item.code]: item }))
    );
  };

  getMapData = () =>
    this.data.filter(d => d.date === this.getDate(this.state.activeDate));

  getChartData = countryCode =>
    this.data
      .filter(d => d.code === countryCode)
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .map((d, i) => ({
        x: new Date(d.date).getTime(),
        y: d[this.state.activeType.id]
      }));

  setDates = data => {
    const dates = Array.from(new Set(data.map(d => d.date))).sort();
    const activeDate = dates.length - 1;
    return this.setState({ dates, activeDate });
  };

  maskLayerSource = {
    id: "maine",
    type: "geojson",
    data: "/eac-mask.json"
  };

  maskLayerStyle = {
    id: "maine",
    type: "fill",
    source: "maine",
    layout: {},
    paint: {
      "fill-color": "#000",
      "fill-opacity": 0.25
    }
  };

  changeCountry = countryCode => {
    console.log(countryCode);
    this.setState({ activeCountry: countryCode });
  };

  setTooltip = (object, x, y) => {
    object && !this.state.hover && this.setState({ hover: true });
    !object && this.setState({ hover: false });
  };

  isSelectedCountry = (countryCode, countryName) => {
    return (
      this.state.activeCountry === countryCode ||
      (this.state.activeCountry === "eac" && eacCodes.includes(countryCode))
    );
  };

  myScatterplotLayer = new MapboxLayer({
    id: "scatter-layer",
    type: ScatterplotLayer,
    minZoom: 8,
    maxZoom: 12,
    opacity: 0.4,
    filled: true,
    stroked: true,
    highlightColor: [87, 102, 32],
    lineWidthUnits: "pixels",
    getLineWidth: d =>
      d.code === "eac" ? 0 : this.isSelectedCountry(d.code, d.name) ? 1 : 0.5,
    getPosition: d => d.coordinates,
    getRadius: d =>
      d.code === "eac"
        ? 0
        : this.state.radius * 700 * Math.pow(d[this.state.activeType.id], 0.3),
    getFillColor: d =>
      d.code === "eac"
        ? 0
        : this.isSelectedCountry(d.code, d.name)
        ? this.state.activeType.colorArray
        : [220, 220, 220],
    pickable: true
  });

  renderList = (item, { handleClick, modifiers }) => {
    const country = eacCountries[item];
    return (
      <span title="Currently in development">
        <MenuItem
          onClick={handleClick}
          active={modifiers.active}
          disabled={country.disabled}
          key={item}
          text={country.name}
        />
      </span>
    );
  };

  componentDidMount() {
    fetch("/jhu-data-for-viz.json")
      .then(response => response.json())
      .then(data => {
        this.data = data;
        this.setDates(this.data);
      });
  }

  render() {
    const { activeDate, dates, viewport } = this.state;

    const countries = this.data ? this.getActiveData() : undefined;

    const chartData = this.data
      ? this.getChartData(this.state.activeCountry)
      : undefined;

    const chartTime = this.data
      ? new Date(this.getDate(this.state.activeDate)).getTime()
      : undefined;

    const loaded = this.data;

    loaded &&
      this.myScatterplotLayer.setProps({
        data: this.getMapData()
      });

    return loaded ? (
      <main className={`viz hover-${this.state.hover}`}>
        <header className="header-primary">
          <div className="header-logo">
            <img src="/eac-logo.png" alt="East African Community (EAC) logo" />
          </div>
          <div className="header-title">CommonHealth Data Map</div>
          <div className="header-icons">
            <img title="Currently in development" src="/icon-bars.svg" alt="Menu" />
          </div>
        </header>
        <header className="header-secondary">
          <nav className="header-tabs">
            <ul>
              <li className="active">Overview</li>
              <li className="disabled" title="Currently in development">
                Cases
              </li>
              <li className="disabled" title="Currently in development">
                Symptoms
              </li>
              <li className="disabled" title="Currently in development">
                Mobility
              </li>
              <li className="disabled" title="Currently in development">
                Capacity
              </li>
            </ul>
          </nav>
          <div className="header-controls">
            <div className="controls-country">
              <Select
                items={eacCodes}
                popoverProps={{ minimal: true }}
                itemRenderer={this.renderList}
                filterable={false}
                noResults={<MenuItem disabled={true} text="No results." />}
                onItemSelect={this.changeCountry}
              >
                <Button
                  text={eacCountries[this.state.activeCountry].name}
                  rightIcon="double-caret-vertical"
                />
              </Select>
            </div>
            <div className="controls-date">
              <div className="slider">
                <DateInput
                  popoverProps={{ minimal: true }}
                  formatDate={date => this.formatDateReadable(date)}
                  minDate={new Date(moment(this.state.dates[0], "YYYY-MM-DD"))}
                  maxDate={
                    new Date(
                      moment(this.state.dates[dates.length - 1], "YYYY-MM-DD")
                    )
                  }
                  onChange={this.handleDateInputChange}
                  parseDate={str => new Date(str)}
                  canClearSelection={false}
                  placeholder={"Select date"}
                  value={
                    new Date(moment(this.state.dates[this.state.activeDate]))
                  }
                />
              </div>
            </div>
            <Slider
              min={0}
              max={dates.length - 1}
              onChange={this.handleDateSliderChange}
              value={activeDate}
              labelRenderer={number =>
                this.formatDateReadable(this.state.dates[number])
              }
              stepSize={1}
              labelStepSize={(this.state.dates.length - 1) / 2}
              showTrackFill={false}
            />
          </div>
        </header>
        <div className="main">
          <div className="type-toggle">
            <h2 className="type-heading">Map</h2>
            <div className="type-buttons">
              <Button
                minimal={true}
                active={this.state.activeType.id === "cases"}
                onClick={() => {
                  this.setState({ activeType: caseTypes[0] });
                }}
              >
                <div className="color-circle background-color-cases"></div>
                Confirmed
              </Button>
              <Button
                minimal={true}
                active={this.state.activeType.id === "active"}
                onClick={() => {
                  this.setState({ activeType: caseTypes[1] });
                }}
              >
                <div className="color-circle background-color-active"></div>
                Active
              </Button>
              <Button
                minimal={true}
                active={this.state.activeType.id === "recovered"}
                onClick={() => {
                  this.setState({ activeType: caseTypes[2] });
                }}
              >
                <div className="color-circle background-color-recovered"></div>
                Recovered
              </Button>
              <Button
                minimal={true}
                active={this.state.activeType.id === "deaths"}
                onClick={() => {
                  this.setState({ activeType: caseTypes[3] });
                }}
              >
                <div className="color-circle background-color-deaths"></div>
                Deaths
              </Button>
            </div>
          </div>
          <div className="map-container">
            <MapGL
              {...viewport}
              onViewportChange={viewport => this.setState({ viewport })}
              style={{ width: "100%", height: "100%" }}
              mapStyle="mapbox://styles/mapbox/light-v9"
              accessToken={MAPBOX_ACCESS_TOKEN}
            >
              <CustomLayer layer={this.myScatterplotLayer} />
              <Source {...this.maskLayerSource} />
              <Layer {...this.maskLayerStyle} />
            </MapGL>
          </div>
        </div>
        <div className="sidebar">
          <Numbers eac={countries.eac} />
          <Table countries={countries} />
          <Chart
            color={this.state.activeType.colorHex}
            data={chartData}
            date={chartTime}
            indicator={countries.eac[this.state.activeType.id]}
          />
          <div className="source">
            <b>Source:</b> EAC Secretariat
          </div>
        </div>
      </main>
    ) : (
      <Loading />
    );
  }
}

export default withRouter(Dashboard);
