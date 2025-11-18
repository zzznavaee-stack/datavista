// src/components/BaseChart/BaseChart.jsx
import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toJalaali } from "jalaali-js";

const BRAND = { main: "#6059D6", gray: "#C0C0C0" };

export default function BaseChart({ type = "line", data, xKey, yKey, isDate = false }) {
  const safeData = useMemo(() => {
    if (!data) return [];
    const raw = Array.isArray(data?.data) ? data.data : data;
    return Array.isArray(raw) ? raw : [];
  }, [data]);

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
        <Line type="monotone" dataKey={yKey} stroke={BRAND.main} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
