import React from "react";
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  ChartLabel,
  HorizontalGridLines,
  LineSeries,
  MarkSeries,
} from "react-vis";
import "../../node_modules/react-vis/dist/style.css";

import { abbreviateNumber } from "../util";

class Chart extends React.Component {
  componentDidMount() {}

  render() {
    const { color, data, date, indicator } = this.props;
    return (
      <div className="chart-container">
        <FlexibleXYPlot xType="time" height={300}>
          <HorizontalGridLines />
          <XAxis tickTotal={3} />
          <YAxis tickTotal={6} tickFormat={(v) => abbreviateNumber(v)} />
          <ChartLabel
            className="alt-x-label"
            includeMargin={false}
            xPercent={0.025}
            yPercent={1.01}
          />
          <ChartLabel
            className="alt-y-label"
            includeMargin={false}
            xPercent={0.06}
            yPercent={0.06}
            style={{
              transform: "rotate(-45)",
              textAnchor: "end",
            }}
          />
          <LineSeries strokeWidth={3} color={color} className="second-series" data={data} />
          <MarkSeries
            className="mark-series-example"
            strokeWidth={2}
            opacity="1"
            color={color}
            stroke="#fff"
            sizeRange={[4, 6]}
            data={[
              {
                x: date,
                y: indicator,
                size: 4,
              },
            ]}
          />
        </FlexibleXYPlot>
      </div>
    );
  }
}

export default Chart;
