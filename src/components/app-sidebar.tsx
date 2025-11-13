"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { FileSearch, LayoutDashboard } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()

  // 네비게이션 데이터
  const navMain = [
    {
      title: "저작권 조사",
      url: "#",
      icon: FileSearch,
      isActive: true,
      items: [
        {
          title: "연속간행물",
          url: "/serial",
          isActive: router.pathname === "/serial",
        },
        {
          title: "단행본",
          url: "/monograph",
          isActive: router.pathname === "/monograph",
        },
      ],
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>홈</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={router.pathname === "/home"} tooltip="대시보드">
                  <Link href="/home">
                    <LayoutDashboard />
                    <span>대시보드</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
