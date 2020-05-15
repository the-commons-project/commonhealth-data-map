import React, { useContext } from "react";
import { ConfigurationContext } from "./ConfigurationProvider";

export default () => {
  const config = useContext(ConfigurationContext);
  const logoAsset = config.assets.find((a) => a.type === "logo");

  return (
    <header className="header-primary">
      {logoAsset && (
        <div className="header-logo">
          <img src={logoAsset.path} alt="Logo" />
        </div>
      )}
      <div className="header-title">{config.strings.headerText}</div>
      <div className="header-icons">
        <img title="Currently in development" src="/icon-bars.svg" alt="Menu" />
      </div>
    </header>
  );
};
