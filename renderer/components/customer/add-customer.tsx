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
import { Loader2, Plus } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const Addcustomer = () => {
     const [name, setName] = useState("")
            const [email, setEmail] = useState("")
            const [contact, setContact] = useState("")
            const [address, setAddress] = useState("")
        
            const [isSubmitting, setIsSubmitting] = useState(false)
            const router = useRouter()
    
                async function onSubmit() {
                  setIsSubmitting(true)
            
                  try {
                    const response = await fetch("/api/customer", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({name,email,contact,address}),
                    })
              
                    if (!response.ok) {
                      const error = await response.json()
                      throw new Error(error.message || "Failed to create new customer")
                    }
              
                    toast.success(
                       "Success! New customer has been created.",
                    )
                    router.refresh()
                  } catch (error) {
                    toast.error(
                       `Failed to create new customer, Error: ${error}`
                    )
                  } finally {
                    setIsSubmitting(false)
                  }
                }
  return (
    <Dialog>
    <DialogTrigger asChild>
      <Button variant="default"><Plus /> Add Customer</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add Customer</DialogTitle>
        <DialogDescription>
          Add New Customer here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="name">
            Customer Name
          </Label>
          <Input id="name" placeholder="Name" onChange={(e) => setName(e.target.value)} className="col-span-3" required/>
        </div>
        <div className="flex items-center gap-4">
          <Label htmlFor="email">
            Email
          </Label>
          <Input id="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
        </div>
        <div className="flex items-center gap-4">
          <Label htmlFor="contact">
            Contact
          </Label>
          <Input id="contact" placeholder="Contact" onChange={(e) => setContact(e.target.value)} className="col-span-3" required/>
        </div>
        <div className="flex items-center gap-4">
          <Label htmlFor="address">
            Address
          </Label>
          <Input id="address" placeholder="Address" onChange={(e) => setAddress(e.target.value)} className="col-span-3" required/>
        </div>
          </div>
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting} onClick={onSubmit}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          "Add Customer"
        )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}

export default Addcustomer