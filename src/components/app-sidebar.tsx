"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import Image from "next/image"
import { FileSearch, Home } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/home">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image
                    src="/icon.png"
                    alt="FISQ"
                    width={32}
                    height={32}
                    className="size-7"
                    priority
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">FISQ</span>
                  <span className="truncate text-xs">저작권 정보 검색</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>홈</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={router.pathname === "/home"} tooltip="대시보드">
                  <Link href="/home">
                    <Home />
                    <span>대시보드</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
