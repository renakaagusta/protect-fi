// components/line-chart/LineChartComponent.tsx
"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface LineChartComponentProps {
  data: { date: string; benefit: number }[];
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({ data }) => {
  return (
    <div className="w-full h-64 bg-white dark:bg-[#1B1B1B] p-4 rounded-md shadow-md">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="date" stroke="#999" />
          <YAxis stroke="#999" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="benefit"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
