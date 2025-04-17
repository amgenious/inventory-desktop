"use client"

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { cn } from "@/lib/utils"


export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
   if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;
  return (
    <SidebarGroup>
    <SidebarGroupContent className="flex flex-col gap-2">
      <SidebarMenu>
        {items.map((item) => {
          const isActive = currentPath === item.url;
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                className={isActive ? 'dark:bg-black bg-white' : ''}
              >
                {item.icon && <item.icon />}
                <Link href={item.url}>
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
  )
}
