import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// رنگ‌ها و فونت هماهنگ با پروژه قبلی
const BRAND = {
  main: "#6059D6",
  bgLight: "#F7F7FA",
  accent: "#19A7CE",
};

export default function Dashboard() {
  const [usageSummary, setUsageSummary] = useState({ tokens_today: 0, requests_today: 0 });

  useEffect(() => {
    // گرفتن داده Usage از API و محاسبه خلاصه
    fetch("/admin/usage", {
      headers: {
        "X-Master-Key": "cb8d0be9c4f8c01e5d6a6273f3c9ab1467df9d8a75c248724105dbe3f1fd547a",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // یک جمع‌بندی سریع از امروز
        const today = new Intl.DateTimeFormat("fa-IR", { dateStyle: "short" }).format(new Date());
        let tokens = 0;
        let requests = 0;

        data.forEach((item) => {
          const date = new Intl.DateTimeFormat("fa-IR", { dateStyle: "short" }).format(new Date(item.ts));
          if (date === today) {
            tokens += item.tokens_used || 0;
            requests += 1;
          }
        });

        setUsageSummary({ tokens_today: tokens, requests_today: requests });
      })
      .catch((err) => console.error("Usage load error:", err));
  }, []);

  return (
    <div style={{ fontFamily: "Vazirmatn", backgroundColor: BRAND.bgLight, minHeight: "100vh", padding: "30px" }}>
      <h1 style={{ color: BRAND.main }}>داشبورد سیستم</h1>

      {/* گزارش خلاصه */}
      <div style={{
          background: "#fff",
          borderRadius: "10px",
          padding: "20px",
          marginTop: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}>
        <h2 style={{ color: BRAND.accent }}>📊 وضعیت امروز</h2>
        <p>تعداد کل درخواست‌ها: <strong>{usageSummary.requests_today}</strong></p>
        <p>جمع کل توکن‌های مصرف‌شده: <strong>{usageSummary.tokens_today}</strong></p>
      </div>

      {/* لینک‌ها به صفحات */}
      <div style={{
          display: "flex",
          gap: "15px",
          marginTop: "30px",
          flexWrap: "wrap"
        }}>
        <Link to="/users" style={linkStyle}>👥 مدیریت کاربران</Link>
        <Link to="/ilcenses" style={linkStyle}>📄 مدیریت لایسنس‌ها</Link>
        <Link to="/logs" style={linkStyle}>📜 گزارش‌ها</Link>
      </div>
    </div>
  );
}

// استایل لینک‌ها
const linkStyle = {
  backgroundColor: "#fff",
  color: "#6059D6",
  padding: "15px 20px",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "500",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  transition: "all 0.2s",
};
