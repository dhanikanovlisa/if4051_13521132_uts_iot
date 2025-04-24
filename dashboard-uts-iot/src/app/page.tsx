import { DataTable } from "./data-table";
import { getData } from "./action";

export default async function Home() {
  const data = await getData();
  return (
    <div className="flex flex-col min-h-screen p-8 space-y-2">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div>
        <DataTable data={data} />
      </div>
    </div>
  );
}
