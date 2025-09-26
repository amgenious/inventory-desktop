"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader, Loader2, Search } from "lucide-react";
import { Label } from "../ui/label";
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

const OpenBalanceCorrectionPage = () => {
    const { user } = useAuth()
    const [newquantity, setNewQuantity] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchedData, setSearchedData] = useState<any>([]);
    const [searched, setSearched] = useState("");
    const [query, setQuery] = useState("");
    const [fetching, setFetching] = useState(false);
    const [fetchedOpenbalance, setFetchedOpenBalance] = useState<any>([]);
      const [isUpdating, setIsUpdating] = React.useState(false);

  const fetchItems = async () => {
    setFetching(true);

    const response = await fetch("http://localhost:8000/api/v1/stock/getAllOpenBalance");
    const data = await response.json();
    setFetchedOpenBalance(data.openbalance);

    setFetching(false);
  };  
      async function onSubmit() {
        setIsSubmitting(true);
        try {
          const response = await fetch(`http://localhost:8000/api/v1/stock/search?partnumber=${query}`);
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to search the item");
          }
          const data = await response.json();
          setSearched(data);
          setSearchedData(data.searchedStock);
          console.log(data.searchedStock)
        } catch (error) {
          toast.error(`Failed to search. ${error}`);
        } finally {
          setIsSubmitting(false);
        }
      }
        async function onUpdate() {
          setIsUpdating(true);
          let location =  searchedData[0].location;
          let partnumber =  searchedData[0].partnumber;
          let name =  searchedData[0].name;
          let quantity = newquantity || searchedData[0].quantity;
          try {
            const response = await fetch(`http://localhost:8000/api/v1/stock/updateopenbalance/${searchedData[0].id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name, location,partnumber,quantity }),
            });
            if (!response.ok) {
              const error = await response.json();
              toast.error(`Failed to update issue: ${error}`);
              throw new Error(error.message || "Failed to create post");
            }
            toast.success("Success! issue has been updated");
          } catch (error) {
            toast.error(`Failed to update issue, Error ${error}`);
          } finally {
            setIsUpdating(false);
          }
        }
      useEffect(() => {
        fetchItems();
      }, []);    
  return (
    <>
      <h2 className="font-bold text-xl pb-3 pl-5 text-secondary">Open Balance Correction</h2>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-center p-5 border-[1px] rounded-md w-full">
          <div className="flex gap-5 w-2/4">
          {
            fetching ? (<Loader className="h-4 w-full animate-spin text-center"/>):
            (
              <PartNumberSelector 
              title={"Filter Part Number"}
              fetchedItems={fetchedOpenbalance}
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
                  <Search className="mr-2"/> Search
                </>
              )}
            </Button>
          </div>
        </div>
        {searched ? (
          <div className="p-5 border-[1px] rounded-md w-full">
             <div className="flex gap-10 w-full">
              <div className="flex gap-5 w-1/2">
                <Label className="text-black">Stock Name</Label>
                <Input
                  placeholder="ref.number"
                  value={searchedData[0].name}
                  className="w-3/4 border-none dark:bg-white dark:text-black"
                  disabled
                />
              </div>
              <div className="flex gap-2 w-1/2">
                <Label className="text-black">Location</Label>
                <Input
                  placeholder="value date"
                  value={searchedData[0].location}
                  className="w-3/4 border-none dark:bg-white dark:text-black"
                  disabled
                />
              </div>
            </div>
            <div className="flex gap-10 w-full my-8">
              <div className="flex gap-5 w-1/2">
                <Label className="text-black">Quantity</Label>
                <Input
                  placeholder="Trans Type"
                  className="w-3/4 border-none dark:bg-white dark:text-black"
                  defaultValue={searchedData[0].quantity}
                  onChange={(e) => setNewQuantity(+e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-1/2">
                <Label className="text-black">Part Number</Label>
                <Input
                  placeholder="Trans Code"
                  className="w-3/4 border-none dark:bg-white dark:text-black"
                  defaultValue={searchedData[0].partnumber}
                  disabled
                />
              </div>
            </div>
            {
              user?.role === 'admin' &&             <Button
              className="cursor-pointer"
              disabled={isUpdating}
              // onClick={onUpdate}
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
          <div className=" w-full text-center italic text-secondary">
            <p>Search for an issue</p>
          </div>
        )}
      </div>
    </>
  )
}

export default OpenBalanceCorrectionPage