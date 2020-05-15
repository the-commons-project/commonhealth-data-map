const abbreviateNumber = value => {
  var newValue = value;
  if (value >= 1000) {
    var suffixes = ["", "k", "m", "b", "t"];
    var suffixNum = Math.floor(("" + value).length / 3);
    var shortValue = "";
    for (var precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat(
        (suffixNum !== 0
          ? value / Math.pow(1000, suffixNum)
          : value
        ).toPrecision(precision)
      );
      var dotLessShortValue = (shortValue + "").replace(/[^a-zA-Z 0-9]+/g, "");
      if (dotLessShortValue.length <= 2) {
        break;
      }
    }
    if (shortValue % 1 !== 0) shortValue = shortValue.toFixed(1);
    newValue = shortValue + suffixes[suffixNum];
  }
  return newValue;
};

const formatNumber = value => {
  // For numbers in the millions, shorten with 'M' abbreviation
  if(Math.abs(Number(value)) >= 1.0e+6) {
    return (Math.abs(Number(value)) / 1.0e+6).toLocaleString(navigator.language, {
      maximumSignificantDigits: 3,
      minimumFractionDigits: 3
    }) + "M";
  }

  // For numbers over 100,000, shorten to decimal with 'K' abbreviation
  if(Math.abs(Number(value)) >= 1.0e+5) {
    return (Math.abs(Number(value)) / 1.0e+3).toLocaleString(navigator.language, {
      maximumSignificantDigits: 4,
      minimumFractionDigits: 1
    }) + "K";
  }

  return value.toLocaleString(navigator.language, {
    minimumFractionDigits: 0
  });
};

export const formatLegendNumber = (x, digits=2) => {
    if (isNaN(x)) {
        return 'N/A';
    } else if (Number.isInteger(x)) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
        return x.toFixed(digits);
    }
};

export const tabCodes = {
  cases: 'cases',
  mobility: 'mobility',
  capacity: 'capacity'
};

const eacCodes = [
  "eac",
  "burundi",
  "kenya",
  "rwanda",
  "south-sudan",
  "tanzania",
  "uganda"
];

const eacCountries = {
  eac: { name: "All EAC Countries", alpha3: 'EAC', disabled: false, hasFlag: false },
  burundi: { name: "Burundi", alpha3: 'BDI', disabled: false, hasFlag: true },
  kenya: { name: "Kenya", alpha3: 'KEN', disabled: false, hasFlag: true },
  rwanda: { name: "Rwanda", alpha3: 'RWA', disabled: false, hasFlag: true },
  "south-sudan": { name: "South Sudan", alpha3: 'SSD', disabled: false, hasFlag: true },
  tanzania: { name: "Tanzania", alpha3: 'TZA', disabled: false, hasFlag: true },
  uganda: { name: "Uganda", alpha3: 'UGA', disabled: false, hasFlag: true }
};

const caseTypes = [
  {
    id: "cases",
    name: "Confirmed",
    colorHex: "#02AEEF",
    colorArray: [2, 174, 239]
  },
  {
    id: "active",
    name: "Active",
    colorHex: "#F7C319",
    colorArray: [247, 195, 25]
  },
  {
    id: "recovered",
    name: "Recovered",
    colorHex: "#6B9545",
    colorArray: [107, 149, 69]
  },
  {
    id: "deaths",
    name: "Deaths",
    colorHex: "#EB1B25",
    colorArray: [235, 27, 37]
  }
];

export const changeDates = (
  currentDates,
  newDates,
  currentSelectedDateIndex,
  setDates,
  setSelectedDateIndex
) => {
  // This is the version if we want to maintain dates between tabs.
  // const currentDate = currentDates[currentSelectedDateIndex],
  //       newDateIndex = newDates.indexOf(currentDate),
  //       newSelectedDateIndex = newDateIndex == -1 ? newDates.length - 1 : newDateIndex;

  // For now, just reset to the latest data date.
  const newSelectedDateIndex = newDates.length - 1;

  setDates(newDates);
  setSelectedDateIndex(newSelectedDateIndex);
};

export const changeCountrySelectEntries = (
  newCountrySelectEntries,
  currentSelectedCountryId,
  setCountrySelectEntries,
  setSelectedCountryId,
  defaultCountry
) => {
  if(!(currentSelectedCountryId in newCountrySelectEntries) ||
     newCountrySelectEntries[currentSelectedCountryId]['disabled']) {
    setSelectedCountryId(defaultCountry);
  }
  setCountrySelectEntries(newCountrySelectEntries);
};

export { abbreviateNumber, formatNumber, eacCodes, eacCountries, caseTypes };
