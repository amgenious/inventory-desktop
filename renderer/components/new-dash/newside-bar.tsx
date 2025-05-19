"use client"
import React from 'react'
import { FolderArchive, GalleryVerticalEnd, SearchCheckIcon, Settings2, Ticket } from 'lucide-react'
import { SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarContent, SidebarFooter, SidebarMenuButton } from '../ui/sidebar'
import { IconDashboard, IconListDetails, IconChartBar, IconFolder, IconUsers, IconDatabase, IconReport, IconFileWord, IconLogout } from '@tabler/icons-react'
import { NavMain } from '../dashboard/nav-main'
import { NavDocuments } from '../dashboard/nav-documents'
import { NavUser } from '../dashboard/nav-user'
import { useAuth } from "@/hooks/use-auth"
import {useRouter} from "next/navigation"
import { NavSecondary } from '../dashboard/nav-secondary'
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/dashboard-home/",
      icon: IconDashboard,
    },
    {
      title: "Static Data",
      url: "/dashboard/staticdata/",
      icon: IconListDetails,
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions/",
      icon: IconChartBar,
    },
    {
      title: "Error Corrections",
      url: "/dashboard/errorcorrection/",
      icon: IconFolder,
    },
    {
      title: "Open Balances",
      url: "/dashboard/openbalances/",
      icon: IconUsers,
    },
  ],
  documents: [
    {
      name: "Stock",
      url: "/dashboard/reports/inventory/",
      icon: IconDatabase,
    },
    {
      name: "Issues",
      url: "/dashboard/reports/issues/",
      icon: IconReport,
    },
    {
      name: "Receipt",
      url: "/dashboard/reports/receipt/",
      icon: IconFileWord,
    },
  ],
  secondary:[
    {
      title:"Enquiries",
      url:"/dashboard/enquiries/",
      icon:SearchCheckIcon,
    },
    {
      title:"Settings",
      url:"/dashboard/settings/",
      icon:Settings2
    },
    {
      title:"Templates",
      url:"/dashboard/templates/",
      icon:FolderArchive
    },
  ]
}

const Newsidebar = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth()
  const handleLogout = ()=> {
    logout()
    router.push("/signin")
  }
  return (
    <aside className="w-20 md:w-60 dark:bg-gradient-to-b dark:from-violet-500 dark:to-blue-500  bg-gradient-to-r from-blue-200 to-cyan-200 p-4 flex flex-col gap-4">
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
         <NavDocuments items={data.documents} />
         <NavSecondary  items={data.secondary}/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
        <div className="cursor-pointer flex gap-2 w-full justify-center items-center bg-accent p-1 rounded-md" onClick={handleLogout}>
          <IconLogout  className='w-4'/> <span className='text-sm'>Log out</span>
        </div>
      </SidebarFooter>
      </aside>
  )
}

export default Newsidebar