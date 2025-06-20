"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { UserDashboard } from "@/components/dashboard/user-dashboard"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3, Users, CheckCircle, Clock, Target, Award } from "lucide-react"

// Mock data
const stats = [
  {
    title: "Proyectos Activos",
    value: "12",
    change: "+2 este mes",
    icon: BarChart3,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    title: "Tareas Completadas",
    value: "248",
    change: "+18% vs mes anterior",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    title: "Miembros del Equipo",
    value: "24",
    change: "+3 nuevos miembros",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    title: "Tareas Pendientes",
    value: "36",
    change: "-8 desde ayer",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    title: "Proyectos Completados",
    value: "8",
    change: "+2 este trimestre",
    icon: Target,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    title: "Rendimiento del Equipo",
    value: "94%",
    change: "+5% mejora",
    icon: Award,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
  },
]

const recentProjects = [
  {
    id: 1,
    name: "Plataforma E-commerce",
    description: "Desarrollo de tienda online con React y Node.js",
    progress: 75,
    team: "Equipo Frontend",
    dueDate: "2024-02-15",
    status: "in-progress",
    image: "/ecommerce-platform-concept.png",
    members: [
      { name: "Ana López", avatar: "/ana-lopez.png" },
      { name: "Carlos García", avatar: "/carlos-garcia-portrait.png" },
      { name: "Pedro Rodríguez", avatar: "/pedro-rodriguez-portrait.png" },
    ],
  },
  {
    id: 2,
    name: "App de Fitness",
    description: "Aplicación móvil para seguimiento de ejercicios",
    progress: 45,
    team: "Equipo Mobile",
    dueDate: "2024-03-01",
    status: "in-progress",
    image: "/fitness-app-interface.png",
    members: [
      { name: "María González", avatar: "/portrait-woman.png" },
      { name: "Carlos García", avatar: "/carlos-garcia-portrait.png" },
    ],
  },
  {
    id: 3,
    name: "Sistema CRM",
    description: "Customer Relationship Management para ventas",
    progress: 90,
    team: "Equipo Backend",
    dueDate: "2024-01-30",
    status: "in-review",
    image: "/crm-system.png",
    members: [
      { name: "Pedro Rodríguez", avatar: "/pedro-rodriguez-portrait.png" },
      { name: "Ana López", avatar: "/ana-lopez.png" },
    ],
  },
  {
    id: 4,
    name: "Campaña de Marketing",
    description: "Estrategia digital para Q1 2024",
    progress: 30,
    team: "Equipo Marketing",
    dueDate: "2024-02-28",
    status: "pending",
    image: "/marketing-campaign-brainstorm.png",
    members: [{ name: "María González", avatar: "/portrait-woman.png" }],
  },
]

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
  "in-progress": { label: "En Progreso", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  "in-review": {
    label: "En Revisión",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  },
  completed: { label: "Completado", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const isAdmin = searchParams.has("admin")
  const isUser = searchParams.has("user") || (!searchParams.has("admin") && !searchParams.has("user"))

  if (isAdmin) {
    return <AdminDashboard />
  }

  return <UserDashboard />
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}
