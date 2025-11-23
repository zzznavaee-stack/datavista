import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toJalaali } from "jalaali-js";

const BRAND = {
  main: "#6059D6",
  gray: "#C0C0C0",
};

// 🎨 پالت رنگ برای چند خط
const COLORS = ["#6059D6", "#FF7F50", "#00BFA6", "#8884d8"];

export default function BaseChart({
  type = "line",
  data,
  xKey,
  yKey,
  yKeys,
  isDate = false,
}) {
  const safeData = useMemo(() => {
    if (!data) return [];
    const raw = Array.isArray(data?.data) ? data.data : data;
    return Array.isArray(raw) ? raw : [];
  }, [data]);

  // 🕒 تبدیل تاریخ میلادی به جلالی برای محور X
  const tickFormatter = (v) => {
    if (!isDate) return v;
    try {
      const d = new Date(v);
      const j = toJalaali(d);
      return `${j.jm}/${j.jd}`;
    } catch {
      return v;
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={safeData}>
        <CartesianGrid stroke={BRAND.gray} strokeDasharray="3 3" />
        <XAxis dataKey={xKey} tickFormatter={tickFormatter} />
        <YAxis />
        <Tooltip />

        {/* ✅ پشتیبانی از چند yKey با رنگ‌های متفاوت */}
        {Array.isArray(yKeys) && yKeys.length > 0 ? (
          yKeys.map((key, i) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[i % COLORS.length]}
              dot={false}
              strokeWidth={2}
            />
          ))
        ) : (
          // حالت سازگار با نسخه قدیمی (فقط یک yKey)
          <Line
            type="monotone"
            dataKey={yKey}
            stroke={BRAND.main}
            dot={false}
            strokeWidth={2}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
