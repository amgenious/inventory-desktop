"use client"
import React,{useState} from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { IconFileExcel } from '@tabler/icons-react'
import { Loader2 } from 'lucide-react'
import axios from 'axios'

const UploadstockcsvPage = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
      const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e:any) => {
        const selected = e.target.files[0];
        if (selected && selected.name.endsWith('.xlsx')) {
          setFile(selected);
          setMessage("");
        } else {
          setMessage("Only .xlsx files are allowed");
        }
      };
      const handleUpload = async () => {
        setIsSubmitting(true)
        if (!file) return setMessage("Please select a valid file");
    
        const formData = new FormData();
        formData.append("file", file);
    
        try {
          const res = await axios.post('http://localhost:8000/api/v1/stock/add-stockxlsx', formData)
        toast.success(
            "Success! New Stock has been created.",
         )

        } catch (err) {
          console.error(err);
          toast.error(
            `Failed to create new stock, Error: ${err}`
         )
          setMessage("Error uploading file");
        }finally{
            setIsSubmitting(false)
        }
      };
  return (
    <Dialog>
    <DialogTrigger asChild>
      <Button variant="default"><IconFileExcel  className="w-6 mr-2"/> Upload XLSX (Excel)</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] md:max-w-[700px]">
      <DialogHeader>
        <DialogTitle>Upload CSV</DialogTitle>
        <DialogDescription>
          Add New Stock here by uploading an xlsx file
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4 py-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="name">
            Upload file
          </Label>
          <Input id="name" placeholder="Stock Name" 
          type="file" accept=".xlsx" onChange={handleChange}
          className="col-span-3" required/>
        </div>
        <p>{message}</p>
        </div>
      <DialogFooter>
        <Button type="submit" 
        onClick={handleUpload} disabled={!file}
        className="cursor-pointer">
        {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload file"
          )}
          </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}

export default UploadstockcsvPage