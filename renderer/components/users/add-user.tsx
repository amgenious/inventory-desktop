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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

const Adduser = () => {
  const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [pass, setPassword] = useState("")
    const [role, setRole] = useState("")

    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    async function onSubmit() {
      setIsSubmitting(true)

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
        router.refresh()
      } catch (error) {
        toast.error(
           `Failed to create new user, Error: ${error}`
        )
      } finally {
        setIsSubmitting(false)
      }
    }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default"><PlusCircle className="w-6 mr-2" /> Add User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Add New User here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
            </div>
        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default Adduser