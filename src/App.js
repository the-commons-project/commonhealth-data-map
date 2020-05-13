import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import Cases from "./Cases";
import HeaderBranding from "./HeaderBranding";
import Tabs from "./Tabs";
import StateContext from "./State";
import Loading from "./Loading";
import Mobility from "./Mobility";
import Capacity from "./Capacity";

import {eacCountries} from "./util";

const App = () => {
  const [dates, setDates] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(-1);
  const [selectedCountryId, setSelectedCountryId] = useState("eac");
  const [activeTab, setActiveTab] = useState(null);
  const [countrySelectEntries, setCountrySelectEntries] = useState(eacCountries);
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
    setCaseDates
  };

  // Mobility tab
  const [mobilityData, setMobilityData] = useState(null);
  const [mobilityDates, setMobilityDates] = useState(null);
  const mobility = {
    mobilityData,
    setMobilityData,
    mobilityDates,
    setMobilityDates
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
    mobility
  };

  return (
    <div className="app-container">
      <StateContext.Provider value={stateValue}>
        <HeaderBranding />
        <Router>
          <Tabs />
          <Switch>
            <Route path="/cases" render={() => <Cases />} />
            <Route path="/mobility" render={() => <Mobility />} />
            <Route path="/capacity" render={() => <Capacity />} />
            <Redirect exact from="/" to="/cases" />
          </Switch>
        </Router>
      </StateContext.Provider>
    </div>
  );
};

export default App;
