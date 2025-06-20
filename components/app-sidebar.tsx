"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, UsersIcon, ListChecks, LayoutGrid, FolderKanban } from "lucide-react"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const mainNavItems = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/dashboard/projects", label: "Proyectos", icon: FolderKanban },
  { href: "/dashboard/tasks", label: "Tareas", icon: ListChecks },
  { href: "/dashboard/users", label: "Usuarios", icon: UsersIcon },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon" className="border-r bg-sidebar text-sidebar-foreground z-40">
      <SidebarHeader className="p-2">
        <Link href="/dashboard" className="flex items-center gap-2 p-2 rounded-lg hover:bg-sidebar-accent">
          <LayoutGrid className="w-8 h-8 text-primary" />
          {state === "expanded" && <span className="text-xl font-semibold text-sidebar-foreground">TaskFlow</span>}
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                className={cn("justify-start", (isActive) =>
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
                tooltip={{ children: item.label, side: "right", hidden: state === "expanded" }}
              >
                <Link href={item.href}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
