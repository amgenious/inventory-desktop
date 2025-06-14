"use client"
import React, { ReactNode } from 'react';
import { Toaster } from "@/components/ui/sonner";
import Newsidebar from '@/components/new-dash/newside-bar';
import Head from "next/head";
import { ModeToggle } from '@/components/mode-toggle';
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AuthProvider } from '@/store/auth-provider';

export default function Layout({ children }: { children: React.ReactNode }) {

  const searchParams = useSearchParams()
  const { user, isAuthenticated, logout } = useAuth()
  const redirectPath = searchParams.get("from") || "/signin"
  const router = useRouter()

  useEffect(()=>{
    if(!isAuthenticated){
      router.push(redirectPath)
    }
  },[])
  if (!isAuthenticated) {
    return (
      <React.Fragment></React.Fragment>
    )
  }
    return (
      <React.Fragment>
       <Head>
          <title>Inventory Management System</title>
        </Head>
      <div className="flex h-screen">
        <Newsidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-purple-950 shadow p-2 flex justify-between items-center">
          <h1 className="text-md font-semibold text-white">Inventory Management System</h1>
           {/* <ModeToggle /> */}
        </header>

        {/* Content */}
        <main className="p-4 lg:p-6 bg-gradient-to-r from-violet-200 to-blue-200 flex-1 overflow-y-auto">
          <AuthProvider>
          {children}
          <Toaster richColors position='top-center'/>
          </AuthProvider>
        </main>
      </div>
    </div>
      </React.Fragment>
    );
}

