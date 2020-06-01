import React, { createContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { eacCountries } from "./util";

// All feature flags are initialized here with default values
// A config may override the value of a feature-flag
const FEATURES = {
  exampleFeature: false,

  // TODO: These features are a for-now hack; to be replaced.
  maskFeature: false,
  tableFeature: true,
  eacOnlyFeature: false,

  // Feature to show county-level US data; not currently implemented.
  countyCasesFeature: false,

  // Feature to show country flags in dropdowns and tables
  showFlagsFeature: false
};

// Each config is identified by a code, which is provided via the URL
// The config denoted as `default` will be loaded if the code does not match
const CONFIGS = [
  {
    code: "dashboard",
    assets: [
      {
        type: "logo",
        path: "/tcp-logo.png",
      },
      {
        type: "map-mask",
        path: "/eac-mask.json",
      },
      {
        type: "style",
        path: "/default-theme.css",
      },
    ],
    strings: {
      headerText: "",
    },
    features: {
      exampleFeature: false,
      tableFeature: false
    },
    defaults: {
      viewport:  {
        latitude: 0.0,
        longitude: 0.0,
        zoom: 1,
        bearing: 0,
        pitch: 0,
      },
      // TODO: Handle countries better.
      country: 'global',
      countries: {
        global: { name: "Global", alpha2: 'XG', alpha3: 'GLB', disabled: false, hasFlag: false }
      },
      cases: {
        "maxCircleSize": 40
      }
    }
  },
  {
    code: "eac",
    default: true,
    assets: [
      {
        type: "logo",
        path: "/eac-logo.png",
      },
      {
        type: "map-mask",
        path: "/eac-mask.json",
      },
    ],
    strings: {
      headerText: "East African Community",
    },
    features: {
      exampleFeature: true,
      maskFeature: true,
      showFlagsFeature: true,
      eacOnlyFeature: true,
    },
    defaults: {
      viewport:  {
        latitude: 0.27,
        longitude: 33.45,
        zoom: 4,
        bearing: 0,
        pitch: 0,
      },
      country: 'eac',
      countries: eacCountries,
      baseMask: 'eac',
      cases: {
        "maxCircleSize": 1000
      }
    }
  },
];

const DEFAULT_CONFIG = CONFIGS.find((c) => c.default);

export const ConfigurationContext = createContext(DEFAULT_CONFIG);

if (!DEFAULT_CONFIG) {
  throw new Error("No default configuration provided.");
}

const DynamicStyle = ({ path }) => (
  <link rel="stylesheet" type="text/css" href={path} />
);

export default ({ children }) => {
  const { code } = useParams();

  const config = useMemo(() => {
    const match = CONFIGS.find((c) => c.code === code) || DEFAULT_CONFIG;
    return { ...match, features: { ...FEATURES, ...match.features } };
  }, [code]);

  const maybeStyles = useMemo(
    () => config.assets.filter((a) => a.type === "style"),
    [config]
  );

  return (
    <ConfigurationContext.Provider value={config}>
      {maybeStyles.map((a, idx) => (
        <DynamicStyle path={a.path} key={idx} />
      ))}
      {children}
    </ConfigurationContext.Provider>
  );
};
