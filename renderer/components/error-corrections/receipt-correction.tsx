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

const Receiptcorrection = () => {
  const { user } = useAuth()
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchedData, setSearchedData] = useState<any>([]);
  const [searched, setSearched] = useState("");
  const [newinvoicenumber, setNewinvoicenumber] = useState("");
  const [newtranstype, setNewtranstype] = useState("");
  const [newtranscode, setNewtranscode] = useState("");
  const [newsupplier, setNewsupplier] = useState("");
  const [newremarks, setNewremarks] = useState("");
  const [fetchedSupplier, setFetchedSupplier] = useState<any>([]);
  const [receipt, setReceipt] = useState<any>([]);
  const [fetching, setFetching] = useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const fetchItems = async () => {
    setFetching(true);

    const response1 = await fetch("http://localhost:8000/api/v1/supplier/");
    const data1 = await response1.json();
    setFetchedSupplier(data1.supplier);

    const response = await fetch("http://localhost:8000/api/v1/receipt/")
    const data = await response.json()
    setReceipt(data.receipt)
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
      setSearchedData(data.searchedReceipt);
    } catch (error) {
      toast(`Failed to search. ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  }
  async function onUpdate() {
    setIsUpdating(true);
    let invoicenumber = newinvoicenumber || searchedData.invoicenumber;
    let transtype = searchedData.transtype;
    let transcode =  searchedData.transcode;
    let supplier = newsupplier || searchedData.supplier;
    let remarks = newremarks || searchedData.remarks;
    try {
      const response = await fetch(`http://localhost:8000/api/v1/receipt/update/${searchedData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoicenumber,
          transtype,
          transcode,
          supplier,
          remarks,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        toast.error(`Failed to update receipt: ${error}`);
        throw new Error(error.message || "Failed to create post");
      }
      toast.success("Success! receipt has been updated");
    } catch (error) {
      toast.error(`Failed to update receipt, Error ${error}`);
    } finally {
      setIsUpdating(false);
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
              <Select onValueChange={setQuery}>
                <SelectTrigger className="max-w-sm border-none placeholder:text-black dark:bg-white dark:text-black">
                  <SelectValue placeholder="Select Receipt Referencenumber"/>
                </SelectTrigger>
                <SelectContent>
                  {
                    receipt.map((item:any, index:number) => (
                      <SelectItem value={item.referencenumber} key={index}>
                        {item.referencenumber}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
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
        {searched ? (
          <div className="p-5 border-[1px] rounded-md w-full">
            <div className="flex gap-10 w-full">
              <div className="flex gap-5 w-1/2">
                <Label className="text-black">Reference Number</Label>
                <Input
                  placeholder="ref.number"
                  defaultValue={searchedData.referencenumber}
                  className="w-3/4 border-none dark:bg-white dark:text-black"
                  disabled
                />
              </div>
              <div className="flex gap-2 w-1/2">
                <Label className="text-black">Value Date</Label>
                <Input
                  placeholder="value date"
                  defaultValue={searchedData.valuedate}
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
                  defaultValue={searchedData.invoicenumber}
                  className="w-3/4 border-none dark:bg-white dark:text-black"
                  onChange={(e) => setNewinvoicenumber(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-1/2">
                <Label className="text-black">Invoice Date</Label>
                <Input
                  placeholder="Invoice date"
                  defaultValue={searchedData.invoicedate}
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
                  defaultValue={searchedData.transtype}
                  disabled
                />
              </div>
              <div className="flex gap-2 w-1/2">
                <Label className="text-black">Trans Code</Label>
                <Input
                  placeholder="Trans Code"
                  className="w-3/4 border-none dark:bg-white dark:text-black"
                  defaultValue={searchedData.transcode}
                  disabled
                />
              </div>
            </div>
            <div className="flex gap-10 w-full my-8">
              <div className="flex gap-5 w-1/2">
                <Label className="text-black">Supplier</Label>
                {fetching ? (
                  <Loader className="h-4 w-full animate-spin text-center" />
                ) : (
                  <Select
                    onValueChange={setNewsupplier}
                    value={newsupplier}
                    defaultValue={searchedData.supplier}
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
              </div>
              <div className="flex gap-2 w-1/2">
                <Label className="text-black">Remarks</Label>
                <Input
                  placeholder="Remarks"
                  className="w-3/4 border-none dark:bg-white dark:text-black"
                  defaultValue={searchedData.remarks}
                  onChange={(e) => setNewremarks(e.target.value)}
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-muted">
                      {searchedData.itemname}
                    </TableCell>
                    <TableCell className="text-muted">
                      {searchedData.partnumber}
                    </TableCell>
                    <TableCell className="text-muted">
                      {searchedData.location}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="flex justify-center items-center gap-2 w-1/2">
                <Label className="text-black">Quantity</Label>
                <Input
                  placeholder="quantity"
                  type="number"
                  value={searchedData.quantity}
                  className="w-3/4 border-none dark:bg-white dark:text-black"
                  disabled
                />
              </div>
            </div>
            {
              user?.role === 'admin' &&  <Button
              className="cursor-pointer"
              disabled={isUpdating}
              onClick={onUpdate}
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

          </div>
        ) : (
          <div className=" w-full text-center italic">
            <p>Search for a Receipt</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Receiptcorrection;
