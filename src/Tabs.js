import React, { useContext } from "react";
import { DateInput } from "@blueprintjs/datetime";
import { Select } from "@blueprintjs/select";
import { Slider, Button, MenuItem } from "@blueprintjs/core";
import { NavLink, useParams } from "react-router-dom";
import moment from "moment";

import StateContext from "./State";

import "../node_modules/@blueprintjs/datetime/lib/css/blueprint-datetime.css";

const formatDateToData = (date) => {
  return moment(date).format("YYYY-MM-DD");
};

const formatDateReadable = (date) => {
  return moment(date).format("l");
};

export default () => {
  const {
    dates,
    selectedDateIndex,
    setSelectedDateIndex,
    selectedCountryId,
    setSelectedCountryId,
    countrySelectEntries,
  } = useContext(StateContext);

  const { code } = useParams();

  const onDateIndexChange = (i) => {
    setSelectedDateIndex(+i);
  };

  const onDateChange = (evt) => {
    const dateFormatted = formatDateToData(evt);
    const dateIndex = dates.indexOf(dateFormatted);
    const safeIndex = dateIndex >= 0 ? dateIndex : dates.length - 1;
    setSelectedDateIndex(safeIndex);
  };

  const onCountryIdChange = (id) => {
    setSelectedCountryId(id);
  };

  const selectedCountry = countrySelectEntries[selectedCountryId];

  return (
    <header className="header-secondary">
      <nav className="header-tabs">
        <div>
          <NavLink to={`/${code}/cases`}>Confirmed Cases</NavLink>
          <NavLink to={`/${code}/mobility`}>Mobility</NavLink>
          <NavLink to={`/${code}/capacity`}>Capacity</NavLink>
          <span>Symptoms</span>
        </div>
      </nav>
      <div className="header-controls">
        <div className="controls-country">
          <Select
            items={Object.keys(countrySelectEntries)}
            popoverProps={{ minimal: true }}
            itemRenderer={(item, { handleClick, modifiers }) => {
              if(!(item in countrySelectEntries)) { return null; }
              const country = countrySelectEntries[item];
              return (
                <MenuItem
                  onClick={handleClick}
                  active={selectedCountryId === item}
                  disabled={country.disabled}
                  key={item}
                  text={country.name}
                  className="country-select-item"
                />
              );
            }}
            filterable={false}
            noResults={<MenuItem disabled={true} text="No results." />}
            onItemSelect={onCountryIdChange}
          >
            <Button
              rightIcon="double-caret-vertical"
              className="country-select-button"
            >
              {selectedCountry.hasFlag && (
                <img
                  className="table-icon"
                  src={`/flag-${selectedCountryId}.png`}
                  alt={`Flag for ${selectedCountry.name}`}
                />
              )}
              <span>{selectedCountry.name}</span>
            </Button>
          </Select>
        </div>
        <div className="controls-date">
          <div className="slider">
            {!!dates.length && selectedDateIndex >= 0 && (
              <DateInput
                popoverProps={{ minimal: true }}
                formatDate={(date) => formatDateReadable(date)}
                minDate={new Date(moment(dates[0], "YYYY-MM-DD"))}
                maxDate={
                  new Date(moment(dates[dates.length - 1], "YYYY-MM-DD"))
                }
                onChange={onDateChange}
                parseDate={(str) => new Date(str)}
                canClearSelection={false}
                placeholder={"Select date"}
                value={new Date(moment(dates[selectedDateIndex]))}
              />
            )}
          </div>
        </div>
        <div className="date-slider">
          {!!dates.length && selectedDateIndex >= 0 && (
            <Slider
              min={0}
              max={dates.length - 1}
              onChange={onDateIndexChange}
              value={selectedDateIndex}
              labelRenderer={(i) => formatDateReadable(dates[i])}
              stepSize={1}
              labelStepSize={(dates.length - 1) / 2 || 1}
              showTrackFill={false}
            />
          )}
        </div>
      </div>
    </header>
  );
};
