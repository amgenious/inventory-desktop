import { ModeToggle } from "../mode-toggle"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-[100rem] items-center justify-between px-4 lg:gap-2 lg:px-6">
        <h1 className="text-base font-medium">Inventory Management System</h1>
         <ModeToggle />
      </div>
    </header>
  )
}
