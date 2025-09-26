"use client";
import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader, LoaderCircle, MoreHorizontal, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { z } from "zod";
import { PartNumberSelector } from "../combobox";
import { useAuth } from "@/hooks/use-auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

const BalancesPage = () => {
  const [fetching, setFetching] = useState(true);
  const [show, setShow] = useState(false);
  const [name, setItemname] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [location, setLocation] = useState("");
  const [partnumber, setPartnumber] = useState("");
  const [fetchedItems, setItems] = useState<any>([]);
  const [fetchedTems, setTems] = useState<any>([]);
  const [storeddata, setPreStoredData] = useState<any>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const balanceSchema = z.object({
    name: z.string().min(1, "Stock name cannot be empty"),
    location: z.string().min(1, "Stock location cannot be empty"),
    partnumber: z.string().min(1, "Stock partnumber cannot be empty"),
    quantity: z.number().positive("Stock quantity should be positive"),
  });

  const fetchItems = async () => {
    setFetching(true);
    const response = await fetch("http://localhost:8000/api/v1/stock/stockwithoutbalance");
    const data = await response.json();
    setItems(data.stock);
    setFetching(false);
  };
  const fetchOpenedItems = async () => {
    setFetching(true);
    const response = await fetch(
      "http://localhost:8000/api/v1/stock/getAllOpenBalance/"
    );
    const data = await response.json();
    setPreStoredData(data.openbalance);
    setFetching(false);
  };
  const fetchOpenedAItems = async () => {
    const response = await fetch(
      "http://localhost:8000/api/v1/stock/getAllOpenBalance/"
    );
    const data = await response.json();
    setPreStoredData(data.openbalance);
  };
  const addPreStoredData = async () => {
    let prevQuantity = 0;
    let addedQuantity = quantity;
    let newQuantity = quantity;
    setIsSubmitting(true);
    const result = balanceSchema.safeParse({
      name: name,
      location: location,
      partnumber: partnumber,
      quantity: quantity,
    });
    if (!result.success) {
      setError(
        result.error.format().name?._errors[0] ||
          result.error.format().location?._errors[0] ||
          result.error.format().partnumber?._errors[0] ||
          result.error.format().quantity?._errors[0] ||
          "invalid inputs"
      );
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/stock/addOpenbalance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, location, partnumber, quantity }),
        }
      );
      const newres = await fetch(
        "http://localhost:8000/api/v1/stock/addStockhistory",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            prevQuantity,
            Issue:0,
            Receipt:0,
            newQuantity,
          }),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        toast.error(`${error.message}`);
        throw new Error(error.message);
      }
      if (!newres.ok) {
        const error = await newres.json();
        toast.error(`${error.message}`);
        throw new Error(error.message);
      }

      toast.success("Success! New stock is opened.");
    } catch (err) {
      toast.error(`Failed to create an open stock, Error: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleItemChange = (e: any) => {
    const selectedId = e.target.value;
    const selectedItem = fetchedItems.find(
      (item: any) => item.id == selectedId
    );
    setTems(selectedItem)
    setShow(true)
    if (selectedItem) {
      setItemname(selectedItem.name);
      setLocation(selectedItem.location);
      setPartnumber(selectedItem.partnumber);
    }
  };
  useEffect(() => {
    fetchItems();
    fetchOpenedItems();
  }, []);
  useEffect(()=>{
    const interval = setInterval(()=>{
      fetchOpenedAItems()
    },3000)
    return ()=>clearInterval(interval)
  },[])
  return (
    <div className="px-4 lg:px-6">
      <div className="flex gap-5 justify-between py-5">
        <div className="grid grid-cols-3">
          {fetching ? (
            <LoaderCircle className="h-5 w-full text-center animate-spin" />
          ) : (
            <div className="flex gap-5">
              <div className="flex gap-4 flex-1/3">
                <Label htmlFor="item" className="text-right text-secondary">
                  Item Name
                </Label>
                <select
                  id="item"
                  onChange={handleItemChange}
                  className="col-span-3 border rounded px-2 py-1"
                >
                  {/* <option disabled>Select an item</option> */}
                  {fetchedItems.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 flex-1/3">
                <Label htmlFor="item" className="text-right text-secondary">
                  Part Number
                </Label>
                <select
                  id="item"
                  onChange={handleItemChange}
                  className="col-span-3 border rounded px-2 py-1"
                >
                  {/* <option disabled>Select an item</option> */}
                  {fetchedItems.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.partnumber}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
      {
        show ? (
          <div className="bg-white rounded-lg shadow-lg mb-5">
      <div className="text-black grid grid-cols-5 gap-2 p-5 mb-5">
        <p><span className="font-bold">Name:</span> {fetchedTems.name}</p>
        <p><span className="font-bold">Description</span>: {fetchedTems.description}</p>
        <p><span className="font-bold">Category:</span> {fetchedTems.category}</p>
        <p><span className="font-bold">Location:</span> {fetchedTems.location}</p>
        <p><span className="font-bold">Part Number:</span> {fetchedTems.partnumber}</p>
        <p><span className="font-bold">Yards:</span> {fetchedTems.measurement}</p>
        <p><span className="font-bold">Max. stock:</span> {fetchedTems.max_stock}</p>
        <p><span className="font-bold">Min. stock:</span> {fetchedTems.min_stock}</p>
        <p><span className="font-bold">Price:</span> {fetchedTems.price}</p>
      </div>
      <div className="flex justify-between px-5 py-2">
        <div className="flex gap-4 flex-1/3">
                <Label htmlFor="quantity" className="text-right text-secondary">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  placeholder="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(+e.target.value)}
                  className="col-span-3 border placeholder:text-black dark:bg-white dark:text-black"
                />
              </div>
               {error && (
                <p className="text-red-500 text-sm col-span-3 col-start-2 text-center">
                  {error}
                </p>
              )}
            <Button onClick={addPreStoredData} disabled={isSubmitting}>
          {isSubmitting ? <Loader className="h-4 w-4 animate-spin" /> : "Save"}
        </Button>    

      </div>
      </div>
        ):(<></>)
      }
      <Separator />
      <div className="py-5 bg-white mt-5 rounded-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-secondary font-bold">Stock</TableHead>
              <TableHead className="text-secondary font-bold">
                Part Number
              </TableHead>
              <TableHead className="text-secondary font-bold">
                Location
              </TableHead>
              <TableHead className="text-secondary font-bold">
                Quantity
              </TableHead>
              <TableHead className="text-secondary font-bold">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {storeddata.length ? (
              storeddata.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="text-secondary">{item.name}</TableCell>
                  <TableCell className="text-secondary">
                    {item.partnumber}
                  </TableCell>
                  <TableCell className="text-secondary">
                    {item.location}
                  </TableCell>
                  <TableCell className="text-secondary">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="text-secondary">
                     <DeleteButton item={item}/>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="text-secondary">No data</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
const handleDelete = async(id:any)=> {
  try{
    const response = await fetch(`http://localhost:8000/api/v1/stock/deleteopenbalance/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to deleting measurement")
    }
    toast.success(
          "Success! Openbalance Item deleted.",
        )
  }catch(error){
    toast.error(
      `Failed to delete openbalance item, Error: ${error}`
   )
  }
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
            user?.role === 'admin' ? (<DropdownMenuContent align="end">
              <DropdownMenuItem className="text-red-500" onClick={()=>handleDelete(item.id)}><Trash className="text-red-500 mr-2" /> Delete</DropdownMenuItem>
              </DropdownMenuContent>): (<></>)
          }
      </DropdownMenu>
  )
}
export default BalancesPage;
