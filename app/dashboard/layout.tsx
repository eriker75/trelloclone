import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppNavbar } from "@/components/app-navbar"
import { SidebarInset } from "@/components/ui/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <SidebarInset className="flex flex-col flex-1 bg-muted/30 dark:bg-background w-full">
        <AppNavbar />
        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto w-full">{children}</main>
      </SidebarInset>
    </div>
  )
}
