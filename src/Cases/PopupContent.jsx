import React from "react";
import * as _ from "underscore";
import { Popup } from "@urbica/react-map-gl";
import { formatNumber } from "../util";

export default function PopupContent({
  object
}) {
  if (!object) return null;

  const name = object.name,
        date = object.date,
        confirmed = object.cases,
        active = object.active,
        recovered = object.recovered,
        deaths = object.deaths;

  const rows = [
    <tr key='popup-confirmed'>
      <th>Confirmed</th>
      <td>{formatNumber(confirmed)}</td>
    </tr>,
    <tr key='popup-active'>
      <th>Active</th>
      <td>{formatNumber(active)}</td>
    </tr>,
    <tr key='popup-recovered'>
      <th>Recovered</th>
      <td>{formatNumber(recovered)}</td>
    </tr>,
    <tr key='popup-deaths'>
      <th>Deaths</th>
      <td>{formatNumber(deaths)}</td>
    </tr>
  ];

  const content = (
    <>
      <div className="popup-heading">{name}</div>
      <div className="popup-date">{date}</div>
      <table>
        <tbody>{rows}</tbody>
      </table>
    </>
  );
  return (
    <Popup closeButton={false} longitude={object.coordinates[0]} latitude={object.coordinates[1]}>
      {content}
    </Popup>
  );
}
