import * as dateFormat from "dateformat";

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
  eac: { name: "All EAC Countries", alpha3: 'EAC', disabled: false,
         bounds: [[24.12, -11.78], [41.89, 12.26]] },
  burundi: { name: "Burundi", alpha3: 'BDI', disabled: false,
             bounds: [[28.986, -4.463], [30.833, -2.303]]},
  kenya: { name: "Kenya", alpha3: 'KEN', disabled: false,
           bounds: [[33.89, -4.677], [41.885, 5.03]] },
  rwanda: { name: "Rwanda", alpha3: 'RWA', disabled: false,
            bounds: [[28.857, -2.826], [30.887, -1.058]] },
  "south-sudan": { name: "South Sudan", alpha3: 'SSD', disabled: false,
                   bounds: [[24.121, 3.49], [35.92, 12.216]] },
  tanzania: { name: "Tanzania", alpha3: 'TZA', disabled: false,
              bounds: [[29.321, -11.731], [40.449, -0.985]] },
  uganda: { name: "Uganda", alpha3: 'UGA', disabled: false,
            bounds: [[29.548, -1.475], [35.006, 4.219]] }
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
  // Add any missing dates between the last available date and the current date.
  let date = new Date(newDates[newDates.length - 1]),
      today = new Date();

  const dates = newDates.slice();
  while(date < today) {
    date.setDate(date.getDate() + 1);
    dates.push(dateFormat(date, "isoDate", true));
  }

  const currentDate = currentDates[currentSelectedDateIndex],
        newDateIndex = dates.indexOf(currentDate),
        newSelectedDateIndex = newDateIndex == -1 ? dates.length - 1 : newDateIndex;

  setDates(dates);
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
