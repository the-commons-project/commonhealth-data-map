import * as _ from 'underscore';
import { mobilityLayerConfig, aggregationTypes } from './config';
import * as interpolate from 'color-interpolate';

export const getLayerPaint = (aggTypeMatchValue) => {
  return (dates, breaks, dateIndex, layer, aggType) => {
    // Fill based on breaks only if this layer matches the
    // defined aggregation type, else just render it transparent
    // (effectively turning the layer off)
    if (breaks && aggType === aggTypeMatchValue) {
      return getFillPaintStyle(dates, breaks, dateIndex, layer, aggType);
    }
    return { 'fill-color': 'transparent' };
  };
};

function getFillPaintStyle(dates, breaks, dateIndex, layer, aggType) {
  const { colorBreaks } = getBreaksStyle(
    breaks,
    layer,
  );

  let number = ["number", ["feature-state", "value"], 0];
  let hasValue = ["number", ["feature-state", "hasValue"], 0];

  return {
    'fill-color': [
      'case',
      // Check to make sure property is not undefined
      ['==', hasValue, 1],
      ["interpolate",
       ["linear"],
       number
      ].concat(colorBreaks),
      // If there isn't data, make it transparent.
      'rgba(0, 0, 0, 0)',
      ]
  };
}

export const getBreaksStyle = (breaks, layer) => {
  const breaksValues = modifyBreaks(breaks),
  colorStops = mobilityLayerConfig[layer].colors,
  palette = interpolate(colorStops),
  colors = _.map([...Array(breaksValues.length).keys()], function(i) {
    return palette(i / breaksValues.length);
  }),
  colorBreaks = _.flatten(_.zip(breaksValues, colors));

  return {
    breaksValues,
    colors,
    colorBreaks
  };
};

export const modifyBreaks = (breaks) => {
  // TODO: Find a better way to handle this
  // Mapbox's step expression doesn't like it when one of the breakpoints is equal to the smallest
  // property value; this comes up some places in our map where the first breakpoint is 0, where it
  // won't style any of the features with a value of 0. I am temporarily getting around this by
  // adding a very small value to the break point when this happens.
  var modifiedBreaks = breaks.map(function (breakpoint, i) {
    if (i > 0 && breakpoint === breaks[i - 1]) {
      return breakpoint + 0.0000000000001;
    } else {
      return breakpoint;
    }
  });
  return modifiedBreaks;
};

export function getProperty(date, layer) {
  return date + '_' + layer;
}
