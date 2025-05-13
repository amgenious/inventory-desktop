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
import { Loader, Loader2, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const Addreceipt = () => {
  const [valuedate, setValueDate] = useState("");
  const [invoicenumber, setInvoiceNumber] = useState("");
  const [invoicedate, setInvoiceDate] = useState("");
  const [transtype, setTranstype] = useState("");
  const [transcode, setTransCode] = useState("");
  const [supplier, setSupplier] = useState("");
  const [remarks, setRemarks] = useState("");
  const [itemid, setItemid] = useState("");
  const [itemname, setItemname] = useState("");
  const [partnumber, setPartNumber] = useState("");
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [oldquantity, setOldQuantity] = useState(0);

  const [fetchedItems, setItems] = useState<any>([]);
  const [fetchedSupplier, setFetchedSupplier] = useState<any>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetching, setFetching] = useState(false);

  const to = new Date();
  const day = String(to.getDate()).padStart(2, "0");
  const month = String(to.getMonth() + 1).padStart(2, "0");
  const year = to.getFullYear();
  const today = `${day}/${month}/${year}`;

  const prefix = Math.random().toString();
  const newT = prefix.slice(14, 18);
  const job = `${newT}${day}${month}${year}`;
  const jobnumber = job.replace(/[-:]/g, "");

  async function onSubmit() {
    var newq = oldquantity + quantity;

    let valuedate = today;
    let referencenumber = jobnumber;
    let newquantity = newq;

    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:8000/api/receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referencenumber,
          valuedate,
          invoicenumber,
          invoicedate,
          transtype,
          transcode,
          supplier,
          remarks,
          itemname,
          partnumber,
          location,
          quantity,
        }),
      });
      await fetch(`/api/stock/${itemid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newquantity }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error(error.message || "Failed to create new receipt");
      }

      toast("Success! New Receipt has been created.");
    } catch (error) {
      toast(`Failed to create new receipt, Error: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  }
  const fetchItems = async () => {
    setFetching(true);
    const response = await fetch("http://localhost:8000/api/v1/stock/getAllOpenBalance");
    const data = await response.json();
    setItems(data.openbalance);

    const response1 = await fetch("http://localhost:8000/api/v1/supplier/");
    const data1 = await response1.json();
    setFetchedSupplier(data1.supplier);

    setFetching(false);
  };
  const handleItemChange = (e: any) => {
    const selectedId = e.target.value;
    const selectedItem = fetchedItems.find(
      (item: any) => item._id === selectedId
    );

    if (selectedItem) {
      setItemid(selectedItem._id);
      setOldQuantity(selectedItem.quantity);
      setItemname(selectedItem.name);
      setPartNumber(selectedItem.partnumber || "");
      setLocation(selectedItem.location || "");
    }
  };
  useEffect(() => {
    fetchItems();
  }, []);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusCircle className="w-6 mr-2" /> Add Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Add Receipt</DialogTitle>
          <DialogDescription>
            Add New Receipt here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="valude" className="text-right">
              Value Date
            </Label>
            <Input
              id="date"
              onChange={(e) => setValueDate(today)}
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
            <Label htmlFor="transtype" className="text-right">
              Trans Type
            </Label>
            <Input
              id="transtype"
              placeholder="Trans Type"
              onChange={(e) => setTranstype(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="transcode" className="text-right">
              Trans Code
            </Label>
            <Input
              id="transcode"
              placeholder="Trans Code"
              onChange={(e) => setTransCode(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer" className="text-right">
              Supplier
            </Label>
            {fetching ? (
              <Loader className="h-4 w-full animate-spin text-center" />
            ) : (
              <Select onValueChange={setSupplier} value={supplier}>
                <SelectTrigger id="customer" className="w-full">
                  <SelectValue placeholder="Select Customer" />
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
          <div className="grid grid-cols-3 items-center gap-4">
            {fetching ? (
              <Loader className="h-4 w-full text-center animate-spin" />
            ) : (
              <>
                <div className="flex gap-4 flex-1/3">
                  <Label htmlFor="item" className="text-right">
                    Item Name
                  </Label>
                  <select
                    id="item"
                    onChange={handleItemChange}
                    className="col-span-3 border rounded px-2 py-1"
                  >
                    <option value="">Select an item</option>
                    {fetchedItems.map((item: any) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-4 flex-1/3">
                  <Label htmlFor="partnumber" className="text-right">
                    Partnumber
                  </Label>
                  <Input
                    id="partnumber"
                    placeholder="Part Number"
                    type="text"
                    value={partnumber}
                    onChange={(e) => setPartNumber(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="flex gap-4 flex-1/3">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="Location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4 ">
            <Label htmlFor="quantities" className="text-right">
              Quantities
            </Label>
            <Input
              id="quantities"
              placeholder="Quantities"
              type="number"
              onChange={(e) => setQuantity(+e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Addreceipt;
