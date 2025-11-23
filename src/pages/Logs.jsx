import React, { useEffect, useState } from "react";
import BaseChart from "../component/Basechart/BaseChart"
import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);

export default function Logs() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/admin/usage", {
      headers: {
        "X-Master-Key":
          "cb8d0be9c4f8c01e5d6a6273f3c9ab1467df9d8a75c248724105dbe3f1fd547a",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const arr = Array.isArray(json) ? json : [];

        // 💎 گروه‌بندی: هر روز → مجموع توکن + تعداد درخواست
        const grouped = arr.reduce((acc, item) => {
          const day = dayjs(item.ts).format("YYYY-MM-DD");
          if (!acc[day]) acc[day] = { used: 0, count: 0 };
          acc[day].used += item.tokens_used || 0;
          acc[day].count += 1; // هر لاگ = یک درخواست
          return acc;
        }, {});

        // 📆 تبدیل به آرایه برای چارت با تاریخ شمسی
        const result = Object.entries(grouped).map(([day, values]) => ({
          ts: dayjs(day)
            .calendar("jalali")
            .locale("fa")
            .format("DD MMM"),
          tokens_used: values.used,
          requests_count: values.count,
        }));

        setChartData(result);
      })
      .catch((err) => console.error("API Error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>در حال بارگذاری داده‌ها...</p>;

  return (
    <BaseChart
      type="line"
      data={chartData}
      xKey="ts"
      yKeys={["tokens_used", "requests_count"]} // 💎 دو سری داده: توکن و تعداد درخواست
      isDate={false}
    />
  );
}
