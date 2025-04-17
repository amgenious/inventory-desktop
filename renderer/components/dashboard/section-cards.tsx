"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Package, PackageOpen, Receipt } from "lucide-react"
import { useState, useEffect } from "react"
import { Skeleton } from "../ui/skeleton"


export function SectionCards() {
  const [fetching, setFetching] = useState(true)
  const [fetchedStock, setFetchedStock] = useState([])
  const [fetchedIssues, setFetchedIssues] = useState<any>([])
  const [fetchedReceipts, setFetchedReceipts] = useState([])

  const fetchParams = async () =>{
    setFetching(true)
    
    const response = await fetch('/api/issues')
    const data = await response.json()
    setFetchedIssues(data.issues.length)

    const response1 = await fetch('/api/stock')
    const data1 = await response1.json()
    setFetchedStock(data1.stocks.length)

    const response2 = await fetch('/api/receipt')
    const data2 = await response2.json()
    setFetchedReceipts(data2.receipts.length)

    setFetching(false)
  }
  useEffect(()=>{
    fetchParams()
  },[])
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Card className="@container/card">
          <CardContent className="flex items-center gap-4">
          <div className="bg-amber-50 p-3 rounded-full">
            <Package className="h-6 w-6 text-amber-500" />
          </div>
          <div>
          <CardDescription>Inventory Items</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {
            fetching ? (
              <Skeleton className="h-10 w-32 mt-2 bg-gray-400!"/>
            ):(
              <>
              {fetchedIssues}
              </>
            )
          }
          </CardTitle>
          </div>
          </CardContent>
        
      </Card>
      <Card className="@container/card">
        <CardContent className="flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-full">
          <PackageOpen className="h-6 w-6 text-blue-500" />
          </div>
          <div>
          <CardDescription>Total Issues</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {
            fetching ? (
              <Skeleton className="h-10 w-32 mt-2 bg-gray-400!"/>
            ):(
              <>
              {fetchedStock} 
              </>
            )
          }
          </CardTitle>
          </div>
        </CardContent>
      </Card>
      <Card className="@container/card">
        <CardContent className="flex items-center gap-4">
        <div className="bg-red-50 p-3 rounded-full">
            <Receipt className="h-6 w-6 text-red-500" />
          </div>
          <div>
          <CardDescription>Total Receipts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {
            fetching ? (
              <Skeleton className="h-10 w-32 mt-2 bg-gray-400!"/>
            ):(
              <>
              {fetchedReceipts}
              </>
            )
          }
          </CardTitle>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
