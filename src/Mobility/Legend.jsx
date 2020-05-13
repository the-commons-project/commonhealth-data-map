import React from 'react';
import { getBreaksStyle } from './mapStyles';
import { formatNumber } from '../util';

export default function Legend({
  classBreaks,
  selectedLayer
}) {
    if (!classBreaks) return null;
    const { colors } = getBreaksStyle(
        classBreaks,
        selectedLayer
    );

    const legendSteps = colors.map((color, i) => {
        const from = formatNumber(classBreaks[i], 0);
        return (
            <React.Fragment key={`break-${i}`}>
                <div
                    className="legend-color"
                    style={{ backgroundColor: color }}
                ></div>

                <div className="legend-numbers">
                    {from}%
                </div>
            </React.Fragment>
        );
    });
    return (
        <div className="legend-container">
            <div id="legend">{legendSteps}</div>
        </div>
    );
}
