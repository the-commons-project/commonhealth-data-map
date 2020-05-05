import React, { useState } from "react";

export default function Legend({ setPopLayerStatus, setFacilityLayerStatus, facilityLayerColor }) {
  const [popLayerEnabled, setPopLayerEnabled] = useState(true);

  const [facilityLayerEnabled, setFacilityLayerEnabled] = useState(true);

  return (
    <div className="layer-select-container">
      <div id="layer-select">
        <h3>Layers</h3>
        {/* Facilities Layer Control */}
        <label className="layer-select-group">
          <input
            type="checkbox"
            checked={facilityLayerEnabled}
            onChange={e => {
              setFacilityLayerEnabled(e.target.checked);
              setFacilityLayerStatus(e.target.checked);
            }}
          ></input>
          <div className="layer-select-color" style={{ backgroundColor: facilityLayerColor }}></div>
          <div className="layer-select-text">Medical facilities</div>
        </label>

        {/* Population Layer Control */}
        <label className="layer-select-group">
          <input
            type="checkbox"
            checked={popLayerEnabled}
            onChange={e => {
              setPopLayerEnabled(e.target.checked);
              setPopLayerStatus(e.target.checked);
            }}
          ></input>
          <div style={{ display: "inline", flex: "1" }}>
            Population density
            <div className="layer-select-gradient"></div>
          </div>
        </label>
      </div>
    </div>
  );
}
