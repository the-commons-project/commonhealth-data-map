import React, { useState } from "react";
import MapGL, {
  Popup,
  Layer,
  Source,
  MapContext,
  AttributionControl
} from "@urbica/react-map-gl";

import CapacityLayerControl from "./CapacityLayerControl.jsx";
import "./index.css";

import MaskLayer from "../MaskLayer";


const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiYXphdmVhIiwiYSI6IkFmMFBYUUUifQ.eYn6znWt8NzYOa3OrWop8A";

const facilityLayerSource = {
  id: "facilities",
  type: 'vector',
  tiles: [
    window.location.origin +
      '/data/capacity/tiles/facilities/{z}/{x}/{y}.pbf',
  ],
  minzoom: 1,
  maxzoom: 12,
};


const hospitalColor = "#46008C";

const facilityLayer = {
  id: "facilities",
  before: "eac-mask",
  type: "circle",
  source: "facilities",
  "source-layer": "facilities",
  layout: {},
  paint: {
    "circle-opacity": ["interpolate", ["linear"], ["zoom"], 4, 0.2, 10, 0.8],
    "circle-color": hospitalColor,
    "circle-radius": ["interpolate", ["exponential", 1.7], ["zoom"], 4, 1.5, 10, 15],
    "circle-stroke-color": "#46008C",
    "circle-stroke-width": ["interpolate", ["linear"], ["zoom"], 4, 0, 10, 0.5]
  }
};

const popLayerSource = {
  id: 'population-density',
  type: 'raster',
  tiles: ['https://s3.amazonaws.com/com.azavea.datahub.tms/worldpop/2020/blue/{z}/{x}/{y}.png']
};

const popLayer = {
  id: "population-density",
  type: "raster",
  source: "population-density",
  minzoom: 0,
  maxzoom: 22
};

export default () => {
  const [popLayerEnabled, setPopLayerEnabled] = useState(true);

  const [facilityLayerEnabled, setFacilityLayerEnabled] = useState(true);

  const [popupEnabled, setPopupEnabled] = useState(false);
  const [popupProps, setPopupProps] = useState({
    "Facility name": "",
    Country: ""
  });
  const [popupLatLng, setPopupLatLng] = useState({ lat: 0, lng: 0 });

  const [viewport, setViewport] = useState({
    latitude: 0.27,
    longitude: 33.45,
    zoom: 4,
    bearing: 0,
    pitch: 0
  });

  return (
    <div className="map-container">
      <MapGL
        {...viewport}
        minZoom={1}
        onViewportChange={(viewport) => setViewport(viewport)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/light-v9"
        accessToken={MAPBOX_ACCESS_TOKEN}
        renderWorldCopies={false}
        maxBounds={[[-180,-90], [180,90]]}
        attributionControl={false}
      >

        {/* Population Density Layer */}
        { popLayerEnabled ? (
          <>
            <Source {...popLayerSource} />
            <Layer
              {...popLayer}
              before={ facilityLayerEnabled ? 'facilities' : 'eac-mask' }
            />
          </>) :
          <></>
        }
        {/* Health Facility Layer */}
        { facilityLayerEnabled ? (
          <>
            <Source {...facilityLayerSource} />
            <Layer
              {...facilityLayer}
              onHover={e => {
                setPopupEnabled(true);
                setPopupProps(e.features[0].properties);
                setPopupLatLng(e.lngLat);
              }}
              onLeave={e => {
                setPopupEnabled(false);
              }}
            />
            <MapContext.Consumer>
              {map => {
                map.on("mousemove", "facilities", (e) => {
                  map.getCanvas().style.cursor = 'default';
                });
              }}
            </MapContext.Consumer>
          </>) :
          <></>
        }

        { popupEnabled ?
          <Popup
            latitude={popupLatLng.lat}
            longitude={popupLatLng.lng}
            closeButton={false}
          >
            <div className="popup-content">
              <div className="popup-heading">{`${popupProps["Facility name"]}`}</div>
              <div className="popup-type">{`${popupProps["Facility type"]}`}</div>
            </div>
          </Popup> : (
            <></>
          )}

        {/* Mask Layer */}
        <MaskLayer />

        {/* Layer Control */}
        <CapacityLayerControl
          facilityLayerColor={hospitalColor}
          setPopLayerStatus={setPopLayerEnabled}
          setFacilityLayerStatus={setFacilityLayerEnabled}
        ></CapacityLayerControl>
        <AttributionControl
          compact={false}
          position='bottom-right'
          customAttribution='Health Facilities via <a href="https://www.who.int/malaria/areas/surveillance/public-sector-health-facilities-ss-africa/en/">World Health Organization</a>. Population via <a href="https://www.worldpop.org/">WorldPop</a>'
        />
      </MapGL>
    </div>
  );
};