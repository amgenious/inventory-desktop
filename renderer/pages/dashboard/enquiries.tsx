"use client"    
import  React,{useState, useEffect} from "react";
import { Input } from "@/components/ui/input";
import { File, Loader2, Search,} from "lucide-react";
import { Button } from "@/components/ui/button";
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from 'sonner'

import Layout from './layout'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IconPdf } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";

const EnquiriesReportPage = () => {
        const [name, setName] = useState("");
        const [startDate, setStartDate] = useState<any>();
        const [category, setCategory] = useState("");
        const [endDate, setEndDate] = useState<any>();
        const [partnumber, setPartnumber] = useState("");
        const [location, setLocation] = useState("");
        const [description, setDescription] = useState("");
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
  if (category) params.append("category", category)
  if (description) params.append("description",description);
  if (startDate) params.append("startDate",startDate.split("T")[0]);
  if (endDate) params.append("endDate",endDate.split("T")[0]);

  const queryString = params.toString();
      try{
          const response = await fetch(`http://localhost:8000/api/v1/stock/allstock/search?${queryString}`)
          if (!response.ok) {
              const error = await response.json()
              toast.error(`Failed to search, ${error.message}`)
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
      "Category",
      "Location",
      "Measurement",
      "Part Number",
      "Mx. Stock",
      "Mn. Stock",
      "Quantity",
      "Price",
    ];
  
    const rows = data.map(item => [
      new Date(item.createdAt).toLocaleDateString(), // format date if needed
      item.name,
      item.category,
      item.location,
      item.measurement,
      item.partnumber,
      item.max_stock,
      item.min_stock,
      item.quantity,
      item.price,
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
        <h2 className='text-xl font-bold text-black'>Enquiry</h2>
    </div>
    <div className="w-full flex justify-between py-5 hide-on-print">
      <div>
        <div className="flex gap-4">
        <Input placeholder="Stock Name" className="w-fit border-none dark:bg-white dark:text-black" 
            onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Part Number" className="w-fit border-none dark:bg-white dark:text-black" 
            onChange={(e) => setPartnumber(e.target.value)} />
        <Input placeholder="Description" className="w-fit border-none dark:bg-white dark:text-black" 
            onChange={(e) => setDescription(e.target.value)} />
        {
            fetching ? (
              <Loader2  className="h-4 w-full animate-spin text-center"/>
            ):(
          <Select onValueChange={setLocation} value={location} defaultValue="">
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
           {
            fetching ? (
              <Loader2  className="h-4 w-full animate-spin text-center"/>
            ):(
          <Select onValueChange={setCategory} value={category} defaultValue="">
                  <SelectTrigger id="category" className="border-none dark:bg-white dark:text-black">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className='border-none dark:bg-white dark:text-black'>
                  {
                    fetchedCategory.map((item: any, index: number) => (
                        <>
                      <SelectItem value={item.name} key={index}>
                        {item.name}
                      </SelectItem>
                        </>
                    ))}
                </SelectContent>
          </Select>
            )
          }
          </div>
          <div className="mt-2 flex gap-5"> 
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
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Measurement</TableHead>
              <TableHead>Part Number</TableHead>
              <TableHead>Mx. Stock</TableHead>
              <TableHead>Mn. Stock</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length ? (
              filteredData.map((item:any) => (
                <TableRow key={item.id}>
                  <TableCell className='text-muted'>{formatDate(item.createdAt)}</TableCell>
                  <TableCell>
                    <DetailsViewer item={item}/>
                  </TableCell>
                  <TableCell className='text-muted'>{item.category}</TableCell>
                  <TableCell className='text-muted'>{item.location}</TableCell>
                  <TableCell className='text-muted'>{item.measurement}</TableCell>
                  <TableCell className='text-muted'>{item.partnumber}</TableCell>
                  <TableCell className='text-muted'>{item.max_stock}</TableCell>
                  <TableCell className='text-muted'>{item.min_stock}</TableCell>
                  <TableCell className='text-muted'>{item.quantity}</TableCell>
                  <TableCell className='text-muted'>{item.price}</TableCell>
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
function DetailsViewer({item}:{item:any}){
  const [searchedIssuename,setSearchedIssueName] = useState<any>([])
  const [searchedReceiptname,setSearchedReceiptName] = useState<any>([])
  const [searchedStockhistory,setSearchedStockhistory] = useState<any>([])
  const [detailsSearch, setDetailsSearch] = useState(true)
  const fetchNewParams = async () => {
    setDetailsSearch(true)
    let itemname = item.name
    const params = new URLSearchParams();
    if (itemname) params.append("itemname", itemname);
    const queryString = params.toString();

    const response = await fetch(`http://localhost:8000/api/v1/issue/search/report?${queryString}`)
    const data = await response.json()
    console.log("Searhed Issue", data.searchedIssue)
    setSearchedIssueName(data.searchedIssue)

    if (itemname) params.append("name", itemname);
    const queryString1 = params.toString();
    const response2 = await fetch(`http://localhost:8000/api/v1/stock/allstockhistory/search?${queryString1}`)
    const data2 = await response2.json()
      console.log("Searhed Stock history", data2.searchedStockHistory)
    setSearchedStockhistory(data2.searchedStockHistory)
    
    setDetailsSearch(false)
  }
  const fetchReceipt = async(itemname:string)=>{
    const params = new URLSearchParams();
    if (itemname) params.append("itemname", itemname);
    const queryString = params.toString();

    const response1 = await fetch(`http://localhost:8000/api/v1/receipt/search/report?${queryString}`)
    const data1 = await response1.json()
      console.log("Searhed Receipt", data1.searchedReceipt)
    setSearchedReceiptName(data1.searchedReceipt)
  }
  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Invalid date"; 
    return date.toUTCString(); 
  };
  useEffect(()=>{
    fetchNewParams()
    fetchReceipt(`${item.name}`)
  },[])
return(
  <Dialog >
      <DialogTrigger asChild>
        <p className="cursor-pointer text-muted">{item.name}</p>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[1050px] max-h-fit">
        <DialogHeader>
          <DialogTitle>Details of {item.name}</DialogTitle>
          <DialogDescription>
            Click download PDF to save locally.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full p-4 border rounded-lg">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead>Last Updated</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Measurement</TableHead>
              <TableHead>Part Number</TableHead>
              <TableHead>Mx. Stock</TableHead>
              <TableHead>Mn. Stock</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
                <TableRow key={item.id}>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.measurement}</TableCell>
                  <TableCell>{item.partnumber}</TableCell>
                  <TableCell>{item.max_stock}</TableCell>
                  <TableCell>{item.min_stock}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.price}</TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </div>
         {
          detailsSearch ? (
            <Loader2 className="w-full h-4 animate-spin"/>
          ):(
        <>
        <div className="w-full p-4 border rounded-lg">
          <p className="font-semibold py-2">Transactions Made</p>
          <div className="w-full py-2">
            <p className="py-1">Issues Made</p>
            <div>
            <Table>
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead>Reference Number</TableHead>
            <TableHead>Value Date</TableHead>
            <TableHead>Trans Code</TableHead>
            <TableHead>Trans Type</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Remarks</TableHead>
            <TableHead>Quantity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {searchedIssuename.length ? (
            searchedIssuename.map((item:any) => (
              <TableRow key={item.id}>
                <TableCell>{item.referencenumber}</TableCell>
                <TableCell>{item.valuedate}</TableCell>
                <TableCell>{item.transcode}</TableCell>
                <TableCell>{item.transtype}</TableCell>
                <TableCell>{item.customer}</TableCell>
                <TableCell>{item.remarks}</TableCell>
                <TableCell>{item.quantity}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="text-center p-5">
                <TableCell>No issues found.</TableCell>
              </TableRow>
          )}
          </TableBody>
        </Table>
            </div>
          </div>
          <div className="w-full py-2">
            <p className="py-1">Receipts Made</p>
            <div>
            <Table>
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead>Reference Number</TableHead>
            <TableHead>Value Date</TableHead>
            <TableHead>Invoice Number</TableHead>
            <TableHead>Invoice Date</TableHead>
            <TableHead>Trans Code</TableHead>
            <TableHead>Trans Type</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Remarks</TableHead>
            <TableHead>Quantity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {searchedReceiptname.length ? (
            searchedReceiptname.map((item:any) => (
              <TableRow key={item.id}>
                <TableCell>{item.referencenumber}</TableCell>
                <TableCell>{item.valuedate}</TableCell>
                <TableCell>{item.invoicenumber}</TableCell>
                <TableCell>{item.invoicedate}</TableCell>
                <TableCell>{item.transcode}</TableCell>
                <TableCell>{item.transtype}</TableCell>
                <TableCell>{item.supplier}</TableCell>
                <TableCell>{item.remarks}</TableCell>
                <TableCell>{item.quantity}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="text-center p-5">
                <TableCell>No receipt found.</TableCell>
              </TableRow>
          )}
          </TableBody>
        </Table>
            </div>
          </div>
        </div>

        <div className="w-full py-2">
           <p className="py-1">Stock History</p>
           <div>
             <Table>
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Previous Quantity</TableHead>
            <TableHead>Added/Subtracted Quantity</TableHead>
            <TableHead>New Quantity</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {searchedStockhistory.length ? (
            searchedStockhistory.map((item:any) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.prevQuantity}</TableCell>
                <TableCell>{item.addedQuantity}</TableCell>
                <TableCell>{item.newQuantity}</TableCell>
                <TableCell>{item.createdAt}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="text-center p-5">
                <TableCell>No stock history found.</TableCell>
              </TableRow>
          )}
          </TableBody>
        </Table>
           </div>
        </div>
        </>
          )
        } 
        <DialogFooter>
          <Button type="submit" className="cursor-pointer hide-on-print" onClick={() => window.print()}><IconPdf /> Download PDF</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
)
}

export default EnquiriesReportPage