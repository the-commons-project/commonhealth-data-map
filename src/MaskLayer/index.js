import React, { useContext } from "react";

import { Layer, Source } from "@urbica/react-map-gl";

import StateContext from "../State";

import "../../node_modules/@blueprintjs/datetime/lib/css/blueprint-datetime.css";

export default ({
  region, // Region for mask. If undefined, uses the selected country.
  opacity = 0.25
}) => {
  const {
    selectedCountryId
  } = useContext(StateContext);

  const maskRegion = !!region ? region : selectedCountryId;

  const maskLayerSource = {
    id: "eac-mask-source",
    type: "geojson",
    data: `/masks/${maskRegion}-mask.geojson`
  };

  const maskLayer = {
    id: "eac-mask",
    type: "fill",
    source: "eac-mask-source",
    layout: {},
    paint: {
      "fill-color": "#000",
      "fill-opacity": opacity,
    },
  };

  return (
    <>
      <Source {...maskLayerSource} />
      <Layer {...maskLayer} />
    </>
  );
};
