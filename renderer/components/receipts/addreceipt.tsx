"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Loader2, PlusCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {z} from "zod"
import { PartNumberSelector } from "../combobox";
  const receiptSchema = z.object({
    referencenumber:z.string().min(1, "Reference Number cannot be empty"),
    valuedate:z.string().min(1, "Date cannot be empty"),
    invoicenumber:z.string().min(1, "Invoice number cannot be empty"),
    invoicedate:z.string().min(1, "Invoice Date cannot be empty"),
    transtype:z.string().min(1, "Transtype cannot be empty"),
    transcode:z.string().min(1," Trans code cannot be empty"),
    supplier:z.string().min(1, "String cannot be empty"),
    remarks:z.string().min(1, "Remarks cannot be empty"),
    itemname:z.string().min(1, "Item Name cannot be empty"),
    partnumber:z.string().min(1, "Part number cannot be empty"),
    location:z.string().min(1, "Location cannot be empty"),
  })
const Addreceipt = () => {
  const [openModal, setOpenModal] = useState(false)
  const [referencenumber, setReferenceNumber] = useState("");
  const [invoicenumber, setInvoiceNumber] = useState("");
  const [invoicedate, setInvoiceDate] = useState("");
  const [supplier, setSupplier] = useState("");
  const [remarks, setRemarks] = useState("");
  const [receiptItems, setReceiptItems] = useState([
    {
      itemid: "",
      itemname: "",
      partnumber: "",
      location: "",
      quantity: 0,
      oldquantity: 0,
    },
  ])
  const [error, setError] = useState("");
  const [fetchedItems, setItems] = useState<any>([]);
  const [fetchedSupplier, setFetchedSupplier] = useState<any>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetching, setFetching] = useState(false);

  const today = new Date().toLocaleDateString("en-GB")
  const newT = Math.random().toString().slice(2, 5)

  const handleOpenModal = () =>{
    setOpenModal(true)
  }
  const handleCloseModal = () =>{
    setOpenModal(false)
  } 

  async function onSubmit() {
    setIsSubmitting(true);

    let transtype = "R";
    let transcode = `R${newT}`

    for (let item of receiptItems) {
      const result = receiptSchema.safeParse({
        referencenumber,
        valuedate: today,
        invoicedate,
        invoicenumber,
        transtype,
        transcode,
        supplier,
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
      for (let item of receiptItems) {
        const newquantity = item.oldquantity + item.quantity

        await fetch("http://localhost:8000/api/v1/receipt/add-receipt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            referencenumber,
            valuedate: today,
            invoicedate,
            invoicenumber,
            transtype,
            transcode,
            supplier,
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
            referencenumber,
            name: item.itemname,
            prevQuantity: item.oldquantity,
            Issue: 0,
            Receipt: item.quantity,
            newQuantity: newquantity,
          }),
        })
      }
      toast.success("Success! All Receipt created.")
      setOpenModal(false)
    } catch (e) {
      toast.error(`Error while submitting: ${e}`)
    } finally {
      setIsSubmitting(false)
    }
  }
  const fetchItems = async () => {
    setFetching(true);
    const response = await fetch("http://localhost:8000/api/v1/stock/stockwithbalance/");
    const data = await response.json();
    setItems(data.stock);

    const response1 = await fetch("http://localhost:8000/api/v1/supplier/");
    const data1 = await response1.json();
    setFetchedSupplier(data1.supplier);

    setFetching(false);
  };

    const handleItemChange = (index, itemId) => {
    const selectedItem = fetchedItems.find((itm) => itm.id == itemId)
    if (!selectedItem) return
    const updated = [...receiptItems]
    updated[index] = {
      ...updated[index],
      itemid: selectedItem.id,
      itemname: selectedItem.name,
      partnumber: selectedItem.partnumber,
      location: selectedItem.location,
      oldquantity: selectedItem.quantity,
    }
    setReceiptItems(updated)
  }
    const handleItemQuantityChange = (index, value) => {
    const updated = [...receiptItems]
    updated[index].quantity = Number(value)
    setReceiptItems(updated)
  }
    const addNewItem = () => {
    setReceiptItems([
      ...receiptItems,
      { itemid: "", itemname: "", partnumber: "", location: "", quantity: 0, oldquantity: 0 },
    ])
  }
    const removeItem = (index) => {
    const updated = receiptItems.filter((_, i) => i !== index)
    setReceiptItems(updated)
  }
  useEffect(() => {
    fetchItems();
  }, []);
  return (
    <>
     <Button variant="default" onClick={handleOpenModal}><PlusCircle className="w-6 mr-2" /> Add Receipt</Button>
     {
      openModal ? (
        <div className="w-full h-screen flex justify-center items-center fade-in-0 fixed inset-0 z-50 bg-black/50">
        <div className="w-[50%] bg-background rounded-lg border p-6 shadow-lg">
        <section>
          <div className="flex justify-between">
          <header>Add Receipt</header>
          <X onClick={handleCloseModal} className="cursor-pointer"/>
          </div>
          <p className="text-sm">
            Add New Receipt here. Click save when you're done.
          </p>
        </section>
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
            <Label htmlFor="valude" className="text-right">
              Value Date
            </Label>
            <Input
              id="date"
              value={today}
              className="col-span-3"
              disabled
            />
          </div>
          <div className="grid grid-2 gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invoicenumber" className="text-right">
                Invoice Number
              </Label>
              <Input
                id="invoicenumber"
                placeholder="Invoice Number"
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invoicedate" className="text-right">
                Invoice Date
              </Label>
              <Input
                id="date"
                type="date"
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer" className="text-right">
              Supplier
            </Label>
            {fetching ? (
              <Loader className="h-4 w-full animate-spin text-center" />
            ) : (
              <Select onValueChange={setSupplier} value={supplier}>
                <SelectTrigger id="supplier" className="w-full">
                  <SelectValue placeholder="Select Supplier" />
                </SelectTrigger>
                <SelectContent>
                  {fetchedSupplier.map((item: any, index: number) => (
                    <SelectItem value={item.name} key={index}>
                      {item.name}
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
              type="text"
              placeholder="Remarks"
              onChange={(e) => setRemarks(e.target.value)}
              className="col-span-3"
            />
          </div>
            {receiptItems.map((item, index) => (
            <div key={index} className="grid grid-cols-6 gap-2 items-center">
              <PartNumberSelector 
              item={item}
              index = {index}
              fetchedItems={fetchedItems}
              handleItemChange={handleItemChange}
              />
              <Input value={item.itemname} disabled className="col-span-1" />
              <Input value={item.location} disabled className="col-span-1" />
              <Input
                type="number"
                className="col-span-1"
                value={item.quantity}
                onChange={(e) => handleItemQuantityChange(index, e.target.value)}
              />
              {receiptItems.length > 1 && (
                <Button variant="destructive" onClick={() => removeItem(index)}>
                  Remove
                </Button>
              )}
            </div>
          ))}

          <Button type="button" onClick={addNewItem} className="w-fit mt-2">
            + Add Another Item
          </Button>
          
           {error && <p className="text-red-500 text-sm col-span-3 col-start-2 text-center">{error}</p>}
        </div>
        <section>
          <Button type="submit" disabled={isSubmitting} onClick={onSubmit}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </section>
      </div>
        </div>
      ):(<></>)
     }
    </>
  );
};

export default Addreceipt;
