// DataTable.jsx
import React, { useEffect, useRef, useState } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import "./Datatable.css";
import { DateTime } from "luxon";

window.DateTime = DateTime;

function DataTable({ data = [], schema, options = {} }) {
  const tableRef = useRef(null);
  const tabulatorInstance = useRef(null);
  const [filterText, setFilterText] = useState("");

  // ساخت جدول
  useEffect(() => {
    if (tableRef.current) {
      if (tabulatorInstance.current) {
        try {
          tabulatorInstance.current.destroy();
        } catch (e) {}
        tabulatorInstance.current = null;
      }

      tabulatorInstance.current = new Tabulator(tableRef.current, {
        columns: schema,
        data: data,
        layout: "fitColumns",
        index: "id",
        reactiveData: false,
        autoResize: false,
        virtualDom: true,
        height: "600px",
        ...options,
      });
    }

    return () => {
      if (tabulatorInstance.current) {
        try {
          tabulatorInstance.current.destroy();
        } catch (e) {}
        tabulatorInstance.current = null;
      }
    };
  }, [schema, options]);


  useEffect(() => {
    const table = tabulatorInstance.current;
    if (
      table &&
      table.table &&
      table.table.modules &&
      table.modules !== null &&
      table.rowManager &&
      table.rowManager.renderer &&
      typeof table.rowManager.renderer.verticalFillMode !== "undefined"
    ) {
      try {
        table.replaceData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn("Tabulator replaceData error:", err);
      }
    } else {
      console.log("⏳ Tabulator not ready yet, skip replaceData");
    }
  }, [data]);

    
  useEffect(() => {
    const table = tabulatorInstance.current;
    if (!table) return;

    if (filterText.trim() === "") {
      table.clearFilter();
    } else {
     
      table.setFilter((rowData) => {
        return Object.values(rowData).some((val) =>
          String(val).toLowerCase().includes(filterText.toLowerCase())
        );
      });
    }
  }, [filterText]);

  return (
    <div dir="rtl" style={{ fontFamily: "Vazirmatn" }}>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="جستجو در جدول  "
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{
            width: "96vw",
            padding: "20px",
            border: "1px solid #C9D6EB",
            borderRadius: "8px",
            backgroundColor: "#E6ECF9",
            color: "#2E3A59",
            boxShadow: "0 1px 6px rgba(185,196,219,0.25)",
            transition: "0.2s",
            fontSize:"20px"
          }}
        />
      </div>

      <div ref={tableRef} />
    </div>
  );
}

export default DataTable;
