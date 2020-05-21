import React from "react";
import * as _ from "underscore";
import { Popup } from "@urbica/react-map-gl";
import { formatNumber } from "../util";

export default function PopupContent({
  details,
  data,
  selectedDate,
  maxDatePerId
}) {
  if (!details) return null;

  if(!(details.feature.id in data)) return null;

  const key = details.feature.id,
        valueDate = (new Date(selectedDate).getTime() > maxDatePerId[key]['time'] ? (
          maxDatePerId[key]['date']) : selectedDate),
        caseInfo = data[key]['dates'][valueDate];

  const geom = details.feature.geometry,
        name = details.feature.properties.displayName,
        date = valueDate,
        confirmed = caseInfo.cases,
        active = caseInfo.active,
        recovered = caseInfo.recovered,
        deaths = caseInfo.deaths;

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
    <Popup closeButton={false} longitude={geom.coordinates[0]} latitude={geom.coordinates[1]}>
      {content}
    </Popup>
  );
}
