import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import data from "./data.json";

const tableOptions = {
  showRowNumbers: {
    section: "Plot",
    type: "boolean",
    label: "Show Row Number",
    default: false,
    order: 0,
  },
  limitDisplayedRows: {
    section: "Plot",
    type: "boolean",
    label: "Limit Displayed Rows",
    default: false,
    order: 1,
  },
  showFullFieldName: {
    section: "Series",
    type: "boolean",
    label: "Show Full Field Name",
    default: false,
    order: 1,
  },
  customTheme: {
    section: "Theme",
    type: "string",
    label: "Load custom CSS from:",
    default: "",
    order: 2,
  },
  loadCustomTheme: {
    section: "Theme",
    type: "boolean",
    label: "Load",
    default: false,
    order: 3,
  },
};

function getConfigOptions(config) {
  const newOptions = tableOptions;

  if (config.limitDisplayedRows) {
    newOptions["limitRows"] = {
      section: "Plot",
      type: "string",
      label: "Limit Rows",
      order: 2,
    };
  }

  return newOptions;
}

/*eslint-disable no-undef */
looker.plugins.visualizations.add({
  id: "react_test",
  label: "React Test",
  create: function (element, config) {
    element.innerHTML = `
      <style>
        
      </style>
    `;

    let container = element.appendChild(document.createElement("div"));
    container.className = "table-vis";
    container.id = "vis-container";
  },
  updateAsync: function (data, element, config, queryResponse, details, done) {
    this.clearErrors();

    if (queryResponse.fields.dimensions.length == 0) {
      this.addError({
        title: "No Dimensions",
        message: "This chart requires dimensions.",
      });
      return;
    }

    console.log({ data, config, queryResponse });

    this.trigger("registerOptions", getConfigOptions(config));
    const root = ReactDOM.createRoot(document.getElementById("vis-container"));
    root.render(
      <App data={data} config={config} queryResponse={queryResponse} />
    );

    done();
  },
});

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <App data={data} />
//   </React.StrictMode>
// );
