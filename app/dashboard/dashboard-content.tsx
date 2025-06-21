"use client"

import { useSearchParams } from "next/navigation"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { UserDashboard } from "@/components/dashboard/user-dashboard"

export function DashboardContent() {
  // Only use searchParams on the client side to avoid SSR issues
  if (typeof window === 'undefined') {
    return null
  }

  const searchParams = useSearchParams()
  const isAdmin = searchParams.has("admin")
  const isUser = searchParams.has("user") || (!searchParams.has("admin") && !searchParams.has("user"))

  if (isAdmin) {
    return <AdminDashboard />
  }

  return <UserDashboard />
}