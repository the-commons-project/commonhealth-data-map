import React, { useContext } from "react";
import * as dateFormat from "dateformat";
import StateContext from "./State";

export default function Footer() {
  const { lastUpdatedDate, sources } = useContext(StateContext);

  const lastUpdatedText = !!lastUpdatedDate ? (
    <>
      <b>Last updated </b>
      {dateFormat(Date.parse(lastUpdatedDate), "mediumDate", true)}
    </>
  ) : null;

  const sourcesText = !!sources ? (
    <>
      <b> {sources.length > 1 ? "Sources" : "Source"} </b>
      {sources.map(
        (source, i) =>
          <span key={i}>
            {i > 0 && ", "}
            {source}
          </span>
      )}
    </>
  ) : null;

  return (
    <footer className="footer-primary">
      <div className="footer-info">
        {lastUpdatedText}
        {!!lastUpdatedText && !!sourcesText && (
          <>
            <span className="footer-sep-slash"> / </span>
            <br className="footer-sep-newline"/>
          </>)}
        {sourcesText}
      </div>
      <div className="footer-logo">
        <img id="footer-logo-large" src="/tcp-logo-med.png" alt="The Commons Project logo" />
        <img id="footer-logo-small" src="/tcp-logo-small.png" alt="The Commons Project logo" />
      </div>
    </footer>
  );
};
