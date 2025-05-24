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
import { Loader, Loader2, PlusCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { z } from "zod"

const issueSchema = z.object({
  referencenumber: z.string().min(1, "Reference Number cannot be empty"),
  valuedate: z.string().min(1, "Date cannot be empty"),
  transtype: z.string().min(1, "Transtype cannot be empty"),
  transcode: z.string().min(1, "Trans code cannot be empty"),
  customer: z.string().min(1, "Customer cannot be empty"),
  remarks: z.string().min(1, "Remarks cannot be empty"),
  itemname: z.string().min(1, "Item Name cannot be empty"),
  partnumber: z.string().min(1, "Part number cannot be empty"),
  location: z.string().min(1, "Location cannot be empty"),
  quantity: z.number().positive("Quantity should be a positive number"),
})

const AddIssues = () => {
  const [referencenumber, setReferenceNumber] = useState("")
  const [customer, setCustomer] = useState("")
  const [remarks, setRemarks] = useState("")
  const [issueItems, setIssueItems] = useState([
    {
      itemid: "",
      itemname: "",
      partnumber: "",
      location: "",
      quantity: 0,
      oldquantity: 0,
    },
  ])
  const [fetchedItems, setFetchedItems] = useState([])
  const [fetchedCustomer, setFetchedCustomer] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState("")

  const today = new Date().toLocaleDateString("en-GB")
  const newT = Math.random().toString().slice(2, 5)

  const fetchItems = async () => {
    setFetching(true)
    const itemsRes = await fetch("http://localhost:8000/api/v1/stock/getAllOpenBalance/")
    const itemsData = await itemsRes.json()
    setFetchedItems(itemsData.openbalance)

    const customerRes = await fetch("http://localhost:8000/api/v1/customer/")
    const customerData = await customerRes.json()
    setFetchedCustomer(customerData.customer)
    setFetching(false)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleItemChange = (index, itemId) => {
    const selectedItem = fetchedItems.find((itm) => itm.id == itemId)
    if (!selectedItem) return
    const updated = [...issueItems]
    updated[index] = {
      ...updated[index],
      itemid: selectedItem.id,
      itemname: selectedItem.name,
      partnumber: selectedItem.partnumber,
      location: selectedItem.location,
      oldquantity: selectedItem.quantity,
    }
    setIssueItems(updated)
  }

  const handleItemQuantityChange = (index, value) => {
    const updated = [...issueItems]
    updated[index].quantity = Number(value)
    setIssueItems(updated)
  }

  const addNewItem = () => {
    setIssueItems([
      ...issueItems,
      { itemid: "", itemname: "", partnumber: "", location: "", quantity: 0, oldquantity: 0 },
    ])
  }

  const removeItem = (index) => {
    const updated = issueItems.filter((_, i) => i !== index)
    setIssueItems(updated)
  }

  const onSubmit = async () => {
    setIsSubmitting(true)
    setError("")
    const transtype = "I"
    const transcode = `I${newT}`

    for (let item of issueItems) {
      const result = issueSchema.safeParse({
        referencenumber,
        valuedate: today,
        transtype,
        transcode,
        customer,
        remarks,
        itemname: item.itemname,
        partnumber: item.partnumber,
        location: item.location,
        quantity: item.quantity,
      })

      if (!result.success) {
        setError("Validation failed for one or more items.")
        setIsSubmitting(false)
        return
      }
    }

    try {
      for (let item of issueItems) {
        const newquantity = item.oldquantity - item.quantity

        await fetch("http://localhost:8000/api/v1/issue/add-issue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            referencenumber,
            valuedate: today,
            transtype,
            transcode,
            customer,
            remarks,
            itemname: item.itemname,
            partnumber: item.partnumber,
            location: item.location,
            quantity: item.quantity,
          }),
        })

        await fetch(`http://localhost:8000/api/v1/stock/updateQuantity/${item.itemname}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newquantity }),
        })

        await fetch("http://localhost:8000/api/v1/stock/addStockhistory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: item.itemname,
            prevQuantity: item.oldquantity,
            addedQuantity: item.quantity,
            newQuantity: newquantity,
          }),
        })
      }
      toast.success("Success! All issues created.")
    } catch (e) {
      toast.error(`Error while submitting: ${e}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusCircle className="w-6 mr-2" /> Add Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Add Issue</DialogTitle>
          <DialogDescription>Add new issues with one or more items.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="referencenumber" className="text-right">
              Reference Number
            </Label>
            <Input
              id="referencenumber"
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer" className="text-right">
              Customer
            </Label>
            {fetching ? (
              <Loader className="h-4 w-full animate-spin text-center" />
            ) : (
              <Select onValueChange={setCustomer} value={customer}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Customer" />
                </SelectTrigger>
                <SelectContent>
                  {fetchedCustomer.map((c, idx) => (
                    <SelectItem key={idx} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="remarks" className="text-right">
              Remarks
            </Label>
            <Input
              id="remarks"
              onChange={(e) => setRemarks(e.target.value)}
              className="col-span-3"
            />
          </div>

          {issueItems.map((item, index) => (
            <div key={index} className="grid grid-cols-6 gap-2 items-center">
              <select
                className="col-span-2 border rounded px-2 py-1"
                value={item.itemid}
                onChange={(e) => handleItemChange(index, e.target.value)}
              >
                <option value="">Select Item</option>
                {fetchedItems.map((itm) => (
                  <option key={itm.id} value={itm.id}>
                    {itm.name}
                  </option>
                ))}
              </select>
              <Input value={item.partnumber} disabled className="col-span-1" />
              <Input value={item.location} disabled className="col-span-1" />
              <Input
                type="number"
                className="col-span-1"
                value={item.quantity}
                onChange={(e) => handleItemQuantityChange(index, e.target.value)}
              />
              {issueItems.length > 1 && (
                <Button variant="ghost" onClick={() => removeItem(index)}>
                  Remove
                </Button>
              )}
            </div>
          ))}

          <Button type="button" onClick={addNewItem} className="w-fit mt-2">
            + Add Another Item
          </Button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting} onClick={onSubmit}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddIssues
