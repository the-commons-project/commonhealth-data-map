import React, { useContext} from "react";

import { ConfigurationContext } from "../ConfigurationProvider";

export default function Table({
  countries,
  selectedCountryId,
  nationalData,
  selectedDate,
  alpha2ToId,
  maxDatePerId
}) {
  const config = useContext(ConfigurationContext);

  const codes = selectedCountryId ? (
    Object.keys(countries).filter((c) => c !== selectedCountryId)
  ) : Object.keys(countries);

  const rows = codes.map((code) => {
    const country = countries[code],
          countryId = alpha2ToId[country.alpha2],
          countryData = nationalData[countryId],
          dataDate = new Date(selectedDate).getTime() > maxDatePerId[countryId]['time'] ? (
              maxDatePerId[countryId]['date']
          ) : selectedDate,
          rowData = countryData['dates'][dataDate];

    return (
      <tr key={countryId}>
        <td>
          {config.features.showFlagsFeature && country.hasFlag && (
            <img
              className="table-icon"
              src={`/flag-${code}.png`}
              alt=""
            />
          )}
          {country.name}
        </td>
        <td className="table-number color-cases">{rowData.cases}</td>
        <td className="table-number color-active">{rowData.active}</td>
        <td className="table-number color-recovered">{rowData.recovered}</td>
        <td className="table-number color-deaths">{rowData.deaths}</td>
      </tr>
    );
  });

  return (
      <div className="table-container">
      <div className="table-wrapper">
      <table className="table-cases">
      <thead>
      <tr>
      <th>Country</th>
      <th className="table-number">Total cases</th>
      <th className="table-number">Active</th>
      <th className="table-number">Recovered</th>
      <th className="table-number">Deaths</th>
      </tr>
      </thead>
      <tbody>{rows}</tbody>
      </table>
      </div>
      </div>
  );
}
