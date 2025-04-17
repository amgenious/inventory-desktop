"use client"

import type React from "react"

import { createContext, useEffect, useState } from "react"
import { setCookie, deleteCookie } from "@/lib/cookies"

type User = {
  id: string
  name: string
  email: string
  role:string
}

type AuthContextType = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load auth state from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
      setIsAuthenticated(true)
    }

    setIsLoading(false)
  }, [])

  const login = (userData: User, authToken: string) => {
    // Save to state
    setUser(userData)
    setToken(authToken)
    setIsAuthenticated(true)

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", authToken)

    // Save to cookies for middleware
    setCookie("auth-token", authToken, 7) // 7 days expiry
  }

  const logout = () => {
    // Clear state
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)

    // Clear localStorage
    localStorage.removeItem("user")
    localStorage.removeItem("token")

    // Clear cookies
    deleteCookie("auth-token")
  }

  // Don't render children until we've checked localStorage
  if (isLoading) {
    return null
  }

  return <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

