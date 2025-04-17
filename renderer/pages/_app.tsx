import React from "react";
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";

import "../styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/store/auth-provider";
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
  });

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <AuthProvider>
            <Component {...pageProps}   className={poppins.className} />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default MyApp;
