import React from "react";
import * as _ from "underscore";
import { Popup } from "@urbica/react-map-gl";
import { mobilityLayerConfig } from "./config";
import { formatNumber } from "../util";

export default function PopupContent({
  feature,
  coordinates,
  mobilityData,
  aggType,
  selectedDate
}) {
  if (!feature) return null;

  let name = feature.properties["NAME_LONG"];

  const rows = _.pairs(mobilityLayerConfig).map(function(kv) {
    const strId = feature.id ? feature.id.toString() : null,
      countryData = strId ? mobilityData[feature.id] : null,
      layerData = countryData ? countryData[kv[0]] : null,
      valueAtDate = layerData ? layerData[selectedDate] : null,
      value = valueAtDate ? valueAtDate : 0.0;

    return (
      <tr key={`popup-${kv[0]}`}>
        <th>{kv[1].label}</th>
        <td>{formatNumber(value)}%</td>
      </tr>
    );
  });

  const content = (
    <>
      <div className="popup-heading">{name}</div>
      <table>
        <tbody>{rows}</tbody>
      </table>
    </>
  );

  return (
    <Popup closeButton={false} longitude={coordinates.lng} latitude={coordinates.lat}>
      {content}
    </Popup>
  );
}
