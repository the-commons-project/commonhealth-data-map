import * as _ from 'underscore';

export function getCirclePaintStyle(activeCaseType) {
  const visible = ["number", ["feature-state", "visible"], 0],
        isActive = ["number", ["feature-state", "isActive"], 0],
        radius = ["number", ["feature-state", "radius"], 10],
        lineWidth = ["number", ["feature-state", "lineWidth"], 0.5];

  return {
    "circle-opacity": [
      'case',
      // Check to make sure property is not undefined
      ['==', visible, 1],
      1,
      0
    ],
    "circle-radius": [
    "interpolate",
      ["exponential", 2],
      ["zoom"],
      0, ["*", 0.00001, radius],
      18, radius
    ],
    "circle-stroke-width": lineWidth,
    "circle-color": [
      'case',
      ['==', isActive, 1],
      activeCaseType.colorHex,
      "rgb(220, 220, 220)"
      ]
  };
}
