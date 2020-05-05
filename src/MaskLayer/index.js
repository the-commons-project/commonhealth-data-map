import React from "react";

import { Layer, Source } from "@urbica/react-map-gl";

import "../../node_modules/@blueprintjs/datetime/lib/css/blueprint-datetime.css";

const maskLayerSource = {
  id: "eac-mask-source",
  type: "geojson",
  data: "/eac-mask.json",
};

const maskLayer = {
  id: "eac-mask",
  type: "fill",
  source: "eac-mask-source",
  layout: {},
  paint: {
    "fill-color": "#000",
    "fill-opacity": 0.25,
  },
};

export default () => {
  return (
    <>
      <Source {...maskLayerSource} />
      <Layer {...maskLayer} />
    </>
  );
};
