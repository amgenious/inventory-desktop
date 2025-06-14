import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export function PartNumberSelector({ item, index, fetchedItems, handleItemChange }) {
  const selectedItem = fetchedItems.find((itm) => itm.id === item.itemid);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selectedItem?.partnumber || "Filter Partnumber"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Filter Partnumber" />
          <CommandList>
            <CommandGroup>
              {fetchedItems.map((itm) => (
                <CommandItem
                  key={itm.id}
                  onSelect={() => handleItemChange(index, itm.id)}
                >
                  {itm.partnumber}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
