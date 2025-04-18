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
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { z } from "zod";

const Addmeasurement = () => {
    const [name, setMeasurementName] = useState("")
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false)
     const measurementSchema = z.object({
          name: z.string().min(1, "Measurement name cannot be empty"),
        });
    const router = useRouter()
        async function onSubmit() {
          setIsSubmitting(true)
          const result = measurementSchema.safeParse({ name: name });

          if (!result.success) {
            setError(result.error.format().name?._errors[0] || "Invalid input");
            setIsSubmitting(false)
            return;
          }
          try {
            const response = await fetch("http://localhost:8000/api/v1/measurement/add-measurement", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({name}),
            })
      
            if (!response.ok) {
              const error = await response.json()
              throw new Error(error.message || "Failed to create measurement")
            }
      
            toast.success(
               "Success! Measurement has been added.",
            )
            router.push('/dashboard/staticdata')
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
      <Button variant="default"><PlusCircle className="w-6 mr-2"/> Add Measurement</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add Measurement</DialogTitle>
        <DialogDescription>
          Add New Measurements here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4 py-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="name">
            Measurement Name
          </Label>
          <Input id="name" placeholder="Measurement Name" onChange={(e) => setMeasurementName(e.target.value)} className="col-span-3" required/>
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
            "Add Measurement"
          )}
          </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}

export default Addmeasurement