import React, { createContext, useMemo } from "react";
import { useParams } from "react-router-dom";

const configs = [
  {
    code: "dashboard",
    assets: [
      {
        type: "logo",
        path: "/eac-logo.png",
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
    strings: [
      {
        name: "header-text",
        value: "CommonHealth Data Map",
      },
    ],
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
    strings: [
      {
        name: "header-text",
        value: "East-African Community",
      },
    ],
  },
];

const DynamicStyle = ({ path }) => (
  <link rel="stylesheet" type="text/css" href={path} />
);

export default ({ children }) => {
  const { code } = useParams();

  const maybeConfig = useMemo(() => configs.find((c) => c.code === code), [
    code,
  ]);

  const maybeStyles = useMemo(
    () => maybeConfig?.assets?.filter((a) => a.type === "style"),
    [maybeConfig]
  );

  const MaybeContext = useMemo(
    () => maybeConfig && createContext(maybeConfig),
    [maybeConfig]
  );

  return MaybeContext ? (
    <MaybeContext.Provider>
      {maybeStyles.map((a, idx) => (
        <DynamicStyle path={a.path} key={idx} />
      ))}
      {children}
    </MaybeContext.Provider>
  ) : (
    <>{children}</>
  );
};
