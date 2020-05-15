import React, { createContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { eacCountries } from "./util";

// All feature flags are initialized here with default values
// A config may override the value of a feature-flag
const FEATURES = {
  exampleFeature: false,
};

// Each config is identified by a code, which is provided via the URL
// The config denoted as `default` will be loaded if the code does not match
const CONFIGS = [
  {
    code: "dashboard",
    default: true,
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
    },
    defaults: {
      // TODO: Handle countries better.
      country: 'global',
      countries: {
        global: { name: "Global", alpha3: 'GLB', disabled: false, hasFlag: false }
      }
    }
  },
  {
    code: "eac",
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
      headerText: "East-African Community",
    },
    features: {
      exampleFeature: true,
    },
    defaults: {
      country: 'eac',
      countries: eacCountries
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
