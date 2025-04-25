"use client";

import { CartesianGrid, Line, LineChart, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  desktop: {
    label: "Latency",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export function DataChartComponent({ data }: { data: unknown[] }) {
  return (
    <div className="flex flex-col w-full gap-8">
        <h2 className="text-lg font-bold">Latency Over Time</h2>
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <LineChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <YAxis
            label={{ value: "Latency (s)", angle: -90, position: "insideLeft" }}
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="latency"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
