// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import BaseChart from "../component/Basechart/BaseChart";
import dayjs from "dayjs";       // برای گروه‌بندی تاریخ میلادی
import jalaliday from "jalaliday"; // برای نمایش تاریخ شمسی

dayjs.extend(jalaliday); // فعال‌سازی افزونه جلالی

export default function Dashboard() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/admin/usage", {
      headers: {
        "X-Master-Key": "cb8d0be9c4f8c01e5d6a6273f3c9ab1467df9d8a75c248724105dbe3f1fd547a",
      },
    })
      .then(res => res.json())
      .then(json => {
        const arr = Array.isArray(json) ? json : [];

        // گروه‌بندی و تجمیع بر اساس تاریخ
        const grouped = arr.reduce((acc, item) => {
          const day = dayjs(item.ts).format("YYYY-MM-DD");
          acc[day] = (acc[day] || 0) + (item.tokens_used || 0);
          return acc;
        }, {});

        // تبدیل به آرایه برای چارت (با تاریخ شمسی)
        const result = Object.entries(grouped).map(([day, total]) => ({
          ts: dayjs(day).calendar("jalali").locale("fa").format("DD MMM"), // "۲۷ آبان"
          tokens_used: total,
        }));

        setChartData(result);
      })
      .catch(err => console.error("API Error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>در حال بارگذاری داده‌ها...</p>;

  return (
    <BaseChart
      type="line"
      data={chartData}
      xKey="ts"
      yKey="tokens_used"
      isDate={false}
    />
  );
}
