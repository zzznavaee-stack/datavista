// DataTable.jsx
import React, { useEffect, useRef, useState } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import "./Datatable.css";
import { DateTime } from "luxon";

window.DateTime = DateTime;

function DataTable({ data = [], schema, options = {}, filters = [] }) {
  const tableRef = useRef(null);
  const tabulatorInstance = useRef(null);
  const [filterText, setFilterText] = useState("");

 
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
    if (!table) return;

    try {
      table.replaceData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Tabulator replaceData error:", err);
    }
  }, [data]);

  
  useEffect(() => {
    const table = tabulatorInstance.current;
    if (!table) return;

    if (filterText.trim() === "") {
      table.clearFilter(true); 
    } else {
      table.setFilter((rowData) =>
        Object.values(rowData).some((val) =>
          String(val).toLowerCase().includes(filterText.toLowerCase())
        )
      );
    }
  }, [filterText]);

 
  useEffect(() => {
    const table = tabulatorInstance.current;
    if (!table) return;

  
    table.clearFilter();

   
    if (!filters || filters.length === 0) return;

   
    filters.forEach((f) => {
      table.addFilter(f.field, f.type, f.value);
    });
  }, [filters]);


  return (
    <div dir="rtl" style={{ fontFamily: "Vazirmatn" }}>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="جستجو در جدول..."
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
            fontSize: "18px",
          }}
        />
      </div>

      <div ref={tableRef} />
    </div>
  );
}

export default DataTable;
