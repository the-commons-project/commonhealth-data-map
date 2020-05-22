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
    nationalData: [],
    setNationalData: () => {},
    countyData: [],
    setCountyData: () => {},
    caseDates: [],
    setCaseDates: () => {},
    maxDatePerId: null,
    setMaxDatePerId: () => {},
    alpha2ToId: null,
    setAlpha2ToId: () => {}
  },
  mobility: {
    mobilityData: null,
    setMobilityData: () => {},
    mobilityDates: [],
    setMobilityDates: () => {}
  },
});
