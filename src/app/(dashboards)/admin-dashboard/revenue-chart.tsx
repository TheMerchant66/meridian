"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    total: 1500000,
  },
  {
    name: "Feb",
    total: 1800000,
  },
  {
    name: "Mar",
    total: 2200000,
  },
  {
    name: "Apr",
    total: 2600000,
  },
  {
    name: "May",
    total: 3100000,
  },
  {
    name: "Jun",
    total: 3500000,
  },
  {
    name: "Jul",
    total: 3800000,
  },
  {
    name: "Aug",
    total: 4200000,
  },
  {
    name: "Sep",
    total: 4500000,
  },
  {
    name: "Oct",
    total: 4800000,
  },
  {
    name: "Nov",
    total: 5100000,
  },
  {
    name: "Dec",
    total: 5500000,
  },
]

export function RevenueChart() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="h-[300px] flex items-center justify-center">Loading chart...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
        />
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <Tooltip
          formatter={(value: number) => [`$${(value).toLocaleString()}`, "Revenue"]}
          labelFormatter={(label) => `${label} 2023`}
        />
        <Bar dataKey="total" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
