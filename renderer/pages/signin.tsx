import React from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState,useEffect } from "react"
import { toast } from "sonner"
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";

export default function AboutPage() {
    const [email,setEmail] = useState("")
    const [password,setPassowrd] = useState("")
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter();
    const searchParams = useSearchParams()
    const { login, isAuthenticated,user } = useAuth()
    const authSchema = z.object({
      email: z.string().email(),
      password: z.string().min(5, { message: "Must be 5 or more characters long" })
    });

    const redirectPath = searchParams.get("from") || "/dashboard/dashboard-home"

    useEffect(() => {
      if (isAuthenticated) {
        router.push(redirectPath)
      }
    }, [isAuthenticated, router, redirectPath])

    async function onSubmit(){
        setIsSubmitting(true)
        const result = authSchema.safeParse({ email: email,password:password });

        if (!result.success) {
          setError(result.error.format().email?._errors[0] || result.error.format().password?._errors[0] || "Invalid input");
          setIsSubmitting(false)
          return;
        }
        try{
        const response = await fetch("http://localhost:8000/api/v1/auth/signin",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({email,password})
        })
        if(!response.ok){
            const error = await response.json()
            toast.error(`Error signing in: ${error} `) 
        }else{
            const data = await response.json();
            login(data.userInfo,data.token)
            router.push("/dashboard/dashboard-home");
        }
        }catch(error){
            toast.error(`Failed to sign in: ${error}`)
        }finally{
        setIsSubmitting(false)
        }
    }
    if (!isAuthenticated){

    return (
        <React.Fragment>
            <Head>
                <title>Inventory Management System - Signin</title>
            </Head>

            <div className="relative flex min-h-screen flex-col bg-gradient-to-r from-violet-200 to-blue-200">
                <div className="w-full h-screen flex flex-col items-center justify-center px-4">
                    <div className="flex-1 flex flex-col justify-center items-center w-full space-y-8">
                    <div className="flex flex-col gap-6 bg-gray-100 p-5 rounded-sm">
    <form>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <a
            href="#"
            className="flex flex-col items-center gap-2 font-medium"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md">
               <Image src={'/images/logo.png'} alt="logo" width={80} height={80}/>
            </div>
          </a>
          <h1 className="text-xl font-bold text-secondary">Inventory Management System</h1>
        </div>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-secondary">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(e)=> setEmail(e.target.value)}
              className="border-none dark:bg-white placeholder:text-black dark:text-black"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-secondary">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="****"
              required
              onChange={(e)=> setPassowrd(e.target.value)}
              className="border-none dark:bg-white placeholder:text-black dark:text-black"
            />
          </div>
          {error && <p className="text-red-500 text-sm col-span-3 col-start-2 text-center">{error}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting} onClick={onSubmit}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Siging In...
            </>
          ) : (
            "Sign In"
          )}
          </Button>
        </div>
        
      </div>
    </form>
    <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
      By clicking sign in, you agree to our <a href="#">Terms of Service</a>{" "}
      and <a href="#">Privacy Policy</a>.
    </div>
    <Link href={'/home'} className="text-secondary">Home</Link>
  </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
  }
  return (
    <React.Fragment></React.Fragment>
  )
}
