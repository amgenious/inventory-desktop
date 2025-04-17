"use client"
import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
export default function HomePage() {
    const { login, isAuthenticated,user } = useAuth()
    return (
        <React.Fragment>
            <Head>
                <title>Inventory Management System</title>
                <link rel="icon" type="image/svg+xml" href="/images/logo.png" />
            </Head>

            <div className="relative flex min-h-screen flex-col">
                <div className="w-full h-screen flex flex-col items-center justify-center px-4">
                    <div className="flex-1 flex flex-col justify-center items-center w-full space-y-8">
                        <div className=" flex flex-col justify-center items-center gap-5">
                            <Image src={'/images/logo.png'} alt="logo" width={200} height={200}/>
                           <h1 className="text-3xl font-bold">Welcome to Inventory Management System</h1>
                        </div>
                        <div className="w-full flex-wrap flex justify-center gap-5">
                            {
                                isAuthenticated ? (<Link href="/dashboard/dashboard-home" className={buttonVariants()}>
                                Dashboard
                            </Link>) : (  <Link href="/signin" className={buttonVariants()}>
                                Sign In
                            </Link>)
                            }
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
