"use client"
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function PartNumberSelector({ title, fetchedItems,handleSeletedItem }) {
const [selectedItem, setSelectedItem] = useState("")
const handle = (referencenumber) => {
    setSelectedItem(referencenumber)
    return handleSeletedItem(referencenumber)
}
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selectedItem || title}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Filter Reference Number" />
          <CommandList>
            <CommandGroup>
              {fetchedItems.map((itm:any,index:number) => (
                <CommandItem
                  key={index}
                  onSelect={() => handle(itm.referencenumber)}
                >
                  {itm.referencenumber}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
