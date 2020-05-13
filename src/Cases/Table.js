import React from "react";

import { eacCodes } from "../util";

class Numbers extends React.Component {
  render() {
    const { countries, selectedCountryId } = this.props;
    const codes = selectedCountryId ? eacCodes.filter((c) => c !== selectedCountryId) : eacCodes;
    const rows = codes.map((code) => {
      const country = countries[code];
      return code !== "eac" ? (
        <tr key={country.code}>
          <td>
            <img
              className="table-icon"
              src={`/flag-${country.code}.png`}
              alt={`Flag for ${country.name}`}
            />
            {country.name}
          </td>
          <td className="table-number color-cases">{country.cases}</td>
          <td className="table-number color-active">{country.active}</td>
          <td className="table-number color-recovered">{country.recovered}</td>
          <td className="table-number color-deaths">{country.deaths}</td>
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
}

export default Numbers;
