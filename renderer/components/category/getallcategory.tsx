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
import { ArrowUpDown, ChevronDown, Edit, Loader2, MoreHorizontal, RefreshCcw, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useIsMobile } from "@/hooks/use-mobile"
import { DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose, Drawer } from "../ui/drawer"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"

export type Category = {
  _id: string
  name: string
  description: string
}

const handleDelete = async(id:any)=> {
  try{
    const response = await fetch(`http://localhost:8000/api/v1/category/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to deleting category")
    }
    toast.success(
          "Success! Category deleted.",
        )
  }catch(error){
    toast.error(
      `Failed to delete category, Error: ${error}`
   )
  }
}
export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category Name
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <TableCellViewer item={row.original}/>
    }
  },
  {
    accessorKey: "description",
    header: () => <div className="">Description</div>,
    cell: ({ row }) => {

      return <div>{row.getValue("description")}</div>
    },
  },
  {
    id: "actions",
    header:"Actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DeleteButton item={row.original}/>
        )
    },
  },
]

export function Getallcategory() {
    const [category, setCategory] = React.useState<Category[]>([])
    const [loading, setLoading] = React.useState(false)

    const fetchCategory = async () => {
      setLoading(true)
      const response = await fetch("http://localhost:8000/api/v1/category")
      const data = await response.json()
      setCategory(data.categories)
      setLoading(false)
    }
    const fetchACategory = async () => {
      const response = await fetch("http://localhost:8000/api/v1/category")
      const data = await response.json()
      setCategory(data.categories)
    }
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data: category,
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
      pagination
    },
  })
React.useEffect(() => {
    fetchCategory();
  }, [])
React.useEffect(() => {
  const interval = setInterval(()=>{
    fetchACategory();
  },3000)
  return () => clearInterval(interval);
  }, [])
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Category..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm border-none placeholder:text-black dark:bg-white dark:text-black"
        />
        <div className="w-full flex justify-end mr-5">
        <Button disabled={loading} onClick={fetchCategory}>
          {
            loading ? (
              <RefreshCcw className="animate-spin"/>
            ):(
              <p className="flex justify-center gap-2 items-center"> <RefreshCcw /></p>
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
      <div className="bg-white rounded-sm">
        {
          loading ? (
            <Loader2  className="h-4 animate-spin w-full text-center"/>
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
  )
}

function TableCellViewer({ item }: {item:any }) {
  const [openSide, setOpenSide] = React.useState(false)
  const isMobile = useIsMobile()
  const [newcategory, setNewcategory] = React.useState("")
  const [newdescription, setNewdescription] = React.useState("")
  const [isUpdating, setIsUpdating] = React.useState(false)
    async function onUpdate(){
      setIsUpdating(true)
      let name = newcategory ||  item.name
      let description = newdescription ||  item.description
      try{
        const response = await fetch (`http://localhost:8000/api/v1/category/update/${item.id}`,{
          method:"PUT",
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify({name,description})
        })
        if (!response.ok) {
          const error = await response.json()
          toast.error(`Failed to update category: ${error}`)
          throw new Error(error.message || "Failed to create post")
        }
        toast.success("Success! category has been updated",)
       setOpenSide(false)
      } catch (error) {
        toast.error(
           `Failed to update catgory, Error ${error}`,
        )
      } finally {
        setIsUpdating(false)
      }
    }
  
    const handleOpenSide = () => {
      setOpenSide(true)
    }
  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-secondary w-fit cursor-pointer" onClick={handleOpenSide}>
          {item.name}
        </Button>
      </DrawerTrigger>
      {
        openSide ? (<DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Edit Category</DrawerTitle>
          <DrawerDescription>
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Category Name</Label>
              <Input id="header" defaultValue={item.name} onChange={(e)=>setNewcategory(e.target.value)}/>
            </div>
            <div className="flex flex-col gap-4">
            <Label htmlFor="description">
                Description
            </Label>
            <Textarea id="description" defaultValue={item.description} onChange={(e)=>setNewdescription(e.target.value)} className="col-span-3" />
          </div>
          </form>
        </div>
        <DrawerFooter>
          <Button disabled={isUpdating} onClick={onUpdate} className="cursor-pointer">
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="cursor-pointer">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>): (<></>)
      }

    </Drawer>
  )
}

function DeleteButton ({item}: {item:any}) {
  const { user } = useAuth()
  return(
    <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          {
             user?.role === 'admin' ?(<DropdownMenuContent align="end">
              <DropdownMenuItem className="text-red-500" onClick={()=>handleDelete(item.id)}><Trash className="text-red-500 mr-2" /> Delete</DropdownMenuItem>
              </DropdownMenuContent>):(<></>) 
            }
      </DropdownMenu>
  )

}