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
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const Addsupplier = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const supplierSchema = z.object({
    name: z.string().min(1, "Supplier name cannot be empty"),
    email: z.string().email("Supplier email cannot be empty"),
    contact: z.string().min(1, "Supplier contact cannot be empty"),
    address: z.string().min(1, "Supplier address cannot be empty"),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit() {
    setIsSubmitting(true);
    const result = supplierSchema.safeParse({ name: name,email:email,contact:contact,address:address });

    if (!result.success) {
      setError(result.error.format().name?._errors[0] || result.error.format().email?._errors[0] || result.error.format().contact?._errors[0] || result.error.format().address?._errors[0] || "Invalid input");
      setIsSubmitting(false)
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/api/v1/supplier/add-supplier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, contact, address }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create new supplier");
      }

      toast.success("Success! New supplier has been created.");
    } catch (error) {
      toast.error(`Failed to create new supplier, Error: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusCircle className="w-6 mr-2"/> Add Supplier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Supplier</DialogTitle>
          <DialogDescription>
            Add New Supplier here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="name">Supplier Name</Label>
            <Input
              id="name"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="contact">Contact</Label>
            <Input
              id="contact"
              placeholder="Contact"
              onChange={(e) => setContact(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Address"
              onChange={(e) => setAddress(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm col-span-3 col-start-2 text-center">{error}</p>}
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting} onClick={onSubmit}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Supplier"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Addsupplier;
