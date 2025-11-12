import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import Image from "next/image"
import { BookOpen, FileText, Home } from "lucide-react"

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

// 네비게이션 데이터
const data = {
  navHome: [
    {
      title: "홈",
      url: "/home",
      icon: Home,
    },
  ],
  navSearch: [
    {
      title: "연속간행물",
      url: "/serial",
      icon: BookOpen,
    },
    {
      title: "단행본",
      url: "/monograph",
      icon: FileText,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link href="/home" className="flex items-center px-2">
          <Image
            src="/logo.png"
            alt="FISQ Logo"
            width={100}
            height={25}
            className="h-6 w-auto"
            priority
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navHome.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={router.pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>저작권 정보 검색</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSearch.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={router.pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
