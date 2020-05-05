import React from "react";

import { eacCodes, eacCountries } from "../util";

export default function Table({
  selectedCountryId,
  selectedLayer,
  selectedDate,
  mobilityData,
  codeToId
}) {
  const codes = selectedCountryId ? eacCodes.filter((c) => c !== selectedCountryId) : eacCodes;
  const rows = codes.map((code) => {
    const country = eacCountries[code];
    const countryId = codeToId[country.alpha3];
    let value = 'No Data';
    if(countryId in mobilityData) {
      const v = mobilityData[countryId][selectedLayer][selectedDate];
      if(v > 0) {
        value = `+${v}%`;
      } else {
        value = `${v}%`;
      }
    }
    return code !== "eac" ? (
      <tr key={code}>
        <td>
          <img
            className="table-icon"
            src={`/flag-${code}.png`}
            alt={`Flag for ${country.name}`}
          />
          {country.name}
        </td>
        <td className={`table-number color-mobility-{selectedLayer`}>
         {value}
        </td>
      </tr>
    ) : (
      false
    );
  });
  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="table-cases">
          <thead>
            <tr>
              <th>Country</th>
              <th className="table-number">Compared</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </div>
  );
}
