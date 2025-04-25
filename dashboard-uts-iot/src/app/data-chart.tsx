"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { DataChart } from "./action";
import dayjs from "dayjs";

const chartConfig = {
  desktop: {
    label: "Latency",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export function DataChartComponent({ data }: { data: DataChart[] }) {
  const [baseData] = useState<DataChart[]>(data); // 👈 original unfiltered data

  const [filteredData, setFilteredData] = useState<DataChart[]>(data);

  const handleChange = (view: string) => {
    if (view === "data") {
      setFilteredData(
        baseData.slice(-20).map((data) => ({
          timestamp: data.timestamp,
          latency: data.latency,
        }))
      );
    } else if (view === "hour") {
      const grouped = new Map<string, number[]>();
      baseData.forEach((data) => {
        const hour = dayjs(data.timestamp).format("HH:00");
        if (!grouped.has(hour)) {
          grouped.set(hour, []);
        }
        grouped.get(hour)?.push(data.latency);
      });

      const averaged = Array.from(grouped.entries()).map(
        ([hour, latencies]) => ({
          timestamp: hour,
          latency: latencies.reduce((sum, l) => sum + l, 0) / latencies.length,
        })
      );
      console.log(averaged);
      setFilteredData(averaged);
    } else if (view === "minute") {
      const grouped = new Map<string, number[]>();

      baseData.forEach((data) => {
        const minute = dayjs(data.timestamp).format("HH:mm");
        if (!grouped.has(minute)) {
          grouped.set(minute, []);
        }
        grouped.get(minute)?.push(data.latency);
      });

      const averaged = Array.from(grouped.entries()).map(
        ([minute, latencies]) => ({
          timestamp: minute,
          latency: latencies.reduce((sum, l) => sum + l, 0) / latencies.length,
        })
      );

      console.log(averaged);
      setFilteredData(averaged);
    }
  };

  return (
    <div className="flex flex-col w-full gap-8 rounded-md border border-muted-foreground p-4">
      <div className="flex flex-row justify-between">
        <h2 className="text-lg font-bold">Latency Over Time</h2>
        <Select defaultValue="data" onValueChange={handleChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hour">Per hour</SelectItem>
            <SelectItem value="minute">Per minute</SelectItem>
            <SelectItem value="data">Per data </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <LineChart accessibilityLayer data={filteredData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="timestamp"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />

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
