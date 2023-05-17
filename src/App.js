import React, { useState, useRef, useMemo, memo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const CustomCell = (props) => {
  const { value, eGridCell } = props;
  eGridCell.style.backgroundColor = `rgba(255, 0, 0, ${+value + 0.05})`;
  return value;
};

const removeStyles = async function () {
  const links = document.getElementsByTagName("link");
  while (links[0]) links[0].parentNode.removeChild(links[0]);
};

const loadStylesheet = function (link) {
  if (!link) return;

  const linkElement = document.createElement("link");

  linkElement.setAttribute("rel", "stylesheet");
  linkElement.setAttribute("href", link);

  document.getElementsByTagName("head")[0].appendChild(linkElement);
};

const App = ({ data, config, queryResponse }) => {
  const gridRef = useRef();
  const { showRowNumbers, customTheme, loadCustomTheme, limitRows } = config;
  const { pivots, fields } = queryResponse;
  const { dimensions, measures } = fields;

  const [rowData, setRowData] = useState(() =>
    data.map((el) => {
      const rowDataObj = {
        ...Object.fromEntries(
          Object.entries(el[measures[0].name]).map(([key, el]) => {
            return [key, Number.parseFloat(el.value).toFixed(2)];
          })
        ),
      };

      dimensions.forEach((dimension) => {
        rowDataObj[dimension.field_group_variant] = el[dimension.name].value;
      });

      return rowDataObj;
    })
  );

  console.log({ rowData, pivots });

  const [columnDefs, setColumnDefs] = useState(() => [
    {
      headerName: "",
      valueGetter: "node.rowIndex + 1",
      field: "Row ID",
      floatingFilter: false,
      filter: false,
      hide: !showRowNumbers,
      width: 20,
    },
    ...dimensions.map(({ field_group_variant }) => ({
      field: field_group_variant,
    })),
    ...pivots.map(({ key }) => ({
      field: key,
      cellRenderer: memo(CustomCell),
    })),
  ]);

  console.log({ columnDefs });

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      filterParams: {
        debounceMs: 1000,
        buttons: ["apply", "clear", "cancel", "reset"],
      },
      floatingFilter: true,
    }),
    []
  );

  useEffect(() => {
    if (loadCustomTheme) {
      removeStyles();
      loadStylesheet(customTheme);
    } else {
      removeStyles();
    }
  }, [loadCustomTheme]);

  return (
    <div style={{ height: "100vh" }}>
      <div className="ag-theme-alpine" style={{ height: "100%" }}>
        <AgGridReact
          ref={gridRef}
          rowSelection="multiple"
          rowData={limitRows ? rowData.slice(0, limitRows) : rowData}
          columnDefs={columnDefs}
          animateRows={true}
          defaultColDef={defaultColDef}
        />
      </div>
    </div>
  );
};

export default App;
