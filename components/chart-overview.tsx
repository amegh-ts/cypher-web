"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { name: "Jan", users: 400, files: 240 },
  { name: "Feb", users: 300, files: 139 },
  { name: "Mar", users: 200, files: 980 },
  { name: "Apr", users: 278, files: 390 },
  { name: "May", users: 189, files: 480 },
  { name: "Jun", users: 239, files: 380 },
  { name: "Jul", users: 349, files: 430 },
];

export function ChartOverview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Bar dataKey="users" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        <Bar dataKey="files" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
