"use client"
import Layout from '../layout'
import  React,{useState, useEffect} from "react";
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button";
import { File, Loader2, Search } from 'lucide-react'
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from 'sonner'
import { Skeleton } from "@/components/ui/skeleton";
import { IconPdf } from "@tabler/icons-react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import { Label } from '@/components/ui/label';

const ReceiptReport = () => {
  const [referencenumber, setReferencenumber] = useState("");
      const [startDate, setStartDate] = useState<any>();
      const [endDate, setEndDate] = useState<any>();
      const [supplier, setSupplier] = useState("");
      const [partnumber, setPartnumber] = useState("");
      const [invoicenumber, setInvoicenumber] = useState("");
      const [isSubmitting, setIsSubmitting] = useState(false)
      const [filteredData, setFilteredData] = useState<any>([]);
  
      const [fetchedSupplier, setFetchedSupplier] = useState([])
      const [fetching, setFetching] = useState(false)
      let downloaddata: any;
      const fetchParams = async () => {
        setFetching(true)
  
        const response = await fetch("http://localhost:8000/api/v1/supplier/")
        const data = await response.json()
        setFetchedSupplier(data.supplier)
  
        setFetching(false)
      }
  const formatDate = (timestamp: string): string => {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return "Invalid date"; // optional guard
        return date.toUTCString(); // or use toLocaleString() for local format
      };
      async function onSubmit(){
          setIsSubmitting(true)
          const params = new URLSearchParams();
          if (referencenumber) params.append("referencenumber", referencenumber);
          if (partnumber) params.append("partnumber", partnumber);
          if (invoicenumber) params.append("invoicenumber",invoicenumber);
          if (supplier) params.append("supplier", supplier);
          if (startDate) params.append("startDate",startDate.split("T")[0]);
          if (endDate) params.append("endDate",endDate.split("T")[0]);
    
      const queryString = params.toString();
          try{
              const response = await fetch(`http://localhost:8000/api/v1/receipt/search/report?${queryString}`)
              if (!response.ok) {
                  const error = await response.json()
                  toast.error(`Failed to search, ${error}`)
                  throw new Error(error.message || "Failed to search the item")
                }
              const data = await response.json()
              toast.success("Done with the search")
              setFilteredData(data.searchedReceipt)
          }catch(error){
              toast.error(`Failed to search. ${error}`)
          }finally{
              setIsSubmitting(false)
          }
       } 
  downloaddata = filteredData
       const prefix = Math.random().toString();
       const newT = prefix.slice(14,18)
       const downloadCSV = (data: any[], filename = `receipt-report-${newT}.csv`) => {
         const headers = [
           "Date",
           "Reference Number",
           "Value Date",
           "Invoice Number",
           "Invoice Date",
           "Trans Type",
           "Trans Code",
           "Supplier",
           "Item",
           "Part Number",
           "Location",
           "Quantity",
         ];
       
         const rows = data.map(item => [
           new Date(item.createdAt).toLocaleDateString(), // format date if needed
           item.referencenumber,
           item.valuedate,
           item.invoicenumber,
           item.invoicedate,
           item.transtype,
           item.transcode,
           item.supplier,
           item.itemname,
           item.partnumber,
           item.location,
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
       const downloadPDF = (data: any[], filename = `receipt-report-${newT}.pdf`) => {
        const doc = new jsPDF();
         const headers = [
           ["Date",
           "Reference Number",
           "Value Date",
           "Invoice Number",
           "Invoice Date",
           "Trans Type",
           "Trans Code",
           "Supplier",
           "Item",
           "Part Number",
           "Location",
           "Quantity",]
         ];
       
         const rows = data.map(item => [
           new Date(item.createdAt).toLocaleDateString(), 
           item.referencenumber,
           item.valuedate,
           item.invoicenumber,
           item.invoicedate,
           item.transtype,
           item.transcode,
           item.supplier,
           item.itemname,
           item.partnumber,
           item.location,
           item.quantity,
         ]);
       
  autoTable(doc, {
    head: headers,
    body: rows,
  });

  doc.save(filename);
       }; 
    useEffect(()=>{
      fetchParams()
    },[])
  return (
    <Layout>
    <div className='flex justify-between w-full pb-5'>
        <h2 className='text-xl font-bold text-black'>Receipts Report</h2>
    </div> 
     <div className="w-full flex justify-between py-5 hide-on-print">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
        <Input placeholder="Reference Number" className="w-fit border-none dark:bg-white dark:text-black" 
            onChange={(e) => setReferencenumber(e.target.value)} />
        <Input placeholder="Part Number" className="w-fit border-none dark:bg-white dark:text-black" 
            onChange={(e) => setPartnumber(e.target.value)} />
        <Input placeholder="Invoice Number" type="number" className="w-fit border-none dark:bg-white dark:text-black" 
            onChange={(e) => setInvoicenumber(e.target.value)} />
        {
          fetching ? (
            <Skeleton className="h-10 w-36 bg-gray-200!"/>
          ):(
            <Select onValueChange={setSupplier} value={supplier}>
                  <SelectTrigger id="supplier" className="border-none dark:bg-white dark:text-black">
                    <SelectValue placeholder="Select Supplier" />
                  </SelectTrigger>
                  <SelectContent className='border-none dark:bg-white dark:text-black'>
                  {
                    fetchedSupplier.map((item: any, index: number) => (
                      <SelectItem value={item.name} key={index}>
                        {item.name}
                      </SelectItem>
                    ))}
                </SelectContent>
          </Select>
            )
          }  
        </div>
        <div className="flex gap-4">
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
        <Button variant="default" disabled={isSubmitting} onClick={onSubmit}  className="cursor-pointer">
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
                  <div className="flex gap-5">
                  <Button type="submit"  className="cursor-pointer hide-on-print" onClick={() => downloadPDF(downloaddata)}><IconPdf/> Download PDF</Button>
                  <Button className="flex gap-2 cursor-pointer hide-on-print"  onClick={()=>downloadCSV(downloaddata)}><File /> Download CSV</Button>
                   </div>
                </div>
              <Table>
                <TableHeader className="bg-muted sticky top-0 z-10">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Reference Number</TableHead>
                    <TableHead>Value Date</TableHead>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Invoice Date</TableHead>
                    <TableHead>Trans Type</TableHead>
                    <TableHead>Trans Code</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Part No.</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length ? (
                    filteredData.map((item:any) => (
                      <TableRow key={item.id}>
                        <TableCell className='text-muted'>{formatDate(item.createdAt)}</TableCell>
                        <TableCell className='text-muted'>{item.referencenumber}</TableCell>
                        <TableCell className='text-muted'>{item.valuedate}</TableCell>
                        <TableCell className='text-muted'>{item.invoicenumber}</TableCell>
                        <TableCell className='text-muted'>{item.invoicedate}</TableCell>
                        <TableCell className='text-muted'>{item.transtype}</TableCell>
                        <TableCell className='text-muted'>{item.transcode}</TableCell>
                        <TableCell className='text-muted'>{item.supplier}</TableCell>
                        <TableCell className='text-muted'>{item.itemname}</TableCell>
                        <TableCell className='text-muted'>{item.partnumber}</TableCell>
                        <TableCell className='text-muted'>{item.location}</TableCell>
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

export default ReceiptReport