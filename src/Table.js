import React from "react";

import { eacCodes } from "./util";

class Numbers extends React.Component {
  render() {
    const { countries } = this.props;
    const rows = eacCodes.map(code => {
      const country = countries[code];

      return code !== "eac" ? (
        <tr>
          <th>
            <img
              className="table-icon"
              src={`/flag-${country.code}.png`}
              alt={`Flag for ${country.name}`}
            />
            {country.name}
          </th>
          <th className="table-number color-cases">{country.cases}</th>
          <th className="table-number color-active">{country.active}</th>
          <th className="table-number color-recovered">{country.recovered}</th>
          <th className="table-number color-deaths">{country.deaths}</th>
        </tr>
      ) : (
        ""
      );
    });
    return (
      <table className="table-cases">
        <thead>
          <tr>
            <td>Country</td>
            <td className="table-number">Total cases</td>
            <td className="table-number">Active</td>
            <td className="table-number">Recovered</td>
            <td className="table-number">Deaths</td>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

export default Numbers;
