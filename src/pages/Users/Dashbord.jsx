import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BRAND = {
  main: "#6059D6",
  bgLight: "#F7F7FA",
  accent: "#19A7CE",
};

// کلید مدیریت اصلی
const MASTER_KEY = "cb8d0be9c4f8c01e5d6a6273f3c9ab1467df9d8a75c248724105dbe3f1fd547a";

export default function Dashboard() {
  const [apiKey, setApiKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usageSummary, setUsageSummary] = useState({ tokens_today: 0, requests_today: 0 });
  const [status, setStatus] = useState(null);

  // اگر قبلاً رمز ذخیره شده بود، بخونش
  useEffect(() => {
    const storedKey = localStorage.getItem("apiKey");
    if (storedKey && storedKey === MASTER_KEY) {
      setApiKey(storedKey);
      setIsAuthenticated(true);
    }
  }, []);

  // گرفتن داده‌ها فقط وقتی احراز هویت انجام شده
  useEffect(() => {
    if (!isAuthenticated) return;

    fetch("/admin/usage", {
      headers: {
        "X-Master-Key": apiKey,
      },
    })
      .then((res) => res.json())
      .then((data) => {
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
  }, [isAuthenticated, apiKey]);

  const handleLogin = () => {
    if (apiKey === MASTER_KEY) {
      localStorage.setItem("apiKey", apiKey);
      setIsAuthenticated(true);
      setStatus("valid");
    } else {
      setIsAuthenticated(false);
      setStatus("invalid");
      localStorage.removeItem("apiKey");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setApiKey("");
    localStorage.removeItem("apiKey");
  };

  return (
    <div style={{ fontFamily: "Vazirmatn", backgroundColor: BRAND.bgLight, minHeight: "100vh", padding: "30px" }}>
      <h1 style={{ color: BRAND.main }}>داشبورد سیستم</h1>

      {/* اگر هنوز وارد نشده */}
      {!isAuthenticated ? (
        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "20px",
            marginTop: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ color: BRAND.accent }}>🔑 ورود رمز مدیریت</h2>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="کلید مدیریت را وارد کنید..."
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontFamily: "Vazirmatn",
            }}
          />
          <button
            onClick={handleLogin}
            style={{
              backgroundColor: BRAND.main,
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              marginTop: "10px",
              cursor: "pointer",
              fontFamily: "Vazirmatn",
            }}
          >
            تأیید رمز
          </button>

          {status === "valid" && (
            <p style={{ color: "green", marginTop: "10px" }}>✅ رمز معتبر است</p>
          )}
          {status === "invalid" && (
            <p style={{ color: "red", marginTop: "10px" }}>❌ رمز اشتباه است</p>
          )}
        </div>
      ) : (
        <>
          {/* گزارش خلاصه */}
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "20px",
              marginTop: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <h2 style={{ color: BRAND.accent }}>📊 وضعیت امروز</h2>
            <p>
              تعداد کل درخواست‌ها: <strong>{usageSummary.requests_today}</strong>
            </p>
            <p>
              جمع کل توکن‌های مصرف‌شده: <strong>{usageSummary.tokens_today}</strong>
            </p>
          </div>

          {/* لینک‌ها و خروج */}
          <div
            style={{
              display: "flex",
              gap: "15px",
              marginTop: "30px",
              flexWrap: "wrap",
            }}
          >
            <Link to="/users" style={linkStyle}>
              👥 مدیریت کاربران
            </Link>
            <Link to="/ilcenses" style={linkStyle}>
              📄 مدیریت لایسنس‌ها
            </Link>
            <Link to="/logs" style={linkStyle}>
              📜 گزارش‌ها
            </Link>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#ff4d4f",
                color: "#fff",
                padding: "12px 20px",
                border: "none",
                borderRadius: "8px",
                marginTop: "5px",
                cursor: "pointer",
                fontFamily: "Vazirmatn",
              }}
            >
              خروج
            </button>
          </div>
        </>
      )}
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
