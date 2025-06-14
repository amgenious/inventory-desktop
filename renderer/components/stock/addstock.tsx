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
import { useState,useEffect } from "react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import {z} from "zod"

const Addstock = () => {
    const [openModal, setOpenModal] = useState(false)
    const [name, setInventoryName] = useState("")
    const [partnumber, setPartnumber] = useState("")
    const [location, setLocation] = useState("")
    const [measurement, setMeasurement] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [max_stock, setMaxinstock] = useState(0)
    const [min_stock, setMininstock] = useState(0)
    const [price, setPrice] = useState(0)
    const [error, setError] = useState("");

    const stockSchema = z.object({
      name: z.string().min(1, "Stock name cannot be empty"),
      description: z.string().min(5, "Stock description cannot be empty"),
      location: z.string().min(1, "Stock location cannot be empty"),
      category: z.string().min(5, "Stock category cannot be empty"),
      partnumber: z.string().min(1, "Stock partnumber cannot be empty"),
    });
    const handleOpenModal = () =>{
       setOpenModal(true)
    }
    const handleCloseModal = () =>{
      setOpenModal(false)
    } 
    const [fetchedLocations, setFetchedLocations] = useState([])
    const [fetchedCategory, setFetchedCategory] = useState([])
    const [fetchedMeasurement, setFetchedMeasurement] = useState([])

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [fetching, setFetching] = useState(false)

    const fetchParams = async () => {
      setFetching(true)

      const response = await fetch("http://localhost:8000/api/v1/location")
      const data = await response.json()
      setFetchedLocations(data.location)

      const response1 = await fetch("http://localhost:8000/api/v1/category")
      const data1 = await response1.json()
      setFetchedCategory(data1.categories)

      const response2 = await fetch("http://localhost:8000/api/v1/measurement")
      const data2 = await response2.json()
      setFetchedMeasurement(data2.measurement)

      setFetching(false)
    }
     async function onSubmit() {
          setIsSubmitting(true)
          
          const result = stockSchema.safeParse(
            { name: name,
              description:description,
              category:category,
              location:location,
              partnumber:partnumber,
              max_stock:max_stock,
              min_stock:min_stock,
              price:price
            });

          if (!result.success) {
            setError(
              result.error.format().name?._errors[0] || 
              result.error.format().description?._errors[0] || 
              result.error.format().category?._errors[0] || 
              result.error.format().location?._errors[0] || 
              result.error.format().partnumber?._errors[0] || 
              "Invalid input");
            setIsSubmitting(false)
            return;
          }

          try {
            const response = await fetch("http://localhost:8000/api/v1/stock/add-stock", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({name,description,category,location,measurement,partnumber,max_stock,min_stock,price}),
            })
      
            if (!response.ok) {
              const error = await response.json()
              throw new Error(error.message || "Failed to create new stock")
            }
      
            toast.success(
               "Success! New Stock has been created.",
            )
            setOpenModal(false)
          } catch (error) {
            toast.error(
               `Failed to create new stock, Error: ${error}`
            )
          } finally {
            setIsSubmitting(false)
          }
        }
        useEffect(() => {
          fetchParams()
        }, [])
  return (
    <>
    <Button variant="default" onClick={handleOpenModal}><PlusCircle  className="w-6 mr-2"/> Add Stock</Button>
    {
      openModal ? (
        <div className="w-full h-screen flex justify-center items-center fade-in-0 fixed inset-0 z-50 bg-black/50">
          <div className="w-[50%] bg-background rounded-lg border p-6 shadow-lg">
      <section>
        <div className="flex justify-between">
        <header>Add Stock</header>
        <X className="cursor-pointer" onClick={handleCloseModal}/>
        </div>
        <p className="text-sm">
          Add New Stock here. Click save when you're done.
        </p>
      </section>
      <div className="flex flex-col gap-4 py-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="name">
            Stock Name
          </Label>
          <Input id="name" placeholder="Stock Name" onChange={(e) => setInventoryName(e.target.value)} className="col-span-3" required/>
        </div>
        <div className="flex items-center gap-4">
          <Label htmlFor="partnumber">
              Part Number
          </Label>
          <Input id="partnumber" placeholder="Part Number" onChange={(e) => setPartnumber(e.target.value)} className="col-span-3" required/>
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <div className="flex gap-4">
          <Label htmlFor="location">
              Location
          </Label>
          {
            fetching ? (
              <Loader2  className="h-4 w-full animate-spin text-center"/>
            ):(
          <Select onValueChange={setLocation} value={location}>
                  <SelectTrigger id="location" className="w-full">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                  {
                    fetchedLocations.map((item: any, index: number) => (
                      <SelectItem value={item.name} key={index}>
                        {item.name}
                      </SelectItem>
                    ))}
                </SelectContent>
          </Select>
            )
          }
          </div>
          <div className="flex gap-4">
          <Label htmlFor="Measurement">
              Measurement
          </Label>
          {
            fetching ? (
              <Loader2  className="h-4 w-full animate-spin text-center"/>
            ):(
          <Select onValueChange={setMeasurement} value={measurement}>
                  <SelectTrigger id="measurement" className="w-full">
                    <SelectValue placeholder="Select Measurement" />
                  </SelectTrigger>
                  <SelectContent>
                  {
                    fetchedMeasurement.map((item: any, index: number) => (
                      <SelectItem value={item.name} key={index}>
                        {item.name}
                      </SelectItem>
                    ))}
                </SelectContent>
          </Select>
            )
          }
          </div>
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
            <div className="flex gap-4">
          <Label htmlFor="description" className="text-right">
              Description
          </Label>
          <Input id="description" placeholder="Description" type="text" onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
            </div>
            <div className="flex gap-4">
          <Label htmlFor="category" className="text-right">
              Category
          </Label>
          {
            fetching ? (
              <Loader2  className="h-4 w-full animate-spin text-center"/>
            ):(
          <Select onValueChange={setCategory} value={category}>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                  {
                    fetchedCategory.map((item: any, index: number) => (
                      <SelectItem value={item.name} key={index}>
                        {item.name}
                      </SelectItem>
                    ))}
                </SelectContent>
          </Select>
            )
          }
            </div>
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
            <div className="flex gap-4">
          <Label htmlFor="maxinstock" className="text-right">
              Max. in Stock
          </Label>
          <Input id="maxinstock" placeholder="Max in stock" type="number" onChange={(e) => setMaxinstock(+e.target.value)} className="col-span-3" />
            </div>
            <div className="flex gap-4">
          <Label htmlFor="mininstock" className="text-right">
              Min. in stock
          </Label>
          <Input id="mininstock" placeholder="Min in stock" type="number" onChange={(e) => setMininstock(+e.target.value)} className="col-span-3" />
            </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right">
              Price
          </Label>
          <Input id="price" placeholder="Price" type="number" onChange={(e) => setPrice(+e.target.value)} className="col-span-3" />           
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
            "Add Stock"
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

export default Addstock