import React from "react";

import { formatNumber } from "../util";

export default function Numbers({
  selectedData
}) {
  return (
    <div className="numbers">
      <div className="item">
        <div className="item-label">Confirmed</div>
        <div className="item-number color-cases">{selectedData.cases ? formatNumber(selectedData.cases) : "–"}</div>
        <div className="item-change color-cases">
          {selectedData.cases_change && selectedData.cases_change >= 0 ? "+" : ""}
          {selectedData.cases_change ? formatNumber(selectedData.cases_change) : "–"}
        </div>
      </div>
      <div className="item">
        <div className="item-label">Active</div>
        <div className="item-number color-active">
          {selectedData.active ? formatNumber(selectedData.active) : "–"}
        </div>
        <div className="item-change color-active">
          {selectedData.active_change && selectedData.active_change >= 0 ? "+" : ""}
          {selectedData.active_change ? formatNumber(selectedData.active_change) : "–"}
        </div>
      </div>
      <div className="item">
        <div className="item-label">Recovered</div>
        <div className="item-number color-recovered">
          {selectedData.recovered ? formatNumber(selectedData.recovered) : "–"}
        </div>
        <div className="item-change color-recovered">
          {selectedData.recovered_change && selectedData.recovered_change >= 0 ? "+" : ""}
          {selectedData.recovered_change ? formatNumber(selectedData.recovered_change) : "–"}
        </div>
      </div>
      <div className="item">
        <div className="item-label">Deaths</div>
        <div className="item-number color-deaths">
          {selectedData.deaths ? formatNumber(selectedData.deaths) : "–"}
        </div>
        <div className="item-change color-deaths">
          {selectedData.deaths_change && selectedData.deaths_change >= 0 ? "+" : ""}
          {selectedData.deaths_change ? formatNumber(selectedData.deaths_change) : "–"}
        </div>
      </div>
    </div>
  );
}
