import React, { useState, useRef, useMemo, memo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { removeStyles, loadStylesheet } from "./helpers";
import { CustomCell } from "./components/gridCell/customCell";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const App = ({ data, config, queryResponse }) => {
  const gridRef = useRef();
  const {
    showRowNumbers,
    showFullFieldName,
    customTheme,
    loadCustomTheme,
    limitRows,
    query_fields: { pivots: pivotsConfig, measures: measuresConfig },
  } = config;
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

  console.log({ rowData, pivots, config });

  const [columnDefs, setColumnDefs] = useState(() => [
    {
      headerName: "",
      valueGetter: "node.rowIndex + 1",
      field: "Row ID",
      filter: false,
      hide: !showRowNumbers,
      width: 20,
    },
    ...dimensions.map(({ field_group_variant, label }) => ({
      headerName: pivotsConfig[0].field_group_variant,
      children: [
        {
          field: field_group_variant,
          headerName: showFullFieldName ? label : field_group_variant,
          width: 110,
        },
      ],
    })),
    ...pivots.map(({ key }) => ({
      headerName: key,
      children: [
        {
          headerName: showFullFieldName
            ? measuresConfig[0].label
            : measuresConfig[0].field_group_variant,
          field: key,
          cellRenderer: memo(CustomCell),
        },
      ],
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
      width: showFullFieldName ? 220 : 110,
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
          rowHeight={"21"}
          headerHeight={showFullFieldName ? "80" : "28"}
          groupHeaderHeight={"28"}
        />
      </div>
    </div>
  );
};

export default App;
