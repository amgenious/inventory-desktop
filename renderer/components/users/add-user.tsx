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
import { Loader2, PlusCircle, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import {z} from "zod"

const Adduser = () => {
    const [openModal, setOpenModal] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [pass, setPassword] = useState("")
    const [role, setRole] = useState("")
    const [error, setError] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false)
    const userSchema = z.object({
      name: z.string().min(1, "User name cannot be empty"),
      email: z.string().email( "User email cannot be empty"),
      pass: z.string().min(5, "User password cannot be empty"),
      role: z.string().min(1, "User role cannot be empty"),
    });    
    const handleOpenModal = () =>{
       setOpenModal(true)
    }
    const handleCloseModal = () =>{
      setOpenModal(false)
    }       
  
    async function onSubmit() {
      setIsSubmitting(true)
      const result = userSchema.safeParse({ name: name,email:email, pass:pass,role:role });

      if (!result.success) {
        setError(result.error.format().name?._errors[0] || result.error.format().email?._errors[0] ||  result.error.format().pass?._errors[0] ||  result.error.format().role?._errors[0] || "Invalid input");
        setIsSubmitting(false)
        return;
      }
      try {
        const response = await fetch("http://localhost:8000/api/v1/user/add-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({name,email,pass,role}),
        })
  
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || "Failed to create new user")
        }
  
        toast.success(
           "Success! New user has been created.",
        )
        setOpenModal(false)
      } catch (error) {
        toast.error(
           `Failed to create new user, Error: ${error}`
        )
      } finally {
        setIsSubmitting(false)
      }
    }
  return (
    <>
     <Button variant="default" onClick={handleOpenModal}><PlusCircle className="w-6 mr-2" /> Add User</Button>
     {
      openModal ? (
        <div className="w-full h-screen flex justify-center items-center fade-in-0 fixed inset-0 z-50 bg-black/50">
      <div className="w-[50%] bg-background rounded-lg border p-6 shadow-lg">
        <section>
          <div className="flex justify-between">
          <header>Add User</header>
          <X onClick={handleCloseModal} className="cursor-pointer"/>
          </div>
          <p className="text-sm">
            Add New User here. Click save when you're done.
          </p>
        </section>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="name">
              User Name
            </Label>
            <Input id="name" placeholder="Name" onChange={(e) => setName(e.target.value)} className="col-span-3" required/>
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="email">
              Email
            </Label>
            <Input id="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="col-span-3" required/>
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="email">
              Password
            </Label>
            <Input id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="col-span-3" required/>
          </div>
          <div className="flex flex-col gap-3">
                <Label htmlFor="status">Role</Label>
                <Select onValueChange={setRole} value={role}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {error && <p className="text-red-500 text-sm col-span-3 col-start-2 text-center">{error}</p>}
            </div>
        <section>
          <Button type="submit" disabled={isSubmitting} onClick={onSubmit} className="cursor-pointer">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            "Add User"
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

export default Adduser