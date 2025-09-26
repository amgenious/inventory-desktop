"use client";
import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader, Loader2, Search } from "lucide-react";
import { Label } from "../ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAuth } from "@/hooks/use-auth"
import { PartNumberSelector } from "../shared/new-combobox";

const Receiptcorrection = () => {
  const { user } = useAuth()
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchedData, setSearchedData] = useState<any>([]);
  const [searchedDataOriginal, setSearchedDataOriginal] = useState<any>([]);
  const [searched, setSearched] = useState([]);
  const [newinvoicenumber, setNewinvoicenumber] = useState("");
  const [newsupplier, setNewsupplier] = useState("");
  const [newremarks, setNewremarks] = useState("");
  const [fetchedSupplier, setFetchedSupplier] = useState<any>([]);
  const [receipt, setReceipt] = useState<any>([]);
  const [fetching, setFetching] = useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [newvquantity, setNewquantity] = useState(0);

  const fetchItems = async () => {
    setFetching(true);

    const response1 = await fetch("http://localhost:8000/api/v1/supplier/");
    const data1 = await response1.json();
    setFetchedSupplier(data1.supplier);

    const response = await fetch("http://localhost:8000/api/v1/receipt/")
    const data = await response.json()
        const uniqueReceipt = Array.from(
  new Map(data.receipt.map((item: { referencenumber: any; }) => [item.referencenumber, item])).values()
);
    setReceipt(uniqueReceipt)
    setFetching(false);
  };

  async function onSubmit() {
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/receipt/search?query=${query}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to search the item");
      }
      const data = await response.json();
      setSearched(data);
      setSearchedDataOriginal(data.searchedReceipt);
      const uniqueHead = Array.from(new Map(data.searchedReceipt.map((item:{referencenumber:any})=>[
        item.referencenumber,
        item
      ])
    ).values()
  )
      setSearchedData(uniqueHead);
    } catch (error) {
      toast(`Failed to search. ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  }
  async function onUpdate(id: any,quant:any,name:any) {
    setIsUpdating(true);
    // let invoicenumber = newinvoicenumber || searchedData.invoicenumber;
    // let transtype = searchedData.transtype;
    // let transcode =  searchedData.transcode;
    // let supplier = newsupplier || searchedData.supplier;
    // let remarks = newremarks || searchedData.remarks;
    var quantity = newvquantity === 0 ? quant : newvquantity
    if(quantity !== 0){
      try {
        const response = await fetch(`http://localhost:8000/api/v1/receipt/update/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
          quantity
          }),
        });
        if (!response.ok) {
          const error = await response.json();
          toast.error(`Failed to update receipt: ${error}`);
          throw new Error(error.message || "Failed to create post");
        }
         const params = new URLSearchParams();
         if (name) params.append("name", name);
         const queryString = params.toString();
         const getiteminfo = await fetch(`http://localhost:8000/api/v1/stock/allstock/search?${queryString}`)
         const data = await getiteminfo.json()
         var dbquantity = data.searchedStock[0].quantity
     
        var newquantity = (dbquantity - quant) + newvquantity
        var historyoldquantity = dbquantity - quant
 await fetch(`http://localhost:8000/api/v1/stock/updateQuantity/${name}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newquantity }),
          })
         await fetch("http://localhost:8000/api/v1/stock/addStockhistory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name,
            prevQuantity: historyoldquantity,
            Issue: 0,
            Receipt: newvquantity,
            newQuantity: newquantity,
          }),
        })  
        toast.success("Success! receipt has been updated");
      } catch (error) {
        toast.error(`Failed to update receipt, Error ${error}`);
      } finally {
        setIsUpdating(false);
      }
    }else{
      toast.success("Success! Receipt has been updated");
    }
  }
  useEffect(() => {
    fetchItems();
  }, []);
  return (
    <>
      <h2 className="font-bold text-xl pb-3 pl-5 text-secondary">Receipt Correction</h2>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-center p-5 border-[1px] rounded-md w-full">
          <div className="flex gap-5 w-2/4">
          {
            fetching ? (<Loader className="h-4 w-full animate-spin text-center"/>):(
              <PartNumberSelector 
                  title={"Filter Receipt Reference Numbers"} 
                  fetchedItems={receipt}
                  handleSeletedItem={setQuery}   
              />
            )
          }
            <Button
              className="cursor-pointer"
              disabled={isSubmitting}
              onClick={onSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Searching...
                </>
              ) : (
                <>
                  <Search /> Search
                </>
              )}
            </Button>
          </div>
        </div>
        {searched && searchedData.length > 0 ? (
           searchedData.map((item: any, index: number) => (
          <div className="p-5 border-[1px] rounded-md w-full" key={index}>
            <div className="flex gap-10 w-full">
              <div className="flex gap-5 w-1/2">
                <Label className="text-black">Reference Number</Label>
                <Input
                  placeholder="ref.number"
                  defaultValue={item.referencenumber}
                  className="w-3/4 border-none dark:bg-white dark:text-black"
                  disabled
                />
              </div>
              <div className="flex gap-2 w-1/2">
                <Label className="text-black">Value Date</Label>
                <Input
                  placeholder="value date"
                  defaultValue={item.valuedate}
                  className="w-3/4 border-none dark:bg-white dark:text-black"
                  disabled
                />
              </div>
            </div>
            <div className="flex gap-10 w-full my-8">
              <div className="flex gap-5 w-1/2">
                <Label className="text-black">Invoice Number</Label>
                <Input
                  placeholder="invoice number"
                  defaultValue={item.invoicenumber}
                  className="w-3/4 border-none dark:bg-white dark:text-black"
                  onChange={(e) => setNewinvoicenumber(e.target.value)}
                  disabled
                />
              </div>
              <div className="flex gap-2 w-1/2">
                <Label className="text-black">Invoice Date</Label>
                <Input
                  placeholder="Invoice date"
                  defaultValue={item.invoicedate}
                  className="w-3/4 border-none dark:bg-white dark:text-black"
                  disabled
                />
              </div>
            </div>
            <div className="flex gap-10 w-full my-8">
              <div className="flex gap-5 w-1/2">
                <Label className="text-black">Trans Type</Label>
                <Input
                  placeholder="Trans Type"
                  className="w-3/4 border-none dark:bg-white dark:text-black"
                  defaultValue={item.transtype}
                  disabled
                />
              </div>
              <div className="flex gap-2 w-1/2">
                <Label className="text-black">Trans Code</Label>
                <Input
                  placeholder="Trans Code"
                  className="w-3/4 border-none dark:bg-white dark:text-black"
                  defaultValue={item.transcode}
                  disabled
                />
              </div>
            </div>
            <div className="flex gap-10 w-full my-8">
              <div className="flex gap-5 w-1/2">
                <Label className="text-black">Supplier</Label>
                  <Input
                    placeholder={item.supplier}
                    defaultValue={item.supplier}
                    className="w-3/4 border-none dark:bg-white dark:text-black"
                    disabled
                  />
{/* 
                {fetching ? (
                  <Loader className="h-4 w-full animate-spin text-center" />
                ) : (
                  <Select
                    onValueChange={setNewsupplier}
                    value={newsupplier}
                    defaultValue={item.supplier}
                  >
                    <SelectTrigger id="supplier" className="w-full border-none placeholder:text-black dark:bg-white dark:text-black">
                      <SelectValue placeholder="Select Supplier" />
                    </SelectTrigger>
                    <SelectContent className="border-none dark:bg-white dark:text-black">
                      {fetchedSupplier.map((item: any, index: number) => (
                        <SelectItem value={item.name} key={index}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                 */}
              </div>
              <div className="flex gap-2 w-1/2">
                <Label className="text-black">Remarks</Label>
                <Input
                  placeholder="Remarks"
                  className="w-3/4 border-none dark:bg-white dark:text-black"
                  defaultValue={item.remarks}
                  onChange={(e) => setNewremarks(e.target.value)}
                  disabled
                />
              </div>
            </div>
            <div className="my-10 flex gap-10 w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-black">Item Name</TableHead>
                    <TableHead className="text-black">Part Number</TableHead>
                    <TableHead className="text-black">Location</TableHead>
                    <TableHead className="text-black">Quantity</TableHead>
                    <TableHead className="text-black">New Quantity</TableHead>
                    <TableHead className="text-black"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    searchedDataOriginal.length ? (
                      searchedDataOriginal.map((item:any,index:React.Key)=>(
                  <TableRow key={index}>
                    <TableCell className="text-muted">
                      {item.itemname}
                    </TableCell>
                    <TableCell className="text-muted">
                      {item.partnumber}
                    </TableCell>
                    <TableCell className="text-muted">
                      {item.location}
                    </TableCell>
                    <TableCell className="text-muted">
                        <Input
                          placeholder="quantity"
                          type="number"
                          value={item.quantity}
                          className="w-3/4 border-none dark:bg-white dark:text-black"
                          disabled
                        />
                    </TableCell>
                    <TableCell className="text-muted">
                        <Input
                          placeholder="New Quantity"
                          type="number"
                          className="w-3/4 border-none dark:bg-white dark:text-black"
                          onChange={(e)=>setNewquantity(+e.target.value)}
                        />
                    </TableCell>
                    <TableCell>
                    {
                      user?.role === 'admin' &&  <Button
                      className="cursor-pointer"
                      disabled={isUpdating}
                      onClick={()=>onUpdate(item.id,item.quantity,item.itemname)}
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
                  }
                    </TableCell>
                  </TableRow>
                      ))
                    ) : (
                      <p>No Items Found</p>
                    )
                  }
                </TableBody>
              </Table>
            </div>
          </div>
        ))) : (
          <div className=" w-full text-center italic text-secondary">
            <p>Search for a Receipt</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Receiptcorrection;
