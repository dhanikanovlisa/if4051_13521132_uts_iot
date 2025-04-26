"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowDownUp, ArrowUp } from "lucide-react";
import { ImageMetadata } from "./action";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import dayjs from "dayjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DataTable({ data }: { data: ImageMetadata[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [openImage, setOpenImage] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const columns: ColumnDef<ImageMetadata>[] = useMemo(
    () => [
      {
        accessorKey: "send_at",
        header: ({ column }) => {
          return (
            <div
              className="flex cursor-pointer items-center justify-between space-x-2"
              onClick={() => {
                if (column.getIsSorted() === "asc") {
                  column.toggleSorting();
                } else if (column.getIsSorted() === "desc") {
                  column.clearSorting();
                } else {
                  column.toggleSorting();
                }
              }}
            >
              <div className="flex flex-col">
                <span>Send At</span>
                <span className="text-[10px] font-light text-muted-foreground">
                  Waktu ketika chunk pertama dikirim
                </span>
              </div>
              {column.getIsSorted() === "asc" ? (
                <ArrowUp size={16} className="text-muted-foreground" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown size={16} className="text-muted-foreground" />
              ) : (
                <ArrowDownUp size={16} className="text-muted-foreground" />
              )}
            </div>
          );
        },
        cell: ({ row }) => {
          const sendTime = row.getValue("send_at") as string;
          return <div>{dayjs(sendTime).format("YYYY-MM-DD HH:mm:ss")}</div>;
        },

        enableSorting: true,
        enableMultiSort: true,
      },
      {
        accessorKey: "received_at",
        header: ({ column }) => {
          return (
            <div
              className="flex cursor-pointer items-center justify-between space-x-2"
              onClick={() => {
                if (column.getIsSorted() === "asc") {
                  column.toggleSorting();
                } else if (column.getIsSorted() === "desc") {
                  column.clearSorting();
                } else {
                  column.toggleSorting();
                }
              }}
            >
              <div className="flex flex-col">
                <span>Received At</span>
                <span className="text-[10px] font-light text-muted-foreground">
                  Waktu chunk terakhir diterima
                </span>
              </div>
              {column.getIsSorted() === "asc" ? (
                <ArrowUp size={16} className="text-muted-foreground" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown size={16} className="text-muted-foreground" />
              ) : (
                <ArrowDownUp size={16} className="text-muted-foreground" />
              )}
            </div>
          );
        },
        cell: ({ row }) => {
          const receiveTime = row.getValue("received_at") as string;
          return <div>{dayjs(receiveTime).format("YYYY-MM-DD HH:mm:ss")}</div>;
        },
        enableSorting: true,
      },
      {
        accessorKey: "latency",
        header: ({ column }) => {
          return (
            <div
              className="flex cursor-pointer items-center justify-between space-x-2"
              onClick={() => {
                if (column.getIsSorted() === "asc") {
                  column.toggleSorting();
                } else if (column.getIsSorted() === "desc") {
                  column.clearSorting();
                } else {
                  column.toggleSorting();
                }
              }}
            >
              <div className="flex flex-col">
                <span>Latency</span>
                <span className="text-[10px] font-light text-muted-foreground"></span>
              </div>
              {column.getIsSorted() === "asc" ? (
                <ArrowUp size={16} className="text-muted-foreground" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown size={16} className="text-muted-foreground" />
              ) : (
                <ArrowDownUp size={16} className="text-muted-foreground" />
              )}
            </div>
          );
        },
        cell: ({ row }) => {
          const latency = row.getValue("latency") as number;
          return <div>{latency.toFixed(3)}</div>;
        },
        enableSorting: true,
      },
      {
        accessorKey: "avg_chunk_size",
        header: ({ column }) => {
          return (
            <div
              className="flex cursor-pointer items-center justify-between space-x-2"
              onClick={() => {
                if (column.getIsSorted() === "asc") {
                  column.toggleSorting();
                } else if (column.getIsSorted() === "desc") {
                  column.clearSorting();
                } else {
                  column.toggleSorting();
                }
              }}
            >
              <div className="flex flex-col">
                <span>Average Chunk Size</span>
                <span className="text-[10px] font-light text-muted-foreground"></span>
              </div>
              {column.getIsSorted() === "asc" ? (
                <ArrowUp size={16} className="text-muted-foreground" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown size={16} className="text-muted-foreground" />
              ) : (
                <ArrowDownUp size={16} className="text-muted-foreground" />
              )}
            </div>
          );
        },
        cell: ({ row }) => {
          const avgChunkSize = row.getValue("avg_chunk_size") as number;
          return <div>{avgChunkSize.toFixed(3)}</div>;
        },
        enableSorting: true,
      },
      {
        accessorKey: "transmission_efficiency",
        header: ({ column }) => {
          return (
            <div
              className="flex cursor-pointer items-center justify-between space-x-2"
              onClick={() => {
                if (column.getIsSorted() === "asc") {
                  column.toggleSorting();
                } else if (column.getIsSorted() === "desc") {
                  column.clearSorting();
                } else {
                  column.toggleSorting();
                }
              }}
            >
              <div className="flex flex-col">
                <span>Transmission Efficiency</span>
                <span className="text-[10px] font-light text-muted-foreground">
                  CHUNK_SIZE = 8192, MAX: 20480
                </span>
              </div>
              {column.getIsSorted() === "asc" ? (
                <ArrowUp size={16} className="text-muted-foreground" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown size={16} className="text-muted-foreground" />
              ) : (
                <ArrowDownUp size={16} className="text-muted-foreground" />
              )}
            </div>
          );
        },
        cell: ({ row }) => {
          const transmissionEfficiency = row.getValue(
            "transmission_efficiency"
          ) as number;
          return <div>{transmissionEfficiency.toFixed(3)}</div>;
        },
        enableSorting: true,
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => {
          return (
            <div
              className="flex cursor-pointer items-center justify-between space-x-2"
              onClick={() => {
                if (column.getIsSorted() === "asc") {
                  column.toggleSorting();
                } else if (column.getIsSorted() === "desc") {
                  column.clearSorting();
                } else {
                  column.toggleSorting();
                }
              }}
            >
              <div className="flex flex-col">
                <span>Created At</span>
                <span className="text-[10px] font-light text-muted-foreground">
                  Waktu data dimasukkan ke dalam db
                </span>
              </div>
              {column.getIsSorted() === "asc" ? (
                <ArrowUp size={16} className="text-muted-foreground" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown size={16} className="text-muted-foreground" />
              ) : (
                <ArrowDownUp size={16} className="text-muted-foreground" />
              )}
            </div>
          );
        },
        cell: ({ row }) => {
          const createdAt = row.getValue("created_at") as string;
          return <div>{dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss")}</div>;
        },
        enableSorting: true,
      },
      {
        accessorKey: "file_path",
        header: ({ column }) => {
          return (
            <div
              className="flex cursor-pointer items-center justify-between space-x-2"
              onClick={() => {
                if (column.getIsSorted() === "asc") {
                  column.toggleSorting();
                } else if (column.getIsSorted() === "desc") {
                  column.clearSorting();
                } else {
                  column.toggleSorting();
                }
              }}
            >
              <span>Image</span>
              {column.getIsSorted() === "asc" ? (
                <ArrowUp size={16} className="text-muted-foreground" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown size={16} className="text-muted-foreground" />
              ) : (
                <ArrowDownUp size={16} className="text-muted-foreground" />
              )}
            </div>
          );
        },
        cell: ({ row }) => {
          const file = row.original;
          return (
            <Button
              variant="link"
              className="text-blue-500 hover:underline"
              onClick={() => setOpenImage(file.public_url)}
            >
              {file.file_path}
            </Button>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: data,
    columns,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
    },
    onPaginationChange: setPagination,
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full space-y-2">
      {/* <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 size-5 -translate-y-1/2 transform text-neutral-500 dark:text-white" />
        <Input
          name="q"
          placeholder="Search"
          className="ps-10"
          onChange={(e) => handleSearch(e.currentTarget.value)}
        />
      </div> */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex items-center space-x-2 justify-end">
          <Button
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>

          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
          <Button
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
          <Select
            value={String(pagination.pageSize)}
            onValueChange={(value) => {
              const size = Number(value);
              setPagination((prev) => ({
                ...prev,
                pageSize: size,
              }));
              table.setPageSize(size);
            }}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue
                placeholder="Page Size"
                defaultValue={String(table.getState().pagination.pageSize)}
              />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={String(pageSize)}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Dialog open={openImage !== null} onOpenChange={() => setOpenImage(null)}>
        <DialogContent className="max-w-[90vw]">
          <DialogHeader>
            <DialogTitle className="break-all">Preview Image</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center max-h-[80vh] overflow-auto">
            {openImage && (
              <Image
                src={openImage}
                alt="Image Preview"
                width={640}
                height={480}
                className="rounded-md"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
