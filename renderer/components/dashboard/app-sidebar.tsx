"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileWord,
  IconFolder,
  IconListDetails,
  IconReport,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/dashboard/nav-documents"
import { NavMain } from "@/components/dashboard/nav-main"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { GalleryVerticalEnd } from "lucide-react"
// import { useAuth } from "@/hooks/use-auth"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Static Data",
      url: "/dashboard/staticdata",
      icon: IconListDetails,
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: IconChartBar,
    },
    {
      title: "Error Corrections",
      url: "/dashboard/corrects",
      icon: IconFolder,
    },
    {
      title: "Open Balances",
      url: "/dashboard/balances",
      icon: IconUsers,
    },
  ],
  documents: [
    {
      name: "Stock",
      url: "/dashboard/reports/inventory",
      icon: IconDatabase,
    },
    {
      name: "Issues",
      url: "/dashboard/reports/issues",
      icon: IconReport,
    },
    {
      name: "Receipt",
      url: "/dashboard/reports/receipt",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // const { user } = useAuth()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
              <GalleryVerticalEnd className="size-6" />
                <span className="text-base font-semibold">Sections</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* {user?.role === 'admin' && <NavDocuments items={data.documents} />} */}
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
    </Sidebar>
  )
}
