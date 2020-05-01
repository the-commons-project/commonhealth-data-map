import React from "react";

import { formatNumber } from "../util";

class Numbers extends React.Component {
  render() {
    const { eac } = this.props;
    return (
      <div className="numbers">
        <div className="item">
          <div className="item-label">Confirmed</div>
          <div className="item-number color-cases">{eac.cases ? formatNumber(eac.cases) : "–"}</div>
          <div className="item-change color-cases">
            {eac.cases_change && eac.cases_change >= 0 ? "+" : ""}
            {eac.cases_change ? formatNumber(eac.cases_change) : "–"}
          </div>
        </div>
        <div className="item">
          <div className="item-label">Active</div>
          <div className="item-number color-active">
            {eac.active ? formatNumber(eac.active) : "–"}
          </div>
          <div className="item-change color-active">
            {eac.active_change && eac.active_change >= 0 ? "+" : ""}
            {eac.active_change ? formatNumber(eac.active_change) : "–"}
          </div>
        </div>
        <div className="item">
          <div className="item-label">Recovered</div>
          <div className="item-number color-recovered">
            {eac.recovered ? formatNumber(eac.recovered) : "–"}
          </div>
          <div className="item-change color-recovered">
            {eac.recovered_change && eac.recovered_change >= 0 ? "+" : ""}
            {eac.recovered_change ? formatNumber(eac.recovered_change) : "–"}
          </div>
        </div>
        <div className="item">
          <div className="item-label">Deaths</div>
          <div className="item-number color-deaths">
            {eac.deaths ? formatNumber(eac.deaths) : "–"}
          </div>
          <div className="item-change color-deaths">
            {eac.deaths_change && eac.deaths_change >= 0 ? "+" : ""}
            {eac.deaths_change ? formatNumber(eac.deaths_change) : "–"}
          </div>
        </div>
      </div>
    );
  }
}

export default Numbers;
