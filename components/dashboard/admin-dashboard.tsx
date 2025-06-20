"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  FolderKanban,
  CheckCircle,
  AlertTriangle,
  Server,
  Database,
  Activity,
  UserCheck,
  UserX,
  Clock,
  Settings,
  BarChart3,
  PieChart,
  Plus,
} from "lucide-react"

// Mock admin data
const systemMetrics = [
  {
    title: "Total Users",
    value: "1,247",
    change: "+12% this month",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    title: "Active Projects",
    value: "89",
    change: "+5 new this week",
    icon: FolderKanban,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    title: "System Uptime",
    value: "99.9%",
    change: "Last 30 days",
    icon: Server,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    title: "Storage Used",
    value: "2.4 TB",
    change: "68% of capacity",
    icon: Database,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    title: "Active Sessions",
    value: "342",
    change: "+18 from yesterday",
    icon: Activity,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    title: "Tasks Completed",
    value: "15,847",
    change: "+23% vs last month",
    icon: CheckCircle,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
  },
]

const userStats = [
  { label: "Active Users", value: 1089, color: "bg-green-500", percentage: 87 },
  { label: "Inactive Users", value: 158, color: "bg-yellow-500", percentage: 13 },
  { label: "Pending Approval", value: 23, color: "bg-red-500", percentage: 2 },
]

const recentActivity = [
  {
    id: 1,
    user: "Ana López",
    avatar: "/ana-lopez.png",
    action: "Created new project",
    target: "E-commerce Platform",
    time: "2 minutes ago",
    type: "create",
  },
  {
    id: 2,
    user: "Carlos García",
    avatar: "/carlos-garcia-portrait.png",
    action: "Completed task",
    target: "User Authentication",
    time: "15 minutes ago",
    type: "complete",
  },
  {
    id: 3,
    user: "María González",
    avatar: "/portrait-woman.png",
    action: "Joined team",
    target: "Frontend Development",
    time: "1 hour ago",
    type: "join",
  },
  {
    id: 4,
    user: "Pedro Rodríguez",
    avatar: "/pedro-rodriguez-portrait.png",
    action: "Updated project status",
    target: "CRM System",
    time: "2 hours ago",
    type: "update",
  },
]

const systemAlerts = [
  {
    id: 1,
    type: "warning",
    title: "High Memory Usage",
    description: "Server memory usage is at 85%",
    time: "5 minutes ago",
  },
  {
    id: 2,
    type: "info",
    title: "Backup Completed",
    description: "Daily backup completed successfully",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "error",
    title: "Failed Login Attempts",
    description: "Multiple failed login attempts detected",
    time: "3 hours ago",
  },
]

const actionTypeConfig = {
  create: { icon: Plus, color: "text-green-600" },
  complete: { icon: CheckCircle, color: "text-blue-600" },
  join: { icon: UserCheck, color: "text-purple-600" },
  update: { icon: Settings, color: "text-orange-600" },
}

const alertTypeConfig = {
  warning: { icon: AlertTriangle, color: "text-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-950/30" },
  info: { icon: Activity, color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-950/30" },
  error: { icon: UserX, color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-950/30" },
}

export function AdminDashboard() {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">System overview and administrative controls</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="trello-button-secondary">
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Button className="trello-button-primary">
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systemMetrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index} className="trello-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${metric.bgColor}`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Statistics */}
        <Card className="trello-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              User Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {userStats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <span className="font-medium text-foreground">{stat.value}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={stat.percentage} className="flex-1 h-2" />
                  <span className="text-xs text-muted-foreground w-8">{stat.percentage}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="trello-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemAlerts.map((alert) => {
              const config = alertTypeConfig[alert.type as keyof typeof alertTypeConfig]
              const Icon = config.icon
              return (
                <div key={alert.id} className={`p-3 rounded-lg ${config.bgColor}`}>
                  <div className="flex items-start gap-3">
                    <Icon className={`h-4 w-4 mt-0.5 ${config.color}`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">{alert.description}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="trello-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent System Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentActivity.map((activity) => {
            const config = actionTypeConfig[activity.type as keyof typeof actionTypeConfig]
            const Icon = config.icon
            return (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${config.color}`} />
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                  </div>
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
  )
}
