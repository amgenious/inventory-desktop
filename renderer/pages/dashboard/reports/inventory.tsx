"use client"
import Layout from '../layout'
import  React,{useState, useEffect} from "react";
import { Input } from "@/components/ui/input";
import { File, Loader2, Search,} from "lucide-react";
import { Button } from "@/components/ui/button";


import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from 'sonner'
import { Label } from '@/components/ui/label';


const InventoryPage = () => {
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState<any>();
    const [endDate, setEndDate] = useState<any>();
    const [partnumber, setPartnumber] = useState("");
    const [location, setLocation] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [filteredData, setFilteredData] = useState<any>([]);

    const [fetchedLocations, setFetchedLocations] = useState([])
    const [fetchedCategory, setFetchedCategory] = useState([])
    const [fetching, setFetching] = useState(false)

    let downloaddata: any;
    const fetchParams = async () => {
      setFetching(true)

      const response = await fetch("http://localhost:8000/api/v1/location/")
      const data = await response.json()
      setFetchedLocations(data.location)

      const response1 = await fetch("http://localhost:8000/api/v1/category/")
      const data1 = await response1.json()
      setFetchedCategory(data1.categories)

      setFetching(false)
    }
        async function onSubmit(){
      setIsSubmitting(true)
      const params = new URLSearchParams();
      if (name) params.append("name", name);
  if (partnumber) params.append("partnumber", partnumber);
  if (location) params.append("location", location);
  if (startDate) params.append("startDate",startDate.split("T")[0]);
  if (endDate) params.append("endDate",endDate.split("T")[0]);

  const queryString = params.toString();
      try{
          const response = await fetch(`http://localhost:8000/api/v1/stock/search?${queryString}`)
          if (!response.ok) {
              const error = await response.json()
              toast.error(`Failed to search, ${error}`)
              throw new Error(error.message || "Failed to search the item")
            }
          const data = await response.json()
          toast.success("Done with the search")
          setFilteredData(data.searchedStock)
      }catch(error){
          toast.error(`Failed to search. ${error}`)
      }finally{
          setIsSubmitting(false)
      }
   }
  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Invalid date"; // optional guard
    return date.toUTCString(); // or use toLocaleString() for local format
  };
  downloaddata = filteredData
  const prefix = Math.random().toString();
  const newT = prefix.slice(14,18)
  const downloadCSV = (data: any[], filename = `stock-report-${newT}.csv`) => {
    const headers = [
      "Date",
      "Name",
      "Location",
      "Part Number",
      "Quantity",
    ];
  
    const rows = data.map(item => [
      new Date(item.createdAt).toLocaleDateString(), // format date if needed
      item.name,
      item.location,
      item.partnumber,
      item.quantity,
    ]);
  
    const csvContent =
      [headers, ...rows]
        .map(row => row.map(value => `"${value}"`).join(","))
        .join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };
  
    useEffect(() => {
      fetchParams()
      }, []);  
  return (
    <Layout>
    <div className='flex justify-between w-full pb-5'>
        <h2 className='text-xl font-bold text-black'>Stock Report</h2>
    </div>
    <div className="w-full flex justify-between py-5 hide-on-print">
        <div className="flex gap-4">
        <Input placeholder="Stock Name" className="w-fit border-none dark:bg-white dark:text-black" 
            onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Part Number" className="w-fit border-none dark:bg-white dark:text-black" 
            onChange={(e) => setPartnumber(e.target.value)} />  
        {
            fetching ? (
              <Loader2  className="h-4 w-full animate-spin text-center"/>
            ):(
          <Select onValueChange={setLocation} value={location}>
                  <SelectTrigger id="location" className="border-none dark:bg-white dark:text-black">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className='border-none dark:bg-white dark:text-black'>
                  {
                    fetchedLocations.map((item: any, index: number) => (
                      <SelectItem value={item.name} key={index}>
                        {item.name}
                      </SelectItem>
                    ))}
                </SelectContent>
          </Select>
            )
          } 
          <div>
            <Label className="text-muted py-1">Start Date</Label>
            <Input type="date" className="border-none dark:bg-slate-400 dark:text-black"
            onChange={(e)=> setStartDate(e.target.value)}
            />  
            </div> 
            <div>
            <Label className="text-muted py-1">End Date</Label>
            <Input type="date" className="border-none dark:bg-slate-400 dark:text-black"
            onChange={(e)=> setEndDate(e.target.value)}
            />  
            </div> 
        </div>
        <Button variant="default" disabled={isSubmitting} onClick={onSubmit} className="cursor-pointer">
          {
            isSubmitting ? (
              <>
                <Loader2  className='h-4 w-4 animate-spin'/> Searching...
              </>
              ):(
              <>
                <Search/> Search
              </>
               )
         }
          </Button>
      </div>
        <div className="overflow-hidden rounded-lg border">
          <div className="flex w-full p-2 justify-between items-center">
            <div>
              <h2 className="font-bold text-lg text-secondary">Searched Results</h2>
            </div>
            <Button className="flex gap-2 cursor-pointer" onClick={()=>downloadCSV(downloaddata)}><File /> Download CSV</Button>
          </div>
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Part Number</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length ? (
              filteredData.map((item:any) => (
                <TableRow key={item.id}>
                  <TableCell className='text-muted'>{formatDate(item.createdAt)}</TableCell>
                  <TableCell className='text-muted'>{item.name}</TableCell>
                  <TableCell className='text-muted'>{item.location}</TableCell>
                  <TableCell className='text-muted'>{item.partnumber}</TableCell>
                  <TableCell className='text-muted'>{item.quantity}</TableCell>
                </TableRow>
              ))
            ) : (
              
              <TableRow className="text-center p-5 text-secondary">
                  <TableCell>No results found.</TableCell>
                </TableRow>
            )}
            </TableBody>
          </Table>
      </div>

    </Layout>
  )
}

export default InventoryPage