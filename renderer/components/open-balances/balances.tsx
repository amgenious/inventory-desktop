"use client"
import React,{useState,useEffect} from 'react'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Loader, LoaderCircle, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from "sonner"
import {z} from "zod"

const BalancesPage = () => {
  const [fetching, setFetching] = useState(true)
  const [name, setItemname] = useState("")
  const [quantity, setQuantity] = useState(0)
  const [location, setLocation] = useState('')
  const [partnumber, setPartnumber] = useState('')
  const [fetchedItems, setItems] = useState<any>([])
  const [prestoreddata, setPreStoredData] = useState<any>([])
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false)

  const balanceSchema = z.object({
        name: z.string().min(1, "Stock name cannot be empty"),
        location: z.string().min(1, "Stock location cannot be empty"),
        partnumber: z.string().min(1, "Stock partnumber cannot be empty"),
        quantity: z.number().positive("Stock quantity should be positive"),
  });

  const fetchItems = async()=>{
    setFetching(true)
    const response = await fetch("http://localhost:8000/api/v1/stock/")
    const data = await response.json()
    setItems(data.stock)
    setFetching(false)
  }
  const addPreStoredData = async()=>{
    let prevQuantity = 0
    let addedQuantity = quantity
    let newQuantity = quantity
    setIsSubmitting(true)
    const result = balanceSchema.safeParse({name:name,location:location,partnumber:partnumber,quantity:quantity})
    if(!result.success){
        setError(result.error.format().name?._errors[0] || 
        result.error.format().location?._errors[0] || result.error.format().partnumber?._errors[0] 
    || result.error.format().quantity?._errors[0] || "invalid inputs")
    setIsSubmitting(false)
    return;
    }
    try{
        const response = await fetch("http://localhost:8000/api/v1/stock/addOpenbalance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({name,location,partnumber,quantity}),
        })
       const newres =  await fetch("http://localhost:8000/api/v1/stock/addStockhistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name,prevQuantity,addedQuantity,newQuantity}),
      })
        if (!response.ok) {
          const error = await response.json()
          toast.error(`${error.message}`)
          throw new Error(error.message)
        }
        if (!newres.ok) {
          const error = await newres.json()
          toast.error(`${error.message}`)
          throw new Error(error.message)
        }
  
        toast.success(
           "Success! New stock is opened.",
        )
    }catch(err){
         toast.error(
           `Failed to create an open stock, Error: ${err}`
        )
    }finally{
        setIsSubmitting(false)
    }
  }

  const handleItemChange = (e:any) => {
    const selectedId = e.target.value;
    const selectedItem = fetchedItems.find((item:any) => item.id == selectedId);
    if (selectedItem) {
      setItemname(selectedItem.name);
      setLocation(selectedItem.location); 
      setPartnumber(selectedItem.partnumber); 
    }
  };
  useEffect(() => {
    fetchItems()
  }, [])
  return (
    <div className='px-4 lg:px-6'>
      <div className='flex gap-5 justify-between py-5'>
      <div className='grid grid-cols-3'>
      {
        fetching ? (
          <LoaderCircle  className='h-5 w-full text-center animate-spin'/>
        ):(
          <>
          <div className="flex gap-4 flex-1/3">
    <Label htmlFor="item" className="text-right text-secondary">
      Item Name
    </Label>
    <select id="item" onChange={handleItemChange} className="col-span-3 border rounded px-2 py-1">
      <option value="">Select an item</option>
      {fetchedItems.map((item:any) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </select>
          </div>
          <div className="flex gap-4 flex-1/3">
    <Label htmlFor="quantity" className="text-right text-secondary">
      Quantity
    </Label>
    <Input
      id="quantity"
      placeholder="Quantity"
      type="number"
      value={quantity}
      onChange={(e) => setQuantity(+e.target.value)}
      className="col-span-3 border-none placeholder:text-black dark:bg-white dark:text-black"
    />
          </div>
           {error && <p className="text-red-500 text-sm col-span-3 col-start-2 text-center">{error}</p>}
          </>
          )
        }

        </div>
        <Button onClick={addPreStoredData} disabled={isSubmitting}>
        {
            isSubmitting ? (
                <Loader className='h-4 w-4 animate-spin'/>
            ):(
                "Save"
            )
        }
        </Button>
      </div>
      <Separator />
      <div className='py-5'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-secondary'>Stock</TableHead>
              <TableHead className='text-secondary'>Part Number</TableHead>
              <TableHead className='text-secondary'>Location</TableHead>
              <TableHead className='text-secondary'>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              prestoreddata.length ? (
                prestoreddata.map((item:any)=>(
                  <TableRow key={item.id}>
                    <TableCell className='text-secondary'>{item.itemname}</TableCell>
                    <TableCell className='text-secondary'>{item.partnumber}</TableCell>
                    <TableCell className='text-secondary'>{item.location}</TableCell>
                    <TableCell className='text-secondary'>{quantity}</TableCell>
                  </TableRow>
                ))
              ):(
                <TableRow>
                  <TableCell className='text-secondary'>No data</TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default BalancesPage