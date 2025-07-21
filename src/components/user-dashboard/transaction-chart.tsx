"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function TransactionChart({
  data,
}: {
  data: { month: string; inflow: number; outflow: number }[];
}) {
  const chartData =
    data && data.length > 0
      ? data
      : [
          { month: "Jan", inflow: 0, outflow: 0 },
          { month: "Feb", inflow: 0, outflow: 0 },
          { month: "Mar", inflow: 0, outflow: 0 },
          { month: "Apr", inflow: 0, outflow: 0 },
          { month: "May", inflow: 0, outflow: 0 },
          { month: "Jun", inflow: 0, outflow: 0 },
        ];
  const chartConfig = {
    inflow: {
      label: "Inflow",
      color: "#04C351",
    },
    outflow: {
      label: "Outflow",
      color: "#D22F2F",
    },
  };
  return (
    <Card className="pt-4 h-full rounded-xl bg-zinc-100 border-0">
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} height={400}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="inflow" fill="#04C351" radius={4} />
            <Bar dataKey="outflow" fill="#D22F2F" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
