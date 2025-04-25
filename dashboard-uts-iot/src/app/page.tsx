import { DataTable } from "./data-table";
import { DataChart, getData } from "./action";
import { Timer } from "lucide-react";
import { DataChartComponent } from "./data-chart";
import dayjs from "dayjs";

export default async function Home() {
  const { avgLatencies, dataImage, maxLatency, minLatency } = await getData();
  const chartData: DataChart[] = dataImage.map((data) => {
    return {
      timestamp: dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
      latency: data.latency,
    };
  });
  return (
    <div className="flex flex-col min-h-screen p-8 space-y-2">
      <div className="flex flex-row justify-between items-center align-middle">
        <h1 className="text-3xl font-bold py-4">Dashboard</h1>
      </div>
      <div className="flex flex-row w-full justify-between gap-4">
        <DataChartComponent data={chartData} />
        <div className="flex flex-col gap-2 w-[20vw]">
          <div className="flex flex-col border border-muted-foreground rounded-md p-4 gap-2">
            <div className="flex flex-row justify-between">
              <h3 className=" text-sm font-semibold">Average Latency</h3>
              <Timer className="text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">
              {avgLatencies.toFixed(3)}
              <span className="mr-2 text-sm font-medium">s</span>
            </p>
          </div>
          <div className="flex flex-col border border-muted-foreground rounded-md p-4 gap-2">
            <div className="flex flex-row justify-between">
              <h3 className=" text-sm font-semibold">Max Latency</h3>
              <Timer className="text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">
              {maxLatency.toFixed(3)}
              <span className="mr-2 text-sm font-medium">s</span>
            </p>
          </div>
          <div className="flex flex-col border border-muted-foreground rounded-md p-4 gap-2">
            <div className="flex flex-row justify-between">
              <h3 className=" text-sm font-semibold">Min Latency</h3>
              <Timer className="text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">
              {minLatency.toFixed(3)}
              <span className="mr-2 text-sm font-medium">s</span>
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <DataTable data={dataImage} />
      </div>
    </div>
  );
}
