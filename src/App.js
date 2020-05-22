import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Cases from "./Cases";
import HeaderBranding from "./HeaderBranding";
import Footer from "./Footer";
import Tabs from "./Tabs";
import StateContext from "./State";
import Mobility from "./Mobility";
import Capacity from "./Capacity";

import { eacCountries } from "./util";
import ConfigurationProvider from "./ConfigurationProvider";

const App = () => {
  const [lastUpdatedDate, setLastUpdatedDate] = useState(null);
  const [sources, setSources] = useState(null);
  const [dateSelectorEnabled, setDateSelectorEnabled] = useState(false);
  const [dates, setDates] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(-1);
  const [countrySelectorEnabled, setCountrySelectorEnabled] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState("eac");
  const [activeTab, setActiveTab] = useState(null);
  const [countrySelectEntries, setCountrySelectEntries] = useState(
    eacCountries
  );
  const [ready, setReady] = useState(false);

  // Cases Tab
  const [nationalData, setNationalData] = useState([]);
  const [countyData, setCountyData] = useState([]);
  const [caseDates, setCaseDates] = useState([]);
  const [maxDatePerId, setMaxDatePerId] = useState(null);
  const [alpha2ToId, setAlpha2ToId] = useState(null);
  const cases = {
    nationalData,
    setNationalData,
    countyData,
    setCountyData,
    caseDates,
    setCaseDates,
    maxDatePerId,
    setMaxDatePerId,
    alpha2ToId,
    setAlpha2ToId
  };

  // Mobility tab
  const [mobilityData, setMobilityData] = useState(null);
  const [mobilityDates, setMobilityDates] = useState(null);
  const mobility = {
    mobilityData,
    setMobilityData,
    mobilityDates,
    setMobilityDates,
  };

  const stateValue = {
    lastUpdatedDate,
    setLastUpdatedDate,
    sources,
    setSources,
    dateSelectorEnabled,
    setDateSelectorEnabled,
    dates,
    setDates,
    selectedDateIndex,
    setSelectedDateIndex,
    countrySelectorEnabled,
    setCountrySelectorEnabled,
    selectedCountryId,
    setSelectedCountryId,
    ready,
    setReady,
    activeTab,
    setActiveTab,
    countrySelectEntries,
    setCountrySelectEntries,

    // Tab state
    cases,
    mobility,
  };

  return (
    <div className="app-container">
      <Router>
        <Switch>
          <Route path="/:code">
            <ConfigurationProvider>
              <StateContext.Provider value={stateValue}>
                <HeaderBranding />
                <Tabs />
                <Switch>
                  <Route path="/:code/cases">
                    <Cases />
                  </Route>
                  <Route path="/:code/mobility">
                    <Mobility />
                  </Route>
                  <Route path="/:code/capacity">
                    <Capacity />
                  </Route>
                  <Redirect from="/:code" to="/:code/cases" />
                </Switch>
                <Footer/>
              </StateContext.Provider>
            </ConfigurationProvider>
          </Route>
          <Redirect from="*" to="/dashboard/cases" />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
