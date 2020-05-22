import React, { useContext } from "react";

import {
  Layer,
  Source,
  MapContext,
} from "@urbica/react-map-gl";

import StateContext from "../State";
import { ConfigurationContext } from "../ConfigurationProvider";

import "../../node_modules/@blueprintjs/datetime/lib/css/blueprint-datetime.css";


export default () => {
  const config = useContext(ConfigurationContext);

  const {
    setSelectedCountryId
  } = useContext(StateContext);

  const countrySource = {
    id: 'countries',
    type: "vector",
    tiles: [window.location.origin + "/data/tiles/country/{z}/{x}/{y}.pbf"],
    minzoom: 0,
    maxzoom: 8,
    promoteId: 'ADM0_A3_IS'
  };

  // A reverse index must be constructed to set the selected Country
  var reverseLookup = {};
  const entries = Object.entries(config.defaults.countries);
  for (const [name, obj] of entries) {
    reverseLookup[obj.alpha3] =  name;
  }

  const countryLayer = {
    id: "countries",
    type: "fill",
    source: "countries",
    'source-layer': "country",
    onClick: (e) => {
      const ADM3 = e.features[0].properties.ADM0_A3_IS;
      if (!!reverseLookup[ADM3]) {
        setSelectedCountryId(reverseLookup[ADM3]);
      }
    },
    paint: {
      'fill-color': "#000000",
      'fill-opacity': 0
    }
  };

  return (
    <>
      <MapContext.Consumer>
        {map => {
          map.on("mouseleave", "countries", (e) => map.getCanvas().style.cursor = '');
          map.on("mousemove", "countries", (e) => {
            if(e.features.length > 0) {
              const ADM3 = e.features[0].properties.ADM0_A3_IS;
              if (!!reverseLookup[ADM3]) {
                map.getCanvas().style.cursor = 'pointer';
              } else {
                map.getCanvas().style.cursor = '';
              }
            } else {
              map.getCanvas().style.cursor = '';
            }
          });
        }}
      </MapContext.Consumer>
      <Source {...countrySource} />
      <Layer {...countryLayer} />
    </>
  );
};
