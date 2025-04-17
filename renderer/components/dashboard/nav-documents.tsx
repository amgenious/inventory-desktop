"use client"

import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
  type Icon,
} from "@tabler/icons-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    url: string
    icon: Icon
  }[]
}) {
  if (typeof window === 'undefined') {
    return null;
}

const currentPath = window.location.pathname;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="hidden md:flex">Reports</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = currentPath === item.url;
          return (
            <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild tooltip={item.name}
            className={isActive ? 'dark:bg-black bg-white' : ''}
            >
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
            );
          })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
