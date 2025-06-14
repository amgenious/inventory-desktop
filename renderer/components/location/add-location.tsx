"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, PlusCircle, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { z } from "zod";

export function Addlocation() {
    const [openModal, setOpenModal] = useState(false)
    const [name, setLocationName] = useState("")
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false)
    const locationSchema = z.object({
      name: z.string().min(1, "Location name cannot be empty"),
    });
const handleOpenModal = () =>{
  setOpenModal(true)
}
const handleCloseModal = () =>{
  setOpenModal(false)
}
    async function onSubmit() {
      setIsSubmitting(true)
      const result = locationSchema.safeParse({ name: name });

      if (!result.success) {
        setError(result.error.format().name?._errors[0] || "Invalid input");
        setIsSubmitting(false)
        return;
      }
      
      try {
        const response = await fetch("http://localhost:8000/api/v1/location/add-location", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({name}),
        })
  
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || "Failed to create post")
        }
  
        toast.success(
           "Success! Location has been created",
        )
        setOpenModal(false)
      } catch (error) {
        toast.error(
           `Failed to create location, Error ${error}`,
        )
      } finally {
        setIsSubmitting(false)
      }
    }
  return (
    <>
    <div>
       <Button variant="default" onClick={handleOpenModal}><PlusCircle className="w-6 mr-2"/> Add Location</Button>
    </div>
    {
      openModal ? (<div className="w-full h-screen flex justify-center items-center fade-in-0 fixed inset-0 z-50 bg-black/50">
       <div className="w-[50%] bg-background rounded-lg border p-6 shadow-lg">
       <section className="mb-5">
        <div className="flex justify-between">
           <header>Add Location</header>
           <X  onClick={handleCloseModal} className="cursor-pointer"/>
        </div>
           <p className="text-sm">
             Add New Locations here. Click save when you're done.
           </p>
         </section>
         <div className="flex flex-col gap-4 py-4">
           <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="name" className="text-right">
               Location Name
             </Label>
             <Input id="name" placeholder="Location Name" onChange={(e) => setLocationName(e.target.value)} className="col-span-3" required/>
           </div>
           {error && <p className="text-red-500 text-sm col-span-3 col-start-2 text-center">{error}</p>}
         </div>
         <section className="flex flex-col">
         <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting} onClick={onSubmit}>
           {isSubmitting ? (
             <>
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               Adding...
             </>
           ) : (
             "Add Location"
           )}
         </Button>
         </section>
       </div>
    </div>): (<></>)
    }
    
    </>
  )
}
