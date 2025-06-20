"use client"

import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  CheckCircle,
  Clock,
  FileText,
  Users,
  Mail,
  Phone,
  Edit2,
  Calendar,
  TrendingUp,
  PieChartIcon,
  BarChart3,
} from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

import type { UserProfile, Task } from "@/types"
import { initialMockUsers, initialMockProjects } from "@/app/dashboard/users/page"

// Status-specific colors for better visual distinction
const STATUS_COLORS = {
  Completada: "#10b981", // Emerald green
  "En Progreso": "#3b82f6", // Blue
  Pendiente: "#f59e0b", // Amber
  Revisión: "#8b5cf6", // Purple
  Cancelada: "#ef4444", // Red
  Bloqueada: "#6b7280", // Gray
} as const

interface UserPerformancePageProps {
  params: { userId: string }
}

type TimePeriod = "week" | "twoWeeks" | "month"

// Generate comprehensive mock tasks with proper date distribution
const generateUserTasks = (userId: string): Task[] => {
  const now = new Date()
  const tasks: Task[] = []

  // Task templates with realistic distribution
  const taskData = [
    { title: "Implementar sistema de autenticación", status: "Completada", priority: "Alta", hours: 8, daysAgo: 2 },
    { title: "Diseñar API REST para usuarios", status: "En Progreso", priority: "Urgente", hours: 12, daysAgo: 1 },
    { title: "Revisar documentación técnica", status: "Completada", priority: "Media", hours: 4, daysAgo: 3 },
    { title: "Optimizar consultas de base de datos", status: "Pendiente", priority: "Alta", hours: 6, daysAgo: 5 },
    { title: "Crear tests unitarios", status: "Revisión", priority: "Media", hours: 3, daysAgo: 4 },
    { title: "Configurar pipeline CI/CD", status: "Completada", priority: "Alta", hours: 10, daysAgo: 6 },
    { title: "Implementar validación de formularios", status: "En Progreso", priority: "Media", hours: 5, daysAgo: 7 },
    { title: "Refactorizar componentes React", status: "Completada", priority: "Baja", hours: 7, daysAgo: 8 },
    { title: "Integrar sistema de notificaciones", status: "Pendiente", priority: "Alta", hours: 9, daysAgo: 9 },
    { title: "Actualizar dependencias del proyecto", status: "Completada", priority: "Media", hours: 2, daysAgo: 10 },
    { title: "Diseñar interfaz de usuario móvil", status: "Revisión", priority: "Alta", hours: 15, daysAgo: 11 },
    { title: "Implementar cache de aplicación", status: "En Progreso", priority: "Media", hours: 4, daysAgo: 12 },
    { title: "Configurar monitoreo de errores", status: "Completada", priority: "Alta", hours: 6, daysAgo: 13 },
    { title: "Crear endpoints de API", status: "Pendiente", priority: "Urgente", hours: 8, daysAgo: 14 },
    { title: "Optimizar rendimiento frontend", status: "En Progreso", priority: "Media", hours: 11, daysAgo: 15 },
    { title: "Implementar sistema de backup", status: "Revisión", priority: "Media", hours: 5, daysAgo: 16 },
    { title: "Configurar base de datos", status: "Completada", priority: "Alta", hours: 8, daysAgo: 17 },
    { title: "Desarrollar módulo de reportes", status: "Pendiente", priority: "Media", hours: 12, daysAgo: 18 },
    { title: "Integrar pasarela de pagos", status: "En Progreso", priority: "Urgente", hours: 14, daysAgo: 19 },
    { title: "Crear documentación de API", status: "Completada", priority: "Alta", hours: 6, daysAgo: 20 },
    { title: "Implementar autenticación OAuth", status: "Revisión", priority: "Alta", hours: 9, daysAgo: 21 },
    { title: "Configurar servidor de producción", status: "Pendiente", priority: "Media", hours: 7, daysAgo: 22 },
    { title: "Desarrollar dashboard administrativo", status: "En Progreso", priority: "Alta", hours: 16, daysAgo: 23 },
    { title: "Implementar sistema de logs", status: "Completada", priority: "Media", hours: 4, daysAgo: 24 },
    { title: "Crear tests de integración", status: "Revisión", priority: "Alta", hours: 8, daysAgo: 25 },
  ]

  const projects = ["proj-001", "proj-002", "proj-003"]

  taskData.forEach((template, index) => {
    const taskDate = new Date(now.getTime() - template.daysAgo * 24 * 60 * 60 * 1000)
    const dueDate = new Date(taskDate.getTime() + (Math.random() * 14 + 1) * 24 * 60 * 60 * 1000)

    tasks.push({
      id: `task-${userId}-${index + 1}`,
      title: template.title,
      description: `Descripción detallada: ${template.title}`,
      status: template.status as Task["status"],
      priority: template.priority as Task["priority"],
      dueDate: dueDate.toISOString().split("T")[0],
      team: projects[index % projects.length],
      assignedTo: userId,
      timeSpent: template.hours * 3600,
      timerActive: template.status === "En Progreso" && Math.random() > 0.7,
      createdAt: taskDate.toISOString().split("T")[0],
    })
  })

  return tasks
}

export default function UserPerformancePage({ params }: UserPerformancePageProps) {
  const router = useRouter()
  const { userId } = params
  const { toast } = useToast()

  const [user, setUser] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<Partial<UserProfile>>({})
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<TimePeriod>("week")

  // Generate mock tasks for the user
  const allUserTasks = useMemo(() => {
    if (!user) return []
    return generateUserTasks(user.id)
  }, [user])

  // Simulate fetching user data
  useEffect(() => {
    const foundUser = initialMockUsers.find((u) => u.id === userId)
    if (foundUser) {
      setUser(foundUser)
      setEditedUser({
        name: foundUser.name,
        email: foundUser.email,
        phoneNumber: foundUser.phoneNumber || "",
        jobTitle: foundUser.jobTitle || "",
      })
    } else {
      toast({ title: "Error", description: "Usuario no encontrado.", variant: "destructive" })
      router.push("/dashboard/users")
    }
  }, [userId, router, toast])

  // Filter tasks based on selected time period
  const filteredUserTasks = useMemo(() => {
    if (!user || allUserTasks.length === 0) return []

    const now = new Date()
    let startDate: Date

    switch (selectedTimePeriod) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "twoWeeks":
        startDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
        break
      case "month":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    return allUserTasks.filter((task) => {
      const taskDate = new Date(task.createdAt)
      return taskDate >= startDate
    })
  }, [user, allUserTasks, selectedTimePeriod])

  // Calculate performance metrics and chart data
  const performanceMetrics = useMemo(() => {
    if (!user || filteredUserTasks.length === 0) {
      return {
        totalHours: "0.0",
        completedTasks: 0,
        pendingTasksCount: 0,
        overdueTasksCount: 0,
        completionRate: 0,
        tasksPerProjectData: [],
        taskStatusData: [],
        averageTasksPerDay: 0,
        productivityTrend: 0,
      }
    }

    const completed = filteredUserTasks.filter((task) => task.status === "Completada").length
    const pending = filteredUserTasks.filter(
      (task) => task.status === "Pendiente" || task.status === "En Progreso" || task.status === "Revisión",
    ).length

    const now = new Date()
    const overdue = filteredUserTasks.filter(
      (task) => task.status !== "Completada" && task.status !== "Cancelada" && new Date(task.dueDate) < now,
    ).length

    const completionRate = filteredUserTasks.length > 0 ? (completed / filteredUserTasks.length) * 100 : 0

    // Tasks per project
    const tasksPerProject: { name: string; count: number }[] = []
    user.assignedProjects.forEach((assignedProj) => {
      const projectDetails = initialMockProjects.find((p) => p.id === assignedProj.projectId)
      if (projectDetails) {
        const count = filteredUserTasks.filter((task) => task.team === assignedProj.projectId).length
        if (count > 0) {
          tasksPerProject.push({ name: projectDetails.name, count })
        }
      }
    })

    // Task status distribution for pie chart
    const statusCounts = filteredUserTasks.reduce(
      (acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1
        return acc
      },
      {} as Record<Task["status"], number>,
    )

    // Convert to chart data format
    const taskStatusData = Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      percentage: ((count / filteredUserTasks.length) * 100).toFixed(1),
      color: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "#8884d8",
    }))

    // Calculate additional metrics
    const totalDays = selectedTimePeriod === "week" ? 7 : selectedTimePeriod === "twoWeeks" ? 14 : 30
    const averageTasksPerDay = filteredUserTasks.length / totalDays

    // Calculate productivity trend
    const firstHalf = filteredUserTasks.slice(0, Math.floor(filteredUserTasks.length / 2))
    const secondHalf = filteredUserTasks.slice(Math.floor(filteredUserTasks.length / 2))
    const firstHalfCompleted = firstHalf.filter((t) => t.status === "Completada").length
    const secondHalfCompleted = secondHalf.filter((t) => t.status === "Completada").length
    const productivityTrend = secondHalfCompleted - firstHalfCompleted

    return {
      totalHours: (filteredUserTasks.reduce((sum, task) => sum + (task.timeSpent || 0), 0) / 3600).toFixed(1),
      completedTasks: completed,
      pendingTasksCount: pending,
      overdueTasksCount: overdue,
      completionRate: Number.parseFloat(completionRate.toFixed(1)),
      tasksPerProjectData: tasksPerProject,
      taskStatusData: taskStatusData,
      averageTasksPerDay: Number.parseFloat(averageTasksPerDay.toFixed(1)),
      productivityTrend,
    }
  }, [user, filteredUserTasks, selectedTimePeriod])

  const handleEditToggle = () => {
    if (isEditing && user) {
      const updatedUser = { ...user, ...editedUser }
      setUser(updatedUser)
      const userIndex = initialMockUsers.findIndex((u) => u.id === userId)
      if (userIndex !== -1) {
        initialMockUsers[userIndex] = updatedUser
      }
      toast({ title: "Éxito", description: "Información del usuario actualizada." })
    } else if (user) {
      setEditedUser({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        jobTitle: user.jobTitle || "",
      })
    }
    setIsEditing(!isEditing)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedUser((prev) => ({ ...prev, [name]: value }))
  }

  const getTimePeriodLabel = (period: TimePeriod) => {
    switch (period) {
      case "week":
        return "Última semana"
      case "twoWeeks":
        return "Últimas 2 semanas"
      case "month":
        return "Último mes"
      default:
        return "Última semana"
    }
  }

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg border-gray-200">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">{data.value}</span> tareas ({data.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  // Custom label renderer for pie chart
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null // Don't show labels for very small slices

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="600"
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="0.5"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando perfil del usuario...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* User Header */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-primary">
            <AvatarImage
              src={user.avatarUrl || `/placeholder.svg?width=96&height=96&query=${user.name}`}
              alt={user.name}
            />
            <AvatarFallback className="text-3xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl sm:text-3xl font-bold">{user.name}</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              {user.jobTitle || "Puesto no especificado"}
            </CardDescription>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" /> {user.email}
              </span>
              {user.phoneNumber && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4" /> {user.phoneNumber}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" /> Rol: {user.role}
              </span>
            </div>
          </div>
          <Button onClick={handleEditToggle} variant={isEditing ? "default" : "outline"} size="sm">
            <Edit2 className="mr-2 h-4 w-4" />
            {isEditing ? "Guardar Cambios" : "Editar Perfil"}
          </Button>
        </CardHeader>
      </Card>

      {/* Time Period Selector */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Período de Análisis
              </CardTitle>
              <CardDescription>
                Selecciona el período de tiempo para analizar el rendimiento del usuario
              </CardDescription>
            </div>
            <Select value={selectedTimePeriod} onValueChange={(value: TimePeriod) => setSelectedTimePeriod(value)}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="twoWeeks">Últimas 2 semanas</SelectItem>
                <SelectItem value="month">Último mes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Mostrando datos para: <span className="font-medium">{getTimePeriodLabel(selectedTimePeriod)}</span>
            <span className="ml-2">({filteredUserTasks.length} tareas en este período)</span>
          </div>
        </CardContent>
      </Card>

      {/* Editable User Info Section */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Editar Información del Usuario</CardTitle>
            <CardDescription>Actualiza los detalles básicos del usuario.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" name="name" value={editedUser.name || ""} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={editedUser.email || ""} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">Número de Teléfono</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={editedUser.phoneNumber || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="jobTitle">Puesto de Trabajo</Label>
              <Input id="jobTitle" name="jobTitle" value={editedUser.jobTitle || ""} onChange={handleInputChange} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Trabajadas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics.totalHours}</div>
            <p className="text-xs text-muted-foreground">{performanceMetrics.averageTasksPerDay} tareas/día promedio</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics.completedTasks}</div>
            <p className="text-xs text-muted-foreground">{performanceMetrics.completionRate}% de finalización</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics.pendingTasksCount}</div>
            <p className="text-xs text-muted-foreground">En progreso o por iniciar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendencia</CardTitle>
            <TrendingUp
              className={`h-4 w-4 ${performanceMetrics.productivityTrend >= 0 ? "text-green-500" : "text-red-500"}`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${performanceMetrics.productivityTrend >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {performanceMetrics.productivityTrend >= 0 ? "+" : ""}
              {performanceMetrics.productivityTrend}
            </div>
            <p className="text-xs text-muted-foreground">Cambio en productividad</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Distribution by Status Pie Chart - RE-IMPLEMENTED */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              Distribución de Tareas por Estado
            </CardTitle>
            <CardDescription>
              Visualización de la distribución de tareas por estado durante{" "}
              {getTimePeriodLabel(selectedTimePeriod).toLowerCase()}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {performanceMetrics.taskStatusData.length > 0 ? (
              <div className="space-y-6">
                {/* Pie Chart */}
                <div className="w-full h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={performanceMetrics.taskStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderLabel}
                        outerRadius={100}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={2}
                        stroke="#ffffff"
                        strokeWidth={2}
                      >
                        {performanceMetrics.taskStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Custom Legend with Statistics */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Desglose por Estado:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {performanceMetrics.taskStatusData.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                      >
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0 border-2 border-white shadow-sm"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.value} tareas • {item.percentage}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary Statistics */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {performanceMetrics.taskStatusData.find((item) => item.name === "Completada")?.value || 0}
                      </p>
                      <p className="text-xs text-gray-500">Completadas</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {performanceMetrics.taskStatusData.find((item) => item.name === "En Progreso")?.value || 0}
                      </p>
                      <p className="text-xs text-gray-500">En Progreso</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-amber-600">
                        {performanceMetrics.taskStatusData.find((item) => item.name === "Pendiente")?.value || 0}
                      </p>
                      <p className="text-xs text-gray-500">Pendientes</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <PieChartIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">No hay datos disponibles</p>
                  <p className="text-sm mt-2">
                    No se encontraron tareas para {getTimePeriodLabel(selectedTimePeriod).toLowerCase()}.
                  </p>
                  <p className="text-xs mt-1 text-gray-400">Prueba seleccionando un período más amplio.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tasks per Project Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Tareas por Proyecto
            </CardTitle>
            <CardDescription>
              Distribución de tareas asignadas por proyecto durante{" "}
              {getTimePeriodLabel(selectedTimePeriod).toLowerCase()}.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {performanceMetrics.tasksPerProjectData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceMetrics.tasksPerProjectData} layout="vertical" margin={{ right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-medium">{label}</p>
                            <p className="text-sm text-gray-600">{payload[0].value} tareas</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">No hay datos de proyectos</p>
                  <p className="text-sm mt-2">No se encontraron tareas asignadas a proyectos.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Task List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Tareas del Período</CardTitle>
          <CardDescription>
            Tareas del usuario durante {getTimePeriodLabel(selectedTimePeriod).toLowerCase()}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Proyecto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Prioridad
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Horas
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUserTasks.slice(0, 10).map((task) => {
                  const project = initialMockProjects.find((p) => p.id === task.team)
                  return (
                    <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {task.title}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {project?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <Badge
                          variant="outline"
                          className="border-0"
                          style={{
                            backgroundColor: `${STATUS_COLORS[task.status as keyof typeof STATUS_COLORS]}20`,
                            color: STATUS_COLORS[task.status as keyof typeof STATUS_COLORS],
                          }}
                        >
                          {task.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <Badge
                          variant={
                            task.priority === "Urgente"
                              ? "destructive"
                              : task.priority === "Alta"
                                ? "default"
                                : task.priority === "Media"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {task.priority}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {((task.timeSpent || 0) / 3600).toFixed(1)}h
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {filteredUserTasks.length > 10 && (
            <CardFooter className="pt-4">
              <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/tasks?assignedTo=${user.id}`)}>
                Ver todas las tareas del período ({filteredUserTasks.length})
              </Button>
            </CardFooter>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
