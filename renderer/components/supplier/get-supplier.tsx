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
  MoreHorizontal,
  RefreshCcw,
  Trash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  Drawer,
} from "../ui/drawer";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export type Supplier = {
  _id: string;
  name: string;
  email: string;
  contact: string;
  address: string;
};

const handleDelete = async (id: any) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/supplier/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete supplier");
    }
    toast.success("Success! Supplier deleted.");
  } catch (error) {
    toast.error(`Failed to delete supplier, Error: ${error}`);
  }
};

export const columns: ColumnDef<Supplier>[] = [
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
      );
    },
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />;
    },
  },
  {
    accessorKey: "email",
    header: () => <div className="">Email</div>,
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          <Badge variant="outline" className="text-muted px-1.5">
            {row.getValue("email")}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "contact",
    header: () => <div className="">Contact</div>,
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          <Badge variant="outline" className="text-muted px-1.5">
            {row.getValue("contact")}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: () => <div className="">Address</div>,
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          <Badge variant="outline" className="text-muted px-1.5">
            {row.getValue("address")}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <DeleteButton item={row.original} />;
    },
  },
];

const Getsupplier = () => {
  const [supplier, setSupplier] = React.useState<Supplier[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchSupplier = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:8000/api/v1/supplier");
    const data = await response.json();
    setSupplier(data.supplier);
    setLoading(false);
  };
  const fetchASupplier = async () => {
    const response = await fetch("http://localhost:8000/api/v1/supplier");
    const data = await response.json();
    setSupplier(data.supplier);
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
    data: supplier,
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
    fetchSupplier();
  }, []);
  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchASupplier();
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Suppliers..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm border-none placeholder:text-black dark:bg-white dark:text-black"
        />
        <div className="w-full flex justify-end mr-5">
          <Button disabled={loading} onClick={fetchSupplier}>
            {loading ? (
              <RefreshCcw className="animate-spin" />
            ) : (
              <p className="flex justify-center gap-2 items-center">
                {" "}
                <RefreshCcw />
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
          <Loader2 className="h-4 animate-spin w-full text-center" />
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

function TableCellViewer({ item }: { item: any }) {
  const [openSide, setOpenSide] = React.useState(false)   
  const isMobile = useIsMobile();
  const [newname, setNewname] = React.useState("");
  const [newemail, setNewemail] = React.useState("");
  const [newcontact, setNewcontact] = React.useState("");
  const [newaddress, setNewaddress] = React.useState("");
  const [isUpdating, setIsUpdating] = React.useState(false);

  async function onUpdate() {
    setIsUpdating(true);
    let name = newname || item.name;
    let email = newemail || item.email;
    let contact = newcontact || item.contact;
    let address = newaddress || item.address;
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/supplier/update/${item.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, contact, address }),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        toast.error(`Failed to update supplier: ${error}`);
        throw new Error(error.message || "Failed to create post");
      }
      toast.success("Success! supplier has been updated");
      setOpenSide(false)
    } catch (error) {
      toast.error(`Failed to update supplier, Error ${error}`);
    } finally {
      setIsUpdating(false);
      setOpenSide(false)
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
        openSide ? (
                <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Edit Supplier</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Supplier Name</Label>
              <Input
                id="header"
                defaultValue={item.name}
                onChange={(e) => setNewname(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Email</Label>
              <Input
                id="header"
                defaultValue={item.email}
                onChange={(e) => setNewemail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Contact</Label>
              <Input
                id="header"
                defaultValue={item.contact}
                onChange={(e) => setNewcontact(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Address</Label>
              <Input
                id="header"
                defaultValue={item.address}
                onChange={(e) => setNewaddress(e.target.value)}
              />
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button
            disabled={isUpdating}
            onClick={onUpdate}
            className="cursor-pointer"
          >
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
            <Button variant="outline" className="cursor-pointer">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
        ): (<></>)
      }
    </Drawer>
  );
}
function DeleteButton({ item }: { item: any }) {
  const { user } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      {user?.role === "admin" ? (
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-red-500"
            onClick={() => handleDelete(item.id)}
          >
            <Trash className="text-red-500 mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      ) : (
        <></>
      )}
    </DropdownMenu>
  );
}
export default Getsupplier;
