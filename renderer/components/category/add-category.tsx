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
import { Textarea } from "../ui/textarea"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function AddCategory() {
    const [name, setCatergoryName] = useState("")
    const [description, setDescription] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    async function onSubmit() {
      setIsSubmitting(true)
      
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
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="name">
              Category Name
            </Label>
            <Input id="name" placeholder="Category Name" onChange={(e) => setCatergoryName(e.target.value)} className="col-span-3" />
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="description">
                Description
            </Label>
            <Textarea id="description" placeholder="Description" onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
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
