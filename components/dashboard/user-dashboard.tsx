"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  Users,
  CheckCircle,
  Clock,
  Calendar,
  Target,
  Award,
  Plus,
  ArrowRight,
  Bell,
  TrendingUp,
  Activity,
  Timer,
} from "lucide-react"

// Mock user data
const userStats = [
  {
    title: "My Active Tasks",
    value: "12",
    change: "+3 this week",
    icon: BarChart3,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    title: "Completed Today",
    value: "5",
    change: "Great progress!",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    title: "Team Projects",
    value: "3",
    change: "2 in progress",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    title: "Pending Tasks",
    value: "8",
    change: "Due this week",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    title: "This Month",
    value: "47",
    change: "+15% vs last month",
    icon: Target,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    title: "Productivity Score",
    value: "92%",
    change: "+8% improvement",
    icon: Award,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
  },
]

const pendingTasks = [
  {
    id: 1,
    title: "Update user authentication system",
    project: "E-commerce Platform",
    priority: "high",
    dueDate: "2024-01-20",
    progress: 75,
    assignee: "Ana López",
    avatar: "/ana-lopez.png",
  },
  {
    id: 2,
    title: "Design mobile app interface",
    project: "Fitness App",
    priority: "medium",
    dueDate: "2024-01-22",
    progress: 45,
    assignee: "Carlos García",
    avatar: "/carlos-garcia-portrait.png",
  },
  {
    id: 3,
    title: "Implement payment gateway",
    project: "E-commerce Platform",
    priority: "high",
    dueDate: "2024-01-18",
    progress: 30,
    assignee: "María González",
    avatar: "/portrait-woman.png",
  },
  {
    id: 4,
    title: "Write API documentation",
    project: "CRM System",
    priority: "low",
    dueDate: "2024-01-25",
    progress: 60,
    assignee: "Pedro Rodríguez",
    avatar: "/pedro-rodriguez-portrait.png",
  },
]

const recentActivity = [
  {
    id: 1,
    action: "Completed task",
    target: "User Registration Flow",
    project: "E-commerce Platform",
    time: "2 hours ago",
    type: "complete",
  },
  {
    id: 2,
    action: "Started working on",
    target: "Payment Integration",
    project: "E-commerce Platform",
    time: "4 hours ago",
    type: "start",
  },
  {
    id: 3,
    action: "Commented on",
    target: "Mobile UI Design",
    project: "Fitness App",
    time: "1 day ago",
    type: "comment",
  },
  {
    id: 4,
    action: "Updated status",
    target: "Database Migration",
    project: "CRM System",
    time: "2 days ago",
    type: "update",
  },
]

const priorityConfig = {
  high: { label: "Alta", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  medium: { label: "Media", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
  low: { label: "Baja", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
}

const activityTypeConfig = {
  complete: { icon: CheckCircle, color: "text-green-600" },
  start: { icon: Timer, color: "text-blue-600" },
  comment: { icon: Activity, color: "text-purple-600" },
  update: { icon: TrendingUp, color: "text-orange-600" },
}

export function UserDashboard() {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mi Dashboard</h1>
          <p className="text-muted-foreground mt-1">Bienvenido de vuelta. Aquí tienes un resumen de tu trabajo.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="trello-button-secondary">
            <Bell className="h-4 w-4 mr-2" />
            Notificaciones
          </Button>
          <Button className="trello-button-primary">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Tarea
          </Button>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="trello-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <Card className="trello-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold text-foreground">Tareas Pendientes</CardTitle>
            <Button variant="outline" size="sm" className="trello-button-secondary">
              Ver todas
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingTasks.slice(0, 4).map((task) => (
              <div key={task.id} className="trello-card p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-medium text-foreground">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">{task.project}</p>
                  </div>
                  <Badge className={priorityConfig[task.priority as keyof typeof priorityConfig].color}>
                    {priorityConfig[task.priority as keyof typeof priorityConfig].label}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-medium text-foreground">{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.avatar || "/placeholder.svg"} alt={task.assignee} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {task.assignee
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{task.assignee}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(task.dueDate).toLocaleDateString("es-ES")}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="trello-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => {
              const config = activityTypeConfig[activity.type as keyof typeof activityTypeConfig]
              const Icon = config.icon
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-muted">
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-foreground">
                      {activity.action} <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.project}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="trello-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="trello-button-secondary h-auto p-4 flex-col gap-2">
              <Plus className="h-6 w-6" />
              <span>Nueva Tarea</span>
            </Button>
            <Button variant="outline" className="trello-button-secondary h-auto p-4 flex-col gap-2">
              <Users className="h-6 w-6" />
              <span>Unirse a Equipo</span>
            </Button>
            <Button variant="outline" className="trello-button-secondary h-auto p-4 flex-col gap-2">
              <Calendar className="h-6 w-6" />
              <span>Ver Calendario</span>
            </Button>
            <Button variant="outline" className="trello-button-secondary h-auto p-4 flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              <span>Mis Reportes</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
