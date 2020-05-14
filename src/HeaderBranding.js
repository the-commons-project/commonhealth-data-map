import React, { useContext } from "react";
import { ConfigurationContext } from "./ConfigurationProvider";

export default () => {
  const config = useContext(ConfigurationContext);

  return (
    <header className="header-primary">
      <div className="header-logo">
        <img src="/eac-logo.png" alt="East African Community (EAC) logo" />
      </div>
      <div className="header-title">{config.strings.headerText}</div>
      <div className="header-icons">
        <img title="Currently in development" src="/icon-bars.svg" alt="Menu" />
      </div>
    </header>
  );
};
