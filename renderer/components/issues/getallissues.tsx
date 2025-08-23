"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Loader2,
  RefreshCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";


export type Issues = {
  _id: string;
  referencenumber: string;
  valuedate: string;
  transtype: string;
  trancode: string;
  customer: string;
  remarks: string;
  itemname: string;
  partnumber: string;
  location: string;
  quantity: number;
};

export const columns: ColumnDef<Issues>[] = [
  {
    accessorKey: "referencenumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Reference Number
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <ReferenceCell value={row.getValue("referencenumber")} />
    ),
  },
  {
    accessorKey: "valuedate",
    header: () => <div className="">Value Date</div>,
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          <Badge variant="outline" className="text-muted px-1.5">
            {row.getValue("valuedate")}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "transtype",
    header: () => <div>Trans Type</div>,
    cell: ({ row }) => {
      return (
        <div>
          <Badge variant="outline" className="text-muted px-1.5">
            {row.getValue("transtype")}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "transcode",
    header: () => <div className="">Trans Code</div>,
    cell: ({ row }) => {
      return (
        <div>
          <Badge variant="outline" className="text-muted px-1.5">
            {row.getValue("transcode")}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "customer",
    header: () => <div className="">Customer</div>,
    cell: ({ row }) => {
      return (
        <div>
          <Badge variant="outline" className="text-muted px-1.5">
            {row.getValue("customer")}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "remarks",
    header: () => <div className="">Remarks</div>,
    cell: ({ row }) => {
      return (
        <div>
          <Badge variant="outline" className="text-muted px-1.5">
            {row.getValue("remarks")}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <div>
          <ItemViewer item={payment} />
        </div>
      );
    },
  },
];

const Getallissues = () => {
  const [issue, setIssue] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchIssue = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/v1/issue/");
      const data = await response.json();

      // Remove duplicates by referencenumber
      const uniqueIssues = Array.from(
        new Map(
          data.issues.map((item: { referencenumber: any }) => [
            item.referencenumber,
            item,
          ])
        ).values()
      );

      setIssue(uniqueIssues);
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchAIssue = async () => {
    const response = await fetch("http://localhost:8000/api/v1/issue/");
    const data = await response.json();
    const uniqueIssues = Array.from(
      new Map(
        data.issues.map((item: { referencenumber: any }) => [
          item.referencenumber,
          item,
        ])
      ).values()
    );

    setIssue(uniqueIssues);
  };

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: issue,
    columns,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });
  React.useEffect(() => {
    fetchIssue();
  }, []);
  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchAIssue();
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Issues..."
          value={
            (table.getColumn("referencenumber")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("referencenumber")?.setFilterValue(event.target.value)
          }
          className="max-w-sm border-none placeholder:text-black dark:bg-white dark:text-black"
        />
        <div className="w-full flex justify-end mr-5">
          <Button disabled={loading} onClick={fetchIssue}>
            {loading ? (
              <RefreshCcw className="animate-spin" />
            ) : (
              <p className="flex justify-center gap-2 items-center">
                {" "}
                <RefreshCcw />{" "}
              </p>
            )}
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-sm bg-white">
        {loading ? (
          <Loader2 className="h-4 w-full text-center animate-spin" />
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="text-secondary">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
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
                      <TableCell key={cell.id} className="text-secondary">
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
                    className="h-24 text-center text-secondary"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

const ReferenceCell = ({ value }: { value: string }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // reset after 1.5s
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      onClick={handleCopy}
      className="capitalize ml-3 font-medium transition cursor-copy"
      title="Click to copy"
    >
      {value}{" "}
      {copied && <span className="text-sm text-green-500 ml-2">Copied!</span>}
    </div>
  );
};

function ItemViewer({ item }: { item: any }) {
  const [searchedIssuename, setSearchedIssueName] = React.useState<any>([]);
  const [detailsSearch, setDetailsSearch] = React.useState(true);
  const fetchNewParams = async () => {
    setDetailsSearch(true);
    let referencenumber = item.referencenumber;
    const params = new URLSearchParams();
    if (referencenumber) params.append("referencenumber", referencenumber);
    const queryString = params.toString();

    const response = await fetch(
      `http://localhost:8000/api/v1/issue/search/report?${queryString}`
    );
    const data = await response.json();
    setSearchedIssueName(data.searchedIssue);
    setDetailsSearch(false);
  };
  React.useEffect(() => {
    fetchNewParams();
  }, []);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer text-white">View Items</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[1050px] max-h-fit">
        <DialogHeader>
          <DialogTitle>Details of {item.referencenumber}</DialogTitle>
        </DialogHeader>
        {detailsSearch ? (
          <Loader2 className="w-full h-4 animate-spin" />
        ) : (
          <>
            <div className="w-full p-4 border rounded-lg">
              <div className="w-full py-2">
                <p className="py-1">Issues Items</p>
                <div>
                  <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10">
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Part No.</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Quantity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchedIssuename.length ? (
                        searchedIssuename.map((item: any) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.itemname}</TableCell>
                            <TableCell>{item.partnumber}</TableCell>
                            <TableCell>{item.location}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow className="text-center p-5">
                          <TableCell>No item found.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
export default Getallissues;
