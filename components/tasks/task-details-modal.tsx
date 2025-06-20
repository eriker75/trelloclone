"use client"

import type React from "react"
import { useState, useEffect } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Task, TaskPriority, TaskStatus } from "@/types"
import { cn, formatTime } from "@/lib/utils"
import {
  CalendarDays,
  Users,
  Clock,
  AlertCircleIcon,
  CheckCircle2,
  ArrowUp,
  Timer,
  AlertTriangle,
  ImageIcon,
  Play,
  Pause,
  Edit,
  Trash2,
} from "lucide-react"
import { CreateEditTaskDialog } from "./create-edit-task-dialog"

interface TaskDetailsModalProps {
  task: Task | null
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onUpdateTask: (task: Partial<Task> & { id: string }) => void
  onDeleteTask: (taskId: string) => void
}

const statusVariant: Record<TaskStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  "in-progress": "default",
  "in-review": "default",
  completed: "outline",
}

const priorityVariant: Record<TaskPriority, "default" | "secondary" | "destructive"> = {
  Baja: "secondary",
  Media: "default",
  Alta: "destructive",
  Urgente: "destructive",
}

const priorityIcons: Record<TaskPriority, React.ReactNode> = {
  Baja: <CheckCircle2 className="h-4 w-4" />,
  Media: <AlertTriangle className="h-4 w-4" />,
  Alta: <ArrowUp className="h-4 w-4" />,
  Urgente: <ArrowUp className="h-4 w-4 text-red-500" />,
}

const statusLabels: Record<TaskStatus, string> = {
  pending: "Pendiente",
  "in-progress": "En Progreso",
  "in-review": "Revisión",
  completed: "Completada",
}

const isTaskOverdue = (task: Task): boolean => {
  if (!task.dueDate || task.status === "completed") return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(task.dueDate)
  dueDate.setHours(0, 0, 0, 0)
  return dueDate < today
}

export function TaskDetailsModal({ task, isOpen, onOpenChange, onUpdateTask, onDeleteTask }: TaskDetailsModalProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Debug logging
  useEffect(() => {
    console.log("Modal state changed:", { isOpen, task: task?.title })
  }, [isOpen, task])

  if (!task) {
    return null
  }

  const overdue = isTaskOverdue(task)

  const handleToggleTimer = () => {
    const currentTime = Date.now()

    if (task.timerActive) {
      // Stop timer
      const elapsedSinceStart = task.lastStartTime ? Math.floor((currentTime - task.lastStartTime) / 1000) : 0
      const initialTimeSpent = task.initialTimeSpentWhileActive || task.timeSpent
      onUpdateTask({
        id: task.id,
        timerActive: false,
        timeSpent: initialTimeSpent + elapsedSinceStart,
        lastStartTime: undefined,
        initialTimeSpentWhileActive: undefined,
      })
    } else {
      // Start timer
      onUpdateTask({
        id: task.id,
        timerActive: true,
        lastStartTime: currentTime,
        initialTimeSpentWhileActive: task.timeSpent,
      })
    }
  }

  const handleDelete = () => {
    onDeleteTask(task.id)
    onOpenChange(false)
  }

  const handleEdit = () => {
    setIsEditDialogOpen(true)
  }

  const handleTaskSave = (updatedTaskData: Partial<Task> & { id?: string }) => {
    onUpdateTask({ ...updatedTaskData, id: task.id })
    setIsEditDialogOpen(false)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">{task.title}</DialogTitle>
            {task.description && (
              <DialogDescription className="mt-1 text-sm text-muted-foreground pt-2">
                <div dangerouslySetInnerHTML={{ __html: task.description }} />
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="py-4 space-y-6 overflow-y-auto flex-grow pr-2">
            {task.imageUrl && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Imagen Adjunta
                </h4>
                <img
                  src={task.imageUrl || "/placeholder.svg"}
                  alt={task.title}
                  className="w-full max-h-64 object-cover rounded-lg border"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Estado</h4>
                <Badge
                  variant={statusVariant[task.status]}
                  className={cn(
                    "text-sm py-1 px-2.5",
                    task.status === "completed" && "border-green-500/50 text-green-600 dark:text-green-400",
                    task.status === "in-progress" && "bg-blue-500/80 hover:bg-blue-500 text-white",
                    task.status === "in-review" && "bg-purple-500/80 hover:bg-purple-500 text-white",
                  )}
                >
                  {statusLabels[task.status]}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Prioridad</h4>
                <Badge variant={priorityVariant[task.priority]} className="text-sm py-1 px-2.5 gap-1.5 items-center">
                  {priorityIcons[task.priority]}
                  {task.priority}
                </Badge>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                <CalendarDays className="h-4 w-4 mr-2" />
                Fecha Límite
              </h4>
              <p className={cn("text-sm", overdue && "text-destructive font-semibold flex items-center")}>
                {overdue && <AlertCircleIcon className="h-4 w-4 mr-1.5" />}
                {task.dueDate} {overdue && "(Atrasada)"}
              </p>
            </div>

            {task.team && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Proyecto / Equipo
                </h4>
                <p className="text-sm">{task.team}</p>
              </div>
            )}

            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Tiempo Dedicado
              </h4>
              <div className="flex items-center justify-between">
                <div className={cn("flex items-center gap-1.5 text-sm", task.timerActive && "text-primary")}>
                  <Timer className={cn("h-4 w-4", task.timerActive && "animate-pulse")} />
                  <span className="font-mono font-medium tabular-nums">{formatTime(task.timeSpent)}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleTimer}
                  className={cn(task.timerActive && "bg-primary text-primary-foreground")}
                >
                  {task.timerActive ? (
                    <div className="flex items-center">
                      <Pause className="h-4 w-4 mr-2" />
                      Pausar
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Play className="h-4 w-4 mr-2" />
                      Iniciar
                    </div>
                  )}
                </Button>
              </div>
            </div>

            {task.assignedToId && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Asignado a
                </h4>
                <p className="text-sm">{task.assignedToId}</p>
              </div>
            )}
          </div>

          <DialogFooter className="pt-4 border-t flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      {isEditDialogOpen && (
        <CreateEditTaskDialog
          task={task}
          onTaskSave={handleTaskSave}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}
    </>
  )
}
