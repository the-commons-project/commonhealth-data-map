import * as _ from "underscore";

const maxSizeForGlobal = 40;
const maxSizeForEAC = 1000;

export function getCirclePaintStyle(activeCaseType) {
  const visible = ["number", ["feature-state", "visible"], 0],
    isActive = ["number", ["feature-state", "isActive"], 0],
    cases = ["number", ["feature-state", "cases"], 0];

  return {
    "circle-opacity": [
      "case",
      // Check to make sure property is not undefined
      ["==", visible, 1],
      1,
      0
    ],
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["sqrt", cases],
      0,
      0,
      1250, // Square root of US total cases, around 1.55M on May 21, 2020
      maxSizeForGlobal
    ],
    "circle-stroke-width": [
      "interpolate",
      ["linear"],
      ["zoom"],
      0,
      0.5,
      6,
      1.5
    ],
    "circle-stroke-opacity": 1,
    "circle-opacity": 0.85,
    "circle-color": [
      "case",
      ["==", isActive, 1],
      activeCaseType.colorHex,
      "rgb(220, 220, 220)"
    ]
  };
}
