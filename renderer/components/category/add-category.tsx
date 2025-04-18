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
import { Loader2, PlusCircle } from "lucide-react"
import { useState } from "react"
import { Textarea } from "../ui/textarea"

import { toast } from "sonner"
import {z} from "zod"
export function AddCategory() {
    const [name, setCatergoryName] = useState("")
    const [error, setError] = useState("");
    const [description, setDescription] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
         const categorySchema = z.object({
              name: z.string().min(1, "Measurement name cannot be empty"),
              description: z.string().min(5, "Measurement description cannot be empty"),
            });
    async function onSubmit() {
      setIsSubmitting(true)
      const result = categorySchema.safeParse({ name: name,description:description });

      if (!result.success) {
        setError(result.error.format().name?._errors[0] || result.error.format().description?._errors[0] || "Invalid input");
        setIsSubmitting(false)
        return;
      }
      
      try {
        const response = await fetch("http://localhost:8000/api/v1/category/add-category", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({name,description}),
        })
  
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || "Failed to create category")
        }
  
        toast.success(
           "Success! Category has been created.",
        )
      } catch (error) {
        toast.error(
           `Failed to create category, Error: ${error}`
        )
      } finally {
        setIsSubmitting(false)
      }
    }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default"><PlusCircle className="w-6 mr-2"/> Add Category</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>
            Add New Category here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="name">
              Category Name
            </Label>
            <Input id="name" placeholder="Category Name" onChange={(e) => setCatergoryName(e.target.value)} className="col-span-3" required/>
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="description">
                Description
            </Label>
            <Textarea id="description" placeholder="Description" onChange={(e) => setDescription(e.target.value)} className="col-span-3" required/>
          </div>
          {error && <p className="text-red-500 text-sm col-span-3 col-start-2 text-center">{error}</p>}
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting} onClick={onSubmit} className="cursor-pointer">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            "Add Category"
          )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
