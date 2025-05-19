"use client"

import * as React from "react"
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
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Loader2, MoreHorizontal, RefreshCcw, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "../ui/badge"

export type Receipt = {
  _id: string
  referencenumber:string
  valuedate:string
  invoicenumber:string
  invoicedate:string
  transtype:string
  trancode:string
  supplier:string
  remarks:string
  itemname: string
  partnumber: string
  location: string
  quantity:number
}

export const columns: ColumnDef<Receipt>[] = [
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
       )
     },
     cell: ({ row }) => <ReferenceCell value={row.getValue("referencenumber")}/>,
   },
   {
    accessorKey: "valuedate",
    header: () => <div className="">Value Date</div>,
    cell: ({ row }) => {
      return <div className="font-medium">
        <Badge variant="outline" className="text-muted px-1.5">
        {row.getValue("valuedate")}
        </Badge>
        </div>
    },
  },
   {
    accessorKey: "invoicenumber",
    header: () => <div className="">Invoice Number</div>,
    cell: ({ row }) => {
      return <div className="font-medium">
        <Badge variant="outline" className="text-muted px-1.5">
        {row.getValue("invoicenumber")}
        </Badge>
        </div>
    },
  },
  {
    accessorKey: "invoicedate",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Invoice Date
            <ArrowUpDown />
          </Button>
        )
      },
    cell: ({ row }) => {
      return <div className="ml-4">{row.getValue("invoicedate")}</div>
    },
  },
   {
      accessorKey: "transtype",
      header: () => <div>Trans Type</div>,
      cell: ({ row }) => {
        return <div>
          <Badge variant="outline" className="text-muted px-1.5">
          {row.getValue("transtype")}
          </Badge>
          </div>
      },
    },
    {
      accessorKey: "transcode",
      header: () => <div className="">Trans Code</div>,
      cell: ({ row }) => {
        return <div>
          <Badge variant="outline" className="text-muted px-1.5">
          {row.getValue("transcode")}
          </Badge>
          </div>
      },
    },
     {
        accessorKey: "supplier",
        header: () => <div className="">Supplier</div>,
        cell: ({ row }) => {
          return <div>
            <Badge variant="outline" className="text-muted px-1.5">
            {row.getValue("supplier")}
            </Badge>
            </div>
        },
      },
      {
        accessorKey: "remarks",
        header: () => <div className="">Remarks</div>,
        cell: ({ row }) => {
          return <div>
            <p className="text-muted px-1.5">
            {row.getValue("remarks")}
            </p>
            </div>
        },
      },
  {
    accessorKey: "itemname",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Item Name
            <ArrowUpDown />
          </Button>
        )
      },
    cell: ({ row }) => {
      return <div className="ml-4">{row.getValue("itemname")}</div>
    },
  },
    {
      accessorKey: "partnumber",
      header: () => <div className="">Part Number</div>,
      cell: ({ row }) => {
        return <div>
          <Badge variant="outline" className="text-muted px-1.5">
          {row.getValue("partnumber")}
          </Badge>
          </div>
      },
    },
    {
      accessorKey: "location",
      header: () => <div className="">Location</div>,
      cell: ({ row }) => {
        return <div>
          <Badge variant="outline" className="text-muted px-1.5">
          {row.getValue("location")}
          </Badge>
          </div>
      },
    },
  {
    accessorKey: "quantity",
    header: () => <div className="">Quantity</div>,
    cell: ({ row }) => {

      return <div>{row.getValue("quantity")}</div>
    },
  },
  // {
  //   id: "actions",
  //   header:"Actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const payment = row.original
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuItem className="text-red-500"><Trash className="text-red-500" /> Delete</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     )
  //   },
  // },
]
const Getallreceipt = () => {
    const [receipt, setReceipt] = React.useState<Receipt[]>([])
    const [loading, setLoading] = React.useState(false)
  
    const fetchReceipt = async () => {
      setLoading(true)
      const response = await fetch("http://localhost:8000/api/v1/receipt")
      const data = await response.json()
      setReceipt(data.receipt)
      setLoading(false)
    }
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
            
    const table = useReactTable({
                data:receipt,
                columns,
                onSortingChange: setSorting,
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
                },
              })
     React.useEffect(() => {
           fetchReceipt()
      }, [])            
  return (
    <div className="w-full">
                <div className="flex items-center py-4">
                  <Input
                    placeholder="Filter Receipts..."
                    value={(table.getColumn("itemname")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                      table.getColumn("itemname")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm border-none placeholder:text-black dark:bg-white dark:text-black"
                  />
                  <div className="w-full flex justify-end mr-5">
        <Button disabled={loading} onClick={fetchReceipt}>
          {
            loading ? (
              <RefreshCcw className="animate-spin"/>
            ):(
              <p className="flex justify-center gap-2 items-center"> <RefreshCcw /> Refresh</p>
            )
          }
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
                          )
                        })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="rounded-sm bg-white">
                  {
                    loading ? (
                      <Loader2 className="h-4 w-full text-center animate-spin"/>
                    ):(

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
                            )
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
                    )
                  }
                </div>
              </div>
  )
}

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
      className="capitalize ml-3 font-medium hover:text-blue-600 transition cursor-copy"
      title="Click to copy"
    >
      {value} {copied && <span className="text-sm text-green-500 ml-2">Copied!</span>}
    </div>
  );
};

export default Getallreceipt