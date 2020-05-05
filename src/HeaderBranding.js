import React from "react";

class HeaderBranding extends React.Component {
  render() {
    return (
      <header className="header-primary">
        <div className="header-logo">
          <img src="/eac-logo.png" alt="East African Community (EAC) logo" />
        </div>
        <div className="header-title">CommonHealth Data Map</div>
        <div className="header-icons">
          <img
            title="Currently in development"
            src="/icon-bars.svg"
            alt="Menu"
          />
        </div>
      </header>
    );
  }
}

export default HeaderBranding;
