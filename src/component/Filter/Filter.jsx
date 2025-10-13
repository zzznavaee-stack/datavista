import React, { useState } from "react";
import "./Filter.css";

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function Filter({ onFiltersChange }) {

  const [filters, setFilters] = useState({
    name: "",
    quotaRange: { min: 0, max: 100 },
    dateRange: { from: null, to: null },
    status: "",
  });

 
  const handleApplyFilters = () => {
    const activeFilters = [];

   
    if (filters.name.trim() !== "")
      activeFilters.push({
        field: "name",
        type: "contains",
        value: filters.name.trim(),
      });

   
    if (filters.status)
      activeFilters.push({
        field: "status",
        type: "equal",
        value: filters.status,
      });

  
    if (
      filters.quotaRange.min !== 0 ||
      filters.quotaRange.max !== 100
    )
      activeFilters.push({
        field: "quota",
        type: "between",
        value: [filters.quotaRange.min, filters.quotaRange.max],
      });

    if (filters.dateRange.from && filters.dateRange.to)
      activeFilters.push({
        field: "createdAt",
        type: "between",
        value: [
          filters.dateRange.from.format("YYYY-MM-DD"),
          filters.dateRange.to.format("YYYY-MM-DD"),
        ],
      });

    
    onFiltersChange(activeFilters);
  };

 
  return (
    <div className="filter">

      {/* فیلتر نام */}
      <div className="filter-item">
        <label>نام کاربر:</label>
        <input
          type="text"
          placeholder="جست‌وجو..."
          value={filters.name}
          onChange={(e) =>
            setFilters({ ...filters, name: e.target.value })
          }
        />
      </div>

     
      <div className="filter-item">
        <label>سهمیه:</label>
        <div className="range-group">
          <input
            type="range"
            min={0}
            max={100}
            value={filters.quotaRange.min}
            onChange={(e) =>
              setFilters({
                ...filters,
                quotaRange: {
                  ...filters.quotaRange,
                  min: Number(e.target.value),
                },
              })
            }
          />
          <input
            type="range"
            min={0}
            max={100}
            value={filters.quotaRange.max}
            onChange={(e) =>
              setFilters({
                ...filters,
                quotaRange: {
                  ...filters.quotaRange,
                  max: Number(e.target.value),
                },
              })
            }
          />
        </div>
        <span className="range-values">
          {filters.quotaRange.min} تا {filters.quotaRange.max}
        </span>
      </div>

   
      <div className="filter-item">
        <label>تاریخ ثبت:</label>
        <DatePicker
          value={filters.dateRange.from}
          calendar={persian}
          locale={persian_fa}
          inputClass="date-input"
          placeholder="از تاریخ"
          onChange={(date) =>
            setFilters({
              ...filters,
              dateRange: { ...filters.dateRange, from: date },
            })
          }
        />
        <DatePicker
          value={filters.dateRange.to}
          calendar={persian}
          locale={persian_fa}
          inputClass="date-input"
          placeholder="تا تاریخ"
          onChange={(date) =>
            setFilters({
              ...filters,
              dateRange: { ...filters.dateRange, to: date },
            })
          }
        />
      </div>

   
      <div className="filter-item">
        <label>وضعیت:</label>
        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="">همه</option>
          <option value="فعال">فعال</option>
          <option value="غیرفعال">غیرفعال</option>
        </select>
      </div>

     
      <div className="filter-item apply-section">
        <button onClick={handleApplyFilters}>اعمال فیلتر</button>
      </div>
    </div>
  );
}
