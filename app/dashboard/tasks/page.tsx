"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Plus, LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KanbanView } from "@/components/tasks/kanban-view"
import { TasksTable } from "@/components/tasks/tasks-table"
import { CreateEditTaskDialog } from "@/components/tasks/create-edit-task-dialog"
import type { Task } from "@/types"

// Mock data with proper timer fields
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Diseñar interfaz de usuario",
    description: "Crear mockups y prototipos para la nueva aplicación móvil",
    status: "in-progress", // Changed from "En Progreso"
    priority: "Alta",
    assignedToId: "user1",
    team: "Equipo Frontend",
    dueDate: "2024-02-15",
    createdAt: "2024-01-10",
    timeSpent: 7200, // 2 hours in seconds
    timerActive: false,
    estimatedHours: 8,
    imageUrl: "/fitness-app-interface.png",
  },
  {
    id: "2",
    title: "Implementar autenticación",
    description: "Configurar sistema de login y registro con JWT",
    status: "pending", // Changed from "Pendiente"
    priority: "Media",
    assignedToId: "user2",
    team: "Equipo Backend",
    dueDate: "2024-02-20",
    createdAt: "2024-01-12",
    timeSpent: 3600, // 1 hour in seconds
    timerActive: false,
    estimatedHours: 6,
  },
  {
    id: "3",
    title: "Optimizar base de datos",
    description: "Mejorar consultas SQL y añadir índices necesarios",
    status: "in-review", // Changed from "Revisión"
    priority: "Alta",
    assignedToId: "user3",
    team: "Equipo Backend",
    dueDate: "2024-02-10",
    createdAt: "2024-01-08",
    timeSpent: 14400, // 4 hours in seconds
    timerActive: true,
    lastStartTime: Date.now() - 1800000, // Started 30 minutes ago
    estimatedHours: 5,
  },
  {
    id: "4",
    title: "Testing de integración",
    description: "Escribir y ejecutar pruebas end-to-end",
    status: "completed", // Changed from "Completada"
    priority: "Media",
    assignedToId: "user4",
    team: "Equipo QA",
    dueDate: "2024-02-05",
    createdAt: "2024-01-15",
    timeSpent: 10800, // 3 hours in seconds
    timerActive: false,
    estimatedHours: 4,
  },
  {
    id: "5",
    title: "Documentación API",
    description: "Crear documentación completa de endpoints REST",
    status: "pending", // Changed from "Pendiente"
    priority: "Baja",
    assignedToId: "user1",
    team: "Equipo Backend",
    dueDate: "2024-02-25",
    createdAt: "2024-01-18",
    timeSpent: 1800, // 30 minutes in seconds
    timerActive: false,
    estimatedHours: 3,
    imageUrl: "/crm-system.png",
  },
  {
    id: "6",
    title: "Configurar CI/CD",
    description: "Implementar pipeline de despliegue automático",
    status: "in-progress", // Changed from "En Progreso"
    priority: "Alta",
    assignedToId: "user2",
    team: "DevOps",
    dueDate: "2024-02-12",
    createdAt: "2024-01-20",
    timeSpent: 5400, // 1.5 hours in seconds
    timerActive: false,
    estimatedHours: 6,
  },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [teamFilter, setTeamFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Debug logging for modal state
  useEffect(() => {
    console.log("Create dialog state changed:", isCreateDialogOpen)
  }, [isCreateDialogOpen])

  // Update timers every second for active tasks
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.timerActive && task.lastStartTime) {
            const currentTime = Date.now()
            const elapsedSinceStart = Math.floor((currentTime - task.lastStartTime) / 1000)
            const initialTimeSpent = task.initialTimeSpentWhileActive || task.timeSpent
            return {
              ...task,
              timeSpent: initialTimeSpent + elapsedSinceStart,
            }
          }
          return task
        }),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Get unique teams for filter
  const teams = useMemo(() => {
    const uniqueTeams = Array.from(new Set(tasks.map((task) => task.team).filter(Boolean)))
    return uniqueTeams
  }, [tasks])

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.team && task.team.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = statusFilter === "all" || task.status === statusFilter
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
      const matchesTeam = teamFilter === "all" || task.team === teamFilter

      return matchesSearch && matchesStatus && matchesPriority && matchesTeam
    })
  }, [tasks, searchTerm, statusFilter, priorityFilter, teamFilter])

  const handleTaskUpdate = (updatedTask: Partial<Task> & { id: string }) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === updatedTask.id) {
          return { ...task, ...updatedTask }
        }
        return task
      }),
    )
  }

  const handleTaskCreate = (taskData: Omit<Task, "id" | "createdAt" | "timeSpent" | "timerActive">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
      timeSpent: 0,
      timerActive: false,
    }
    setTasks((prev) => [...prev, newTask])
    console.log("New task created:", newTask)
  }

  const handleTaskDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const handleToggleTimer = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const currentTime = Date.now()
          if (task.timerActive) {
            // Stop timer
            const elapsedSinceStart = task.lastStartTime ? Math.floor((currentTime - task.lastStartTime) / 1000) : 0
            const initialTimeSpent = task.initialTimeSpentWhileActive || task.timeSpent
            return {
              ...task,
              timerActive: false,
              timeSpent: initialTimeSpent + elapsedSinceStart,
              lastStartTime: undefined,
              initialTimeSpentWhileActive: undefined,
            }
          } else {
            // Start timer
            return {
              ...task,
              timerActive: true,
              lastStartTime: currentTime,
              initialTimeSpentWhileActive: task.timeSpent,
            }
          }
        }
        return task
      }),
    )
  }

  const handleCreateButtonClick = () => {
    console.log("Create button clicked")
    setIsCreateDialogOpen(true)
  }

  const handleDialogClose = () => {
    console.log("Dialog closing")
    setIsCreateDialogOpen(false)
  }

  const handleTaskSave = (taskData: Partial<Task> & { id?: string }) => {
    console.log("Task save called with:", taskData)
    if (taskData.id) {
      // Update existing task
      handleTaskUpdate(taskData as Partial<Task> & { id: string })
    } else {
      // Create new task
      handleTaskCreate(taskData as Omit<Task, "id" | "createdAt" | "timeSpent" | "timerActive">)
    }
    setIsCreateDialogOpen(false)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Tareas</h1>
          <p className="text-muted-foreground mt-1">Organiza y gestiona todas las tareas de tu equipo</p>
        </div>
        <Button className="trello-button-primary" onClick={handleCreateButtonClick}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Tarea
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tareas, descripciones o equipos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background border-border focus:border-primary"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-background border-border">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="in-progress">En Progreso</SelectItem>
              <SelectItem value="in-review">En Revisión</SelectItem>
              <SelectItem value="completed">Completado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-36 bg-background border-border">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="Baja">Baja</SelectItem>
              <SelectItem value="Media">Media</SelectItem>
              <SelectItem value="Alta">Alta</SelectItem>
              <SelectItem value="Urgente">Urgente</SelectItem>
            </SelectContent>
          </Select>

          <Select value={teamFilter} onValueChange={setTeamFilter}>
            <SelectTrigger className="w-40 bg-background border-border">
              <SelectValue placeholder="Equipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los equipos</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team} value={team}>
                  {team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Task Views */}
      <Tabs defaultValue="kanban" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger
            value="kanban"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Vista Kanban
          </TabsTrigger>
          <TabsTrigger
            value="table"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <List className="h-4 w-4 mr-2" />
            Vista Lista
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="space-y-4">
          <KanbanView
            initialTasks={filteredTasks}
            onUpdateTask={handleTaskUpdate}
            onDeleteTask={handleTaskDelete}
            onCreateTask={handleTaskCreate}
          />
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <TasksTable
            tasks={filteredTasks}
            onTaskUpdate={handleTaskUpdate}
            onDeleteTask={handleTaskDelete}
            toggleTimer={handleToggleTimer}
            userRole="admin"
          />
        </TabsContent>
      </Tabs>

      {/* Create Task Dialog - Always rendered but controlled by open state */}
      <CreateEditTaskDialog
        triggerButton={<div style={{ display: "none" }} />}
        onTaskSave={handleTaskSave}
        task={undefined}
        open={isCreateDialogOpen}
        onOpenChange={handleDialogClose}
      />
    </div>
  )
}
