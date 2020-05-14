import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Cases from "./Cases";
import HeaderBranding from "./HeaderBranding";
import Tabs from "./Tabs";
import StateContext from "./State";
import Mobility from "./Mobility";
import Capacity from "./Capacity";

import { eacCountries } from "./util";
import ConfigurationProvider from "./ConfigurationProvider";

const App = () => {
  const [dates, setDates] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(-1);
  const [selectedCountryId, setSelectedCountryId] = useState("eac");
  const [activeTab, setActiveTab] = useState(null);
  const [countrySelectEntries, setCountrySelectEntries] = useState(
    eacCountries
  );
  const [ready, setReady] = useState(false);

  // Cases Tab
  const [caseData, setCaseData] = useState([]);
  const [indexedCaseData, setIndexedCaseData] = useState({});
  const [caseDates, setCaseDates] = useState([]);
  const cases = {
    caseData,
    setCaseData,
    indexedCaseData,
    setIndexedCaseData,
    caseDates,
    setCaseDates,
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
    dates,
    setDates,
    selectedDateIndex,
    setSelectedDateIndex,
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
