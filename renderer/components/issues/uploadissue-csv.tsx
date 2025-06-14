import React,{useState} from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { IconFileExcel } from '@tabler/icons-react'
import { Loader2, X } from 'lucide-react'
import axios from 'axios'

const UploadissuecsvPage = () => {
    const [openModal, setOpenModal] = useState(false)
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    const handleOpenModal = () =>{
        setOpenModal(true)
    }
    const handleCloseModal = () =>{
        setOpenModal(false)
    }
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
        const res = await axios.post('http://localhost:8000/api/v1/issue/add-issuexlsx', formData)
        toast.success(
            "Success! New Stock has been created.",
         )
         setOpenModal(false)
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
   <>
    <Button variant="default" onClick={handleOpenModal}><IconFileExcel  className="w-6 mr-2"/> Upload XLSX (Excel)</Button>
         {
           openModal ? (
         <div className="w-full h-screen flex justify-center items-center fade-in-0 fixed inset-0 z-50 bg-black/50">
           <div className="w-[50%] bg-background rounded-lg border p-6 shadow-lg">
         <section>
           <div className='flex justify-between'>  
           <header>Upload CSV</header>
           <X className='cursor-pointer' onClick={handleCloseModal}/>
           </div>
           <p className='text-sm'>
             Add New Issues here by uploading an xlsx file
           </p>
         </section>
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
         <section>
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
         </section>
       </div>
         </div>
           ):(<></>)
         }
   </>
  )
}

export default UploadissuecsvPage