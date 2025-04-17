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
import { ArrowUpDown, ChevronDown, Edit, MoreHorizontal, RefreshCcw, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { toast } from "sonner"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { Label } from "../ui/label"


export type Stock = {
  _id: string
  name: string
  partnumber: number
  location:string
  measurement:string
  quantity:number
  category:string
  max_stock:number
  min_stock:number
  price:number
}

const handleDelete = async(id:any)=> {
  try{
    const response = await fetch(`/api/stock/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to deleting stock")
    }
    toast(
          "Success! Stock deleted.",
        )
  }catch(error){
    toast(
      `Failed to delete stock, Error: ${error}`
   )
  }
}
export const columns: ColumnDef<Stock>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Inventory Name
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="captilize ml-3 font-medium">
      {row.getValue("name")}</div>,
  },
  {
    accessorKey: "partnumber",
    header: () => <div className="">Part Number</div>,
    cell: ({ row }) => {

      return <div className="font-medium">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
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
        <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.getValue("location")}
        </Badge>
        </div>
    },
  },
  {
    accessorKey: "measurement",
    header: () => <div className="">Measurement</div>,
    cell: ({ row }) => {
      return <div>
        <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.getValue("measurement")}
        </Badge>
        </div>
    },
  },
  {
    accessorKey: "quantity",
    header: () => <div className="">Quantity</div>,
    cell: ({ row }) => {
      return <div>
        <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.getValue("quantity")}
        </Badge>
        </div>
    },
  },
  {
    accessorKey: "category",
    header: () => <div className="">Category</div>,
    cell: ({ row }) => {
      return <div>
        <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.getValue("category")}
        </Badge>
        </div>
    },
  },
  {
    accessorKey: "max_stock",
    header: () => <div className="">Max. in stock</div>,
    cell: ({ row }) => {
      return <div>
        <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.getValue("max_stock")}
        </Badge>
        </div>
    },
  },
  {
    accessorKey: "min_stock",
    header: () => <div className="">Min. in stock</div>,
    cell: ({ row }) => {
      return <div>
        <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.getValue("min_stock")}
        </Badge>
        </div>
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="">Price</div>,
    cell: ({ row }) => {
      return <div>
        <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.getValue("price")}
        </Badge>
        </div>
    },
  },
]


const DataTable = () => {
        const [stock, setStock] = React.useState<Stock[]>([])
        const [loading, setLoading] = React.useState(true)

        const fetchStock = async () => {
          setLoading(true)
          const response = await fetch("/api/stock")
          const data = await response.json()
          setStock(data.stocks)
          setLoading(false)
        }

     const [sorting, setSorting] = React.useState<SortingState>([])
      const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
      )
      const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
      const [rowSelection, setRowSelection] = React.useState({})
    
      const table = useReactTable({
        data:stock,
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
                    fetchStock()
                  }, [])
  return (
    <div className="w-full">
         <div className="flex items-center py-4">
           <div><h2 className="text-xl font-bold text-secondary">Recent Stock</h2></div>
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
         <div className="">
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
                     className="h-24 text-center text-secondary"
                   >
                     No results.
                   </TableCell>
                 </TableRow>
               )}
             </TableBody>
           </Table>
         </div>
       </div>
  )
}
function TableCellViewer({ item }: {item:any }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit cursor-pointer">
          {item.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Edit Stock</DrawerTitle>
          <DrawerDescription>
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Name</Label>
              <Input id="header" defaultValue={item.name} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Part Number</Label>
              <Input id="header" defaultValue={item.partnumber} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Category</Label>
              <Input id="header" defaultValue={item.category} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Location</Label>
              <Input id="header" defaultValue={item.location} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Measurement</Label>
              <Input id="header" defaultValue={item.measurement} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Quantity</Label>
              <Input id="header" defaultValue={item.quantity} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Max. in Stock</Label>
              <Input id="header" defaultValue={item.max_stock} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Min. in Stock</Label>
              <Input id="header" defaultValue={item.min_stock} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Price</Label>
              <Input id="header" defaultValue={item.price} />
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Save</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
export default DataTable