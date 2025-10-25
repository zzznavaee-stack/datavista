// Filter.jsx
import React, { useState } from "react";
import "./Filter.css";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import en from "react-date-object/locales/gregorian_en";

export default function Filter({ onFiltersChange }) {
  const [filters, setFilters] = useState({
    name: "",
    quotaMin: "",
    quotaMax: "",
    dateFrom: null,
    dateTo: null,
    status: "",
  });

  // تبدیل تاریخ جلالی به میلادی
  const convertToGregorian = (jalali) => {
    if (!jalali) return null;
    try {
      const g = jalali.convert(gregorian, en);
      return g.format("YYYY-MM-DD");
    } catch {
      return null;
    }
  };

  // ✅ ساختن آرایه فیلترها با منطق بین دو عدد برای سهمیه و بین دو تاریخ برای تاریخ
  const handleApplyFilters = () => {
    const activeFilters = [];

    // نام
    if (filters.name.trim() !== "") {
      activeFilters.push({
        field: "name",
        type: "contains",
        value: filters.name.trim(),
      });
    }

    // وضعیت
    if (filters.status.trim() !== "") {
      activeFilters.push({
        field: "status",
        type: "equal",
        value: filters.status.trim(),
      });
    }

    // 🔹 سهمیه بین دو عدد
    const minNum = Number(filters.quotaMin);
    const maxNum = Number(filters.quotaMax);
    if (!isNaN(minNum) && !isNaN(maxNum) && filters.quotaMin !== "" && filters.quotaMax !== "") {
      activeFilters.push({
        field: "quota",
        type: "between",
        value: [minNum, maxNum],
      });
    }

    // 🔹 تاریخ بین دو تاریخ میلادی
    const fromDate = convertToGregorian(filters.dateFrom);
    const toDate = convertToGregorian(filters.dateTo);
    if (fromDate && toDate) {
      activeFilters.push({
        field: "createdAt",
        type: "between",
        value: [fromDate, toDate],
      });
    }

    onFiltersChange(activeFilters);
  };

  return (
    <div className="filter" dir="rtl" style={{ fontFamily: "Vazirmatn" }}>
      <div className="filter-item">
        <label>نام کاربر:</label>
        <input
          type="text"
          placeholder="جست‌وجو نام..."
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
      </div>

      {/* 🔹 فیلتر سهمیه عددی بین دو مقدار */}
      <div className="filter-item">
        <label>سهمیه:</label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="number"
            placeholder="از..."
            value={filters.quotaMin}
            onChange={(e) => setFilters({ ...filters, quotaMin: e.target.value })}
          />
          <input
            type="number"
            placeholder="تا..."
            value={filters.quotaMax}
            onChange={(e) => setFilters({ ...filters, quotaMax: e.target.value })}
          />
        </div>
      </div>

      {/* 🔹 فیلتر تاریخ بین دو تاریخ */}
      <div className="filter-item">
        <label>تاریخ ثبت:</label>
        <DatePicker
          value={filters.dateFrom}
          calendar={persian}
          locale={persian_fa}
          placeholder="از تاریخ"
          onChange={(date) => setFilters({ ...filters, dateFrom: date })}
        />
        <DatePicker
          value={filters.dateTo}
          calendar={persian}
          locale={persian_fa}
          placeholder="تا تاریخ"
          onChange={(date) => setFilters({ ...filters, dateTo: date })}
        />
      </div>

      {/* وضعیت */}
      <div className="filter-item">
        <label>وضعیت:</label>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">همه</option>
          <option value="فعال">فعال</option>
          <option value="غیرفعال">غیرفعال</option>
        </select>
      </div>

      <div className="filter-item" style={{ marginTop: "10px" }}>
        <button onClick={handleApplyFilters}>اعمال فیلتر</button>
      </div>
    </div>
  );
}
