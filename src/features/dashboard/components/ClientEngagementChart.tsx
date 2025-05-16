"use client"

import { useSelector } from "react-redux"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { RootState } from "../../../store"

const ClientEngagementChart = () => {
  const { theme } = useSelector((state: RootState) => state.theme)

  // Mock data for client engagement
  const data = [
    { name: "Jan 1", logins: 20, documents: 15, queries: 10 },
    { name: "Jan 8", logins: 25, documents: 18, queries: 12 },
    { name: "Jan 15", logins: 18, documents: 20, queries: 15 },
    { name: "Jan 22", logins: 30, documents: 25, queries: 18 },
    { name: "Jan 29", logins: 28, documents: 22, queries: 20 },
    { name: "Feb 5", logins: 35, documents: 28, queries: 22 },
  ]

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
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
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === "dark" ? "#1e1e1e" : "#ffffff",
              borderColor: theme === "dark" ? "#2e2e2e" : "#e5e7eb",
              color: theme === "dark" ? "#e0e0e0" : "#333333",
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="logins"
            stackId="1"
            stroke="#0F5B6D"
            fill="#0F5B6D"
            fillOpacity={0.6}
            name="Client Logins"
          />
          <Area
            type="monotone"
            dataKey="documents"
            stackId="1"
            stroke="#4CCEEB"
            fill="#4CCEEB"
            fillOpacity={0.6}
            name="Documents Uploaded"
          />
          <Area
            type="monotone"
            dataKey="queries"
            stackId="1"
            stroke="#F59E0B"
            fill="#F59E0B"
            fillOpacity={0.6}
            name="Queries Submitted"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ClientEngagementChart
