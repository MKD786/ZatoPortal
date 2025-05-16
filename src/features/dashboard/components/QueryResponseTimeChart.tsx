"use client"

import { useSelector } from "react-redux"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { RootState } from "../../../store"

const QueryResponseTimeChart = () => {
  const { theme } = useSelector((state: RootState) => state.theme)

  // Mock data for query response time
  const data = [
    { name: "Tax", avgTime: 4.2 },
    { name: "Accounting", avgTime: 2.8 },
    { name: "Compliance", avgTime: 5.1 },
    { name: "Advisory", avgTime: 3.5 },
    { name: "Payroll", avgTime: 1.9 },
  ]

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#333333" : "#e5e7eb"} />
          <XAxis
            dataKey="name"
            tick={{ fill: theme === "dark" ? "#e0e0e0" : "#333333" }}
            axisLine={{ stroke: theme === "dark" ? "#333333" : "#e5e7eb" }}
          />
          <YAxis
            tick={{ fill: theme === "dark" ? "#e0e0e0" : "#333333" }}
            axisLine={{ stroke: theme === "dark" ? "#333333" : "#e5e7eb" }}
            label={{
              value: "Hours",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: theme === "dark" ? "#e0e0e0" : "#333333" },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === "dark" ? "#1e1e1e" : "#ffffff",
              borderColor: theme === "dark" ? "#2e2e2e" : "#e5e7eb",
              color: theme === "dark" ? "#e0e0e0" : "#333333",
            }}
            formatter={(value) => [`${value} hours`, "Average Response Time"]}
          />
          <Legend />
          <Bar dataKey="avgTime" fill="#0F5B6D" radius={[4, 4, 0, 0]} name="Average Response Time (hours)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default QueryResponseTimeChart
