"use client"
import React,{useState} from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import {z} from "zod"
import { toast } from "sonner"
import { Loader2 } from 'lucide-react'
import { useAuth } from "@/hooks/use-auth";
import {useRouter} from "next/navigation"

const Updatepassword = () => {
    const { user,logout } = useAuth();
    const router = useRouter();
    const [newpassword, setNewpassword] = useState("")
    const [confirmpassword, setConfirmpassword] = useState("")
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false)
    const passwordSchema = z.object({
        newpassword:z.string().min(5,"New password length should be greater than 5"),
        confirmpassword: z.string().min(5,"Confirm password should be greater than 5")
    })
    async function onSubmit(){
        setIsSubmitting(true)
        const result = passwordSchema.safeParse({
            newpassword:newpassword,
            confirmpassword:confirmpassword
        })
        if(!result.success){
            setError(
                result.error.format().newpassword?._errors[0] ||
                result.error.format().confirmpassword?._errors[0] ||
                "Invalid Input"
            )
            setIsSubmitting(false)
            return false
        }
        if (confirmpassword !== newpassword){  
            toast.error("New Password is not the same as Confirm Password")
            setError("New Password is not the same as Confirm Password")
            setIsSubmitting(false)
            return false
        }
        try{
             let pass = confirmpassword
            const response = await fetch(`http://localhost:8000/api/v1/user/updatepassword/${user.id}`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({pass})
            })
             if (!response.ok) {
                      const error = await response.json()
                      toast.error(`Failed to change password: ${error}`)
                      setIsSubmitting(false)
                      return false
                    //   throw new Error(error.message || "Failed to change password")
                    }
                    toast.success(
                      "Success! User Password Updated",)
                logout()
                router.push("/signin")
        }catch(err){
            console.log(err)
            toast.error(`Error: ${err}`)
        }finally{
            setIsSubmitting(false)
        }
    }
  return (
    <div className='space-y-6'>
        <header>
           <h3 className="mb-0.5 text-base font-medium dark:text-secondary">Update password</h3>
           <p className="dark:text-muted text-sm">Ensure your account is using a long, random password to stay secure</p>
           </header>
           <form  className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password" className='text-black'>New password</Label>
                            <Input
                                id="password"
                                onChange={(e) => setNewpassword(e.target.value)}
                                type="password"
                                className="mt-1 block w-full border-none dark:bg-white dark:text-black"
                                autoComplete="new-password"
                                placeholder="New password"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className='text-black'>Confirm password</Label>
                            <Input
                                id="password_confirmation"
                                onChange={(e) => setConfirmpassword( e.target.value)}
                                type="password"
                                className="mt-1 block w-full border-none dark:bg-white dark:text-black"
                                autoComplete="new-password"
                                placeholder="Confirm password"
                            />
                        </div>
                         {error && <p className="text-red-500 text-sm col-span-3 col-start-2 text-center">{error}</p>}
                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={isSubmitting} onClick={onSubmit}>
                                {
                                    isSubmitting ? (
                                        <>
                                            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                                            Submitting....
                                        </>
                                    ):(
                                        "Save password"
                                    )
                                }
                            </Button>
                        </div>
                    </form>
    </div>
  )
}

export default Updatepassword