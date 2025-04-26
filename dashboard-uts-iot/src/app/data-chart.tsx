"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
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
import { useEffect, useState } from "react";
import { DataChart } from "./action";
import dayjs from "dayjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const chartConfig = {
  desktop: {
    label: "Latency",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export function DataChartComponent({ data }: { data: DataChart[] }) {
  const [date, setDate] = useState<Date>(new Date(2025, 3, 26));
  const [baseData] = useState<DataChart[]>(data);
  const [filteredData, setFilteredData] = useState<DataChart[]>(data);

  useEffect(() => {
    const formattedSelectedDate = dayjs(date).format("YYYY-MM-DD");

    setFilteredData(
      baseData.filter(
        (data) =>
          dayjs(data.timestamp).format("YYYY-MM-DD") === formattedSelectedDate
      )
    );
  }, [date, baseData]);

  const handleChange = (view: string) => {
    const formattedSelectedDate = format(date, "yyyy-MM-dd");

    const dataPerDate = baseData.filter(
      (data) =>
        dayjs(data.timestamp).format("YYYY-MM-DD") === formattedSelectedDate
    );
    if (view === "data") {
      setFilteredData(
        dataPerDate.slice(-50).map((data) => ({
          timestamp: data.timestamp,
          latency: data.latency,
        }))
      );
    } else if (view === "hour") {
      const grouped = new Map<string, number[]>();

      dataPerDate.forEach((data) => {
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
      setFilteredData(averaged);
    } else if (view === "minute") {
      const grouped = new Map<string, number[]>();

      dataPerDate.forEach((data) => {
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
      setFilteredData(averaged);
    }
  };

  return (
    <div className="flex flex-col w-full gap-8 rounded-md border border-muted-foreground p-4">
      <div className="flex flex-row justify-between">
        <h2 className="text-lg font-bold">Latency Over Time</h2>
        <div className="flex flex-row gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(day) => day && setDate(day)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
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
      </div>

      {filteredData.length > 0 ? (
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
              label={{
                value: "Latency (s)",
                angle: -90,
                position: "insideLeft",
              }}
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
      ) : (
        <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
          No data available for the selected date.
        </div>
      )}
    </div>
  );
}
