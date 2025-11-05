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

  // ⚙️ ساخت یا تخریب جدول اصلی
  useEffect(() => {
    if (!tableRef.current) return;

    // اگر جدول قبلاً وجود دارد، پاک شود
    if (tabulatorInstance.current) {
      try {
        tabulatorInstance.current.destroy();
      } catch (e) {}
      tabulatorInstance.current = null;
    }

    //  بخش جدید: محاسبه خودکار عرض ستون‌ها قبل از ساخت جدول 
    if (Array.isArray(data) && data.length > 0 && schema) {
      const autoDetectWidths = (rows) => {
        const widths = {};
        rows.forEach((row) => {
          Object.entries(row).forEach(([key, value]) => {
            const type = typeof value;
            let width;

            switch (type) {
              case "number":
                width = 100;
                break;
              case "boolean":
                width = 70;
                break;
              case "object":
                if (value instanceof Date) width = 150;
                else width = 120;
                break;
              case "string":
                // بر اساس طول رشته عرض محاسبه می‌شود
                width = Math.min(Math.max(value.length * 10, 120), 350);
                break;
              default:
                width = 120;
                break;
            }

            widths[key] = Math.max(widths[key] || 0, width);
          });
        });
        return widths;
      };

      // اجرای تابع برای تمام داده‌ها
      const autoWidths = autoDetectWidths(data);

      // ادغام عرض‌ها در اسکیمای نهایی
      schema = schema.map((col) => ({
        ...col,
        width: autoWidths[col.field] || col.width || 150,
      }));
    }

    // 🟦 ساخت جدید Tabulator بعد از پردازش عرض‌ها
    tabulatorInstance.current = new Tabulator(tableRef.current, {
      columns: schema,
      data: Array.isArray(data) ? data : [],
     layout: "fitDataTable",
      index: "id",
      autoResize: true,
      reactiveData: false,
      virtualDom: true,
      height: "600px",
      ...options,
    });

    // ✅ فعال‌سازی قابلیت کپی در ستون‌هایی که copyable=true دارن
    tabulatorInstance.current.on("cellClick", function (e, cell) {
      const column = cell.getColumn().getDefinition();

      if (column.copyable) {
        const value = cell.getValue();
        if (value !== null && value !== undefined && value !== "") {
          navigator.clipboard.writeText(value.toString()).then(() => {
            const tooltip = document.createElement("div");
            tooltip.textContent = "کپی شد ✅";
            tooltip.style.position = "fixed";
            tooltip.style.background = "#4CAF50";
            tooltip.style.color = "white";
            tooltip.style.padding = "5px 10px";
            tooltip.style.borderRadius = "8px";
            tooltip.style.fontSize = "14px";
            tooltip.style.top = `${e.clientY - 30}px`;
            tooltip.style.left = `${e.clientX}px`;
            tooltip.style.zIndex = 1000;
            tooltip.style.transition = "opacity 0.5s ease";

            document.body.appendChild(tooltip);
            setTimeout(() => {
              tooltip.style.opacity = "0";
              setTimeout(() => tooltip.remove(), 500);
            }, 1000);
          });
        }
      }
    });

    // پاک‌سازی در unmount
    return () => {
      if (tabulatorInstance.current) {
        try {
          tabulatorInstance.current.destroy();
        } catch (e) {}
        tabulatorInstance.current = null;
      }
    };
  }, [schema, options, data]);
  // ⬅ اضافه کردن data به dependency باعث می‌شود اگر داده تغییر کند، عرض‌ها دوباره محاسبه شوند

  // 🧩 به‌روزرسانی داده فقط وقتی renderer آماده است
  useEffect(() => {
    const table = tabulatorInstance.current;
    if (!table) return;

    try {
      if (table.table && table.table.renderer) {
        table.replaceData(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.warn("Tabulator replaceData error:", err);
    }
  }, [data]);

  // 🔍 فیلتر عمومی جستجو در متن
  useEffect(() => {
    const table = tabulatorInstance.current;
    if (!table) return;

    table.clearFilter(true);

    if (filterText.trim() === "") return;

    try {
      table.setFilter((rowData) =>
        Object.values(rowData).some((val) =>
          String(val).toLowerCase().includes(filterText.toLowerCase())
        )
      );
    } catch (err) {
      console.warn("Tabulator text filter error:", err);
    }
  }, [filterText]);

  /// 🧮 فیلترهای پیشرفته
  useEffect(() => {
    const table = tabulatorInstance.current;
    if (!table) return;

    table.clearFilter(true);

    if (!filters || filters.length === 0) return;

    try {
      filters.forEach((f) => {
        switch (f.type) {
          case "equal":
          case "=":
            table.addFilter(f.field, "=", f.value);
            break;

          case "contains":
          case "like":
            table.addFilter(f.field, "like", f.value);
            break;

          case "between":
            const [min, max] = f.value || [];

            if (f.field === "quota") {
              table.addFilter(f.field, ">=", min);
              table.addFilter(f.field, "<=", max);
            } else if (f.field === "createdAt") {
              const minDate = new Date(f.value[0]);
              const maxDate = new Date(f.value[1]);

              table.addFilter(f.field, "function", (cellValue) => {
                if (!cellValue) return false;
                const cellDate = new Date(cellValue);
                return cellDate >= minDate && cellDate <= maxDate;
              });
            }
            break;
        }
      });
    } catch (err) {
      console.warn("Tabulator filter error:", err);
    }
  }, [filters]);

  // 🎨 رندر نهایی
  return (
    <div dir="rtl" style={{ fontFamily: "Vazirmatn",   display:"flex", flexDirection:"column" , alignItems:"center"}}>
      
        <input
          type="text"
          placeholder="جست‌وجو در جدول..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{
            width: "55%",
            display: "inline-block",
            marginBottom:"20px",
            padding: "20px",
            border: "1px solid #C9D6EB",
            borderRadius: "8px",
            backgroundColor: "#E6ECF9",
            color: "#2E3A59",
            boxShadow: "0 1px 6px rgba(185,196,219,0.25)",
            transition: "0.2s",
            fontSize: "18px",
            outline: "none",
          }}
        />
      <div ref={tableRef} />
    </div>
  );
}

export default DataTable;
