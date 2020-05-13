import { createContext } from "react";

export default createContext({
  dates: [],
  setDates: () => {},
  selectedDateIndex: -1,
  setSelectedDateIndex: () => {},
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
    setCaseDates: () => {}
  },
  mobility: {
    mobilityData: null,
    setMobilityData: () => {},
    mobilityDates: [],
    setMobilityDates: () => {}
  },
});
