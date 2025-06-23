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
import { Badge } from "../ui/badge"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useAuth } from "@/hooks/use-auth"

export type User = {
  _id: string
  name: string
  email:string
  password:string
  role:string
}
const handleDelete = async(id:any)=> {
  try{
    const response = await fetch(`http://localhost:8000/api/v1/user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to deleting user")
    }
    toast.success(
          "Success! User deleted.",
        )
  }catch(error){
    toast.error(
      `Failed to delete user, Error: ${error}`
   )
  }
}
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
        Name
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
        return <TableCellViewer item={row.original}/>
    }
  },
  {
    accessorKey: "email",
    header: () => <div className="">Email</div>,
    cell: ({ row }) => {

      return <div className="font-medium">
        <Badge variant="outline" className="text-secondary px-1.5">
        {row.getValue("email")}
        </Badge>
        </div>
    },
  },
    {
        accessorKey: "role",
        header: () => <div className="">Role</div>,
        cell: ({ row }) => {
    
          return <div className="font-medium">
            <Badge variant="outline" className="text-secondary px-1.5">
            {row.getValue("role")}
            </Badge>
            </div>
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

const Getuser = () => {
      const [user, setUser] = React.useState<User[]>([])
      const [loading, setLoading] = React.useState(true)

      const fetchUser = async () => {
        setLoading(true)
        const response = await fetch("http://localhost:8000/api/v1/user/")
        const data = await response.json()
        setUser(data.user)
        setLoading(false)
      }
      const fetchAUser = async () => {
        const response = await fetch("http://localhost:8000/api/v1/user/")
        const data = await response.json()
        setUser(data.user)
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
            data:user,
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
              fetchUser()
            }, [])
          React.useEffect(() => {
            const interval = setInterval(()=>{
              fetchAUser();
            },3000)
            return () => clearInterval(interval);
            }, [])  
  return (
    <div className="w-full">
           <div className="flex items-center py-4">
             <Input
               placeholder="Filter Users..."
               value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
               onChange={(event) =>
                 table.getColumn("name")?.setFilterValue(event.target.value)
               }
               className="max-w-sm border-none placeholder:text-black dark:bg-white dark:text-white"
             />
             <div className="w-full flex justify-end mr-5">
        <Button disabled={loading} onClick={fetchUser}>
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
           <div className="rounded-sm bg-white">
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
  const isMobile = useIsMobile()
  const [newname, setNewname] = React.useState("")
  const [newemail, setNewemail] = React.useState("")
  const [newrole, setNewrole] = React.useState("")
  const [isUpdating, setIsUpdating] = React.useState(false)
    async function onUpdate(){
      setIsUpdating(true)
      let name = newname ||  item.name
      let email = newemail ||  item.email
      let role = newrole ||  item.role
      try{
        const response = await fetch (`http://localhost:8000/api/v1/user/update/${item.id}`,{
          method:"PUT",
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify({name,email,role})
        })
        if (!response.ok) {
          const error = await response.json()
          toast.error(`Failed to update user: ${error}`)
          throw new Error(error.message || "Failed to create post")
        }
        toast.success(
          "Success! user has been updated",
       )
      } catch (error) {
        toast.error(
           `Failed to update user, Error ${error}`,
        )
      } finally {
        setIsUpdating(false)
      }
    }
  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-secondary w-fit cursor-pointer">
          {item.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Edit User</DrawerTitle>
          <DrawerDescription>
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Name</Label>
              <Input id="header" defaultValue={item.name} onChange={(e)=>setNewname(e.target.value)} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Email</Label>
              <Input id="header" defaultValue={item.email} onChange={(e)=>setNewemail(e.target.value)} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Role</Label>
              <Select onValueChange={setNewrole} value={newrole} defaultValue={item.role}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
            </div>
          </form>
          <p>Password cannot be updated, when users are added, their passwords are hashed</p>
        </div>
        <DrawerFooter>
          <Button className="cursor-pointer" disabled={isUpdating} onClick={onUpdate}>
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
      </DrawerContent>
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
export default Getuser