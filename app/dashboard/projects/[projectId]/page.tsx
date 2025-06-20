"use client"

import { useParams, useRouter } from "next/navigation"
import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts"
import {
  ArrowLeft,
  CalendarDays,
  ListTodo,
  CheckCircle,
  Hourglass,
  XCircle,
  Users,
  DollarSign,
  Clock,
  Target,
} from "lucide-react"
import { initialMockProjectsData, mockUsersData, initialMockTasksData } from "../page" // Adjusted import path
import type { Project, Task, UserProfile } from "@/types"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF0000"] // For Pie Chart

export default function ProjectDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string

  const project: Project | undefined = useMemo(
    () => initialMockProjectsData.find((p) => p.id === projectId),
    [projectId],
  )

  const projectTasks: Task[] = useMemo(
    () => initialMockTasksData.filter((task) => task.teamId === project?.id), // Assuming teamId in task maps to projectId
    [project],
  )

  const getProjectCreatorName = (creatorId: string) => {
    return mockUsersData.find((u) => u.id === creatorId)?.name || "Desconocido"
  }

  const getParticipantDetails = (userId: string): Pick<UserProfile, "name" | "email" | "avatarUrl" | "jobTitle"> => {
    const user = mockUsersData.find((u) => u.id === userId)
    return {
      name: user?.name || "Usuario Desconocido",
      email: user?.email || "email@desconocido.com",
      avatarUrl: user?.avatarUrl,
      jobTitle: user?.jobTitle || "N/A",
    }
  }

  const getStatusVariant = (status?: string) => {
    switch (status) {
      case "Activo":
        return "default"
      case "Completado":
        return "secondary"
      case "Pausado":
        return "outline"
      case "Cancelado":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getTaskStatusVariant = (status: string) => {
    switch (status) {
      case "Pendiente":
        return "outline"
      case "En Progreso":
        return "default"
      case "Completado":
        return "secondary"
      case "Revisión":
        return "info" // Custom variant for review
      case "Bloqueado":
        return "destructive"
      case "Cancelado":
        return "destructive"
      default:
        return "secondary"
    }
  }

  // --- Performance Metrics Calculations ---
  const totalTasks = projectTasks.length
  const completedTasksCount = projectTasks.filter((t) => t.status === "Completado").length
  const pendingTasksCount = projectTasks.filter((t) => t.status === "Pendiente").length
  const inProgressTasksCount = projectTasks.filter((t) => t.status === "En Progreso").length
  const reviewTasksCount = projectTasks.filter((t) => t.status === "Revisión").length
  const blockedTasksCount = projectTasks.filter((t) => t.status === "Bloqueado").length

  const overdueTasksCount = projectTasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "Completado",
  ).length

  const totalEstimatedHours = useMemo(
    () => projectTasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0),
    [projectTasks],
  )
  const totalTimeSpentHours = useMemo(
    () => projectTasks.reduce((sum, task) => sum + (task.timeSpentHours || 0), 0),
    [projectTasks],
  )

  const budgetUtilizationPercentage =
    project?.budgetAllocated && project?.budgetAllocated > 0
      ? ((project.budgetSpent || 0) / project.budgetAllocated) * 100
      : 0

  const hoursUtilizationPercentage = totalEstimatedHours > 0 ? (totalTimeSpentHours / totalEstimatedHours) * 100 : 0

  // --- Chart Data ---
  const taskStatusData = useMemo(() => {
    const statusCounts = projectTasks.reduce(
      (acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
  }, [projectTasks])

  const tasksPerParticipantData = useMemo(() => {
    const participantTaskCounts = projectTasks.reduce(
      (acc, task) => {
        if (task.assignedToId) {
          const participantName = getParticipantDetails(task.assignedToId).name
          acc[participantName] = (acc[participantName] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )
    return Object.entries(participantTaskCounts).map(([name, tasks]) => ({ name, tasks }))
  }, [projectTasks])

  const hoursPerParticipantData = useMemo(() => {
    const participantHoursCounts = projectTasks.reduce(
      (acc, task) => {
        if (task.assignedToId && task.timeSpentHours) {
          const participantName = getParticipantDetails(task.assignedToId).name
          acc[participantName] = (acc[participantName] || 0) + task.timeSpentHours
        }
        return acc
      },
      {} as Record<string, number>,
    )
    return Object.entries(participantHoursCounts).map(([name, hours]) => ({ name, hours }))
  }, [projectTasks])

  const taskProgressOverTimeData = useMemo(() => {
    if (projectTasks.length === 0) return []
    const tasksByCreationDate = [...projectTasks].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )

    const progressData: { date: string; completed: number; total: number }[] = []
    let completedCount = 0
    let totalCount = 0

    tasksByCreationDate.forEach((task, index) => {
      totalCount++
      if (task.status === "Completado") {
        completedCount++
      }
      // Add a point for each task or group by day/week for larger datasets
      progressData.push({
        date: new Date(task.createdAt).toLocaleDateString("es-ES", { month: "short", day: "numeric" }),
        completed: completedCount,
        total: totalCount,
      })
    })
    // Ensure unique dates if multiple tasks on same day, or aggregate
    // For simplicity, this might show multiple points for the same date if tasks created on same day
    // A more robust approach would aggregate by date
    return progressData
  }, [projectTasks])

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)]">
        <h2 className="text-2xl font-bold">Proyecto no encontrado</h2>
        <p className="text-muted-foreground">El ID de proyecto "{projectId}" no existe.</p>
        <Button onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Proyectos
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} aria-label="Volver a proyectos">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Estadísticas: <span className="text-primary">{project.name}</span>
        </h1>
      </div>

      {/* Project Overview Card */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarImage
              src={project.avatarUrl || `/placeholder.svg?width=80&height=80&query=${project.name}`}
              alt={project.name}
            />
            <AvatarFallback className="text-2xl">{project.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-xl md:text-2xl">{project.name}</CardTitle>
            <CardDescription className="text-sm md:text-base mt-1">{project.description}</CardDescription>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-muted-foreground">
              <Badge variant={getStatusVariant(project.status)} className="text-xs px-2 py-0.5">
                {project.status || "N/A"}
              </Badge>
              {project.dueDate && (
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" /> Fecha Límite: {project.dueDate}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4" /> Progreso: {project.progress || 0}%
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> {project.participants.length} Participantes
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-1">Creador del Proyecto:</h4>
              <p className="text-muted-foreground">{getProjectCreatorName(project.creatorId)}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Fecha de Creación:</h4>
              <p className="text-muted-foreground">{project.createdAt}</p>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold mb-2 text-md">Equipo del Proyecto:</h4>
            <div className="flex flex-wrap gap-2">
              {project.participants.map((p) => {
                const user = getParticipantDetails(p.userId)
                return (
                  <div key={p.userId} className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="text-xs">{user.name.substring(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.jobTitle} ({p.role})
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Totales</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">Número total de tareas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasksCount}</div>
            <p className="text-xs text-muted-foreground">
              {totalTasks > 0 ? ((completedTasksCount / totalTasks) * 100).toFixed(1) : 0}% del total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Activas</CardTitle>
            <Hourglass className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingTasksCount + inProgressTasksCount + reviewTasksCount + blockedTasksCount}
            </div>
            <p className="text-xs text-muted-foreground">Pendientes, en progreso, revisión, bloqueadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Vencidas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueTasksCount}</div>
            <p className="text-xs text-muted-foreground">Excedieron su fecha límite</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presupuesto</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(project.budgetSpent || 0).toLocaleString()} / ${(project.budgetAllocated || 0).toLocaleString()}
            </div>
            <Progress value={budgetUtilizationPercentage} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-1">{budgetUtilizationPercentage.toFixed(1)}% utilizado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas del Proyecto</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalTimeSpentHours.toLocaleString()}h / {totalEstimatedHours.toLocaleString()}h
            </div>
            <Progress value={hoursUtilizationPercentage} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-1">{hoursUtilizationPercentage.toFixed(1)}% utilizadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Tareas por Estado</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
            {taskStatusData.length > 0 ? (
              <ChartContainer
                config={taskStatusData.reduce((acc, entry, index) => {
                  acc[entry.name] = { label: entry.name, color: COLORS[index % COLORS.length] }
                  return acc
                }, {} as any)}
                className="w-full h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                      label={({ name, percent, value }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {taskStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground">No hay datos de estado de tareas.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tareas Asignadas por Participante</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
            {tasksPerParticipantData.length > 0 ? (
              <ChartContainer
                config={{ tasks: { label: "Tareas", color: "hsl(var(--primary))" } }}
                className="w-full h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tasksPerParticipantData} layout="vertical" margin={{ right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="tasks" fill="var(--color-tasks)" name="Nº Tareas" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground">No hay tareas asignadas.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horas Registradas por Participante</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
            {hoursPerParticipantData.length > 0 ? (
              <ChartContainer
                config={{ hours: { label: "Horas", color: "hsl(var(--secondary-foreground))" } }} // Using secondary color
                className="w-full h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hoursPerParticipantData} layout="vertical" margin={{ right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => `${value}h`} />
                    <Legend />
                    <Bar dataKey="hours" fill="var(--color-hours)" name="Horas Registradas" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground">No hay horas registradas por participantes.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progreso de Tareas en el Tiempo</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
            {taskProgressOverTimeData.length > 0 ? (
              <ChartContainer
                config={{
                  total: { label: "Tareas Totales", color: "hsl(var(--chart-1))" },
                  completed: { label: "Tareas Completadas", color: "hsl(var(--chart-2))" },
                }}
                className="w-full h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={taskProgressOverTimeData} margin={{ right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="var(--color-total)" name="Acum. Totales" />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="var(--color-completed)"
                      name="Acum. Completadas"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground">No hay datos de progreso de tareas.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Task List Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Tareas del Proyecto</CardTitle>
          <CardDescription>Todas las tareas asociadas a este proyecto.</CardDescription>
        </CardHeader>
        <CardContent>
          {projectTasks.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Título</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Asignado A</TableHead>
                    <TableHead>Horas (Reg/Est)</TableHead>
                    <TableHead>Fecha Límite</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>
                        <Badge variant={getTaskStatusVariant(task.status)} className="text-xs px-2 py-0.5">
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{task.priority}</TableCell>
                      <TableCell>{task.assignedToId ? getParticipantDetails(task.assignedToId).name : "N/A"}</TableCell>
                      <TableCell>
                        {task.timeSpentHours || 0}h / {task.estimatedHours || 0}h
                      </TableCell>
                      <TableCell>{task.dueDate || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No hay tareas para este proyecto.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
