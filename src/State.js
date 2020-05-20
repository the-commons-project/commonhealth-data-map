import { createContext } from "react";

export default createContext({
  lastUpdatedDate: null,
  setLastUpdatedDate: () => {},
  sources: null,
  setSources: () => {},
  dateSelectorEnabled: false,
  setDateSelectorEnabled: () => {},
  dates: [],
  setDates: () => {},
  selectedDateIndex: -1,
  setSelectedDateIndex: () => {},
  countrySelectorEnabled: false,
  setCountrySelectorEnabled: () => {},
  selectedCountryId: "eac",
  setSelectedCountryId: () => {},
  countrySelectEntries: [],
  setCountrySelectEntries: () => {},
  cases: {
    caseData: null,
    setCaseData: () => {},
    indexedData: {},
    setIndexedData: () => {},
    caseDates: [],
    setCaseDates: () => {},
    maxDatePerCountry: null,
    setMaxDatePerCountry: () => {}
  },
  mobility: {
    mobilityData: null,
    setMobilityData: () => {},
    mobilityDates: [],
    setMobilityDates: () => {}
  },
});
