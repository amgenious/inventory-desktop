"use client"
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
import { Loader2, Plus, PlusCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { z } from "zod";

export function Addlocation() {
    const [name, setLocationName] = useState("")
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false)
    const locationSchema = z.object({
      name: z.string().min(1, "Location name cannot be empty"),
    });

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
      } catch (error) {
        toast.error(
           `Failed to create location, Error ${error}`,
        )
      } finally {
        setIsSubmitting(false)
      }
    }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default"><PlusCircle className="w-6 mr-2"/> Add Location</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Location</DialogTitle>
          <DialogDescription>
            Add New Locations here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Location Name
            </Label>
            <Input id="name" placeholder="Location Name" onChange={(e) => setLocationName(e.target.value)} className="col-span-3" required/>
          </div>
          {error && <p className="text-red-500 text-sm col-span-3 col-start-2 text-center">{error}</p>}
        </div>
        <DialogFooter className="flex flex-col">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
