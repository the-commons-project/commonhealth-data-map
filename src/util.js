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
  return value.toLocaleString(navigator.language, {
    minimumFractionDigits: 0
  });
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
  eac: { name: "All EAC Countries", disabled: false },
  burundi: { name: "Burundi", disabled: true },
  kenya: { name: "Kenya", disabled: true },
  rwanda: { name: "Rwanda", disabled: true },
  "south-sudan": { name: "South Sudan", disabled: true },
  tanzania: { name: "Tanzania", disabled: true },
  uganda: { name: "Uganda", disabled: true }
};

const caseTypes = [
  {
    id: "cases",
    name: "Cases",
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

export { abbreviateNumber, formatNumber, eacCodes, eacCountries, caseTypes };
