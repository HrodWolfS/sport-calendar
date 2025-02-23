"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { date: "01/02", distance: 5.2, duration: 30 },
  { date: "03/02", distance: 7.1, duration: 45 },
  { date: "05/02", distance: 10.3, duration: 60 },
  { date: "08/02", distance: 6.5, duration: 35 },
  { date: "10/02", distance: 8.8, duration: 50 },
  { date: "12/02", distance: 12.4, duration: 70 },
  { date: "15/02", distance: 15.3, duration: 90 },
];

export const StatsChart = () => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            stroke="#6B6B76"
            fontSize={12}
            tickMargin={10}
          />
          <YAxis stroke="#6B6B76" fontSize={12} tickMargin={10} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #E6E6EB",
              borderRadius: "4px",
            }}
          />
          <Line
            type="monotone"
            dataKey="distance"
            stroke="#FC4C02"
            strokeWidth={2}
            dot={{ fill: "#FC4C02" }}
            name="Distance (km)"
          />
          <Line
            type="monotone"
            dataKey="duration"
            stroke="#38383F"
            strokeWidth={2}
            dot={{ fill: "#38383F" }}
            name="Durée (min)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
