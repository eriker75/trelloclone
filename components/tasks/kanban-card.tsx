"use client"

import type React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Calendar, MessageSquare, Paperclip, ImageIcon, Timer, Play, Pause, GripVertical } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { Task } from "@/types"
import { cn, formatTime } from "@/lib/utils"

interface KanbanCardProps {
  task: Task
  onUpdateTask: (task: Partial<Task> & { id: string }) => void
  onDeleteTask: (taskId: string) => void
  onOpenTaskDetails: (task: Task) => void
}

const priorityColors = {
  Baja: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Media: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Alta: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  Urgente: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
}

export function KanbanCard({ task, onUpdateTask, onDeleteTask, onOpenTaskDetails }: KanbanCardProps) {
  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
    })
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent modal opening when dragging
    if (isDragging) {
      return
    }

    // Prevent modal opening when clicking on interactive elements
    const target = e.target as HTMLElement
    if (target.closest('button, [data-drag-handle="true"]')) {
      return
    }

    console.log("Opening modal for task:", task.title)
    onOpenTaskDetails(task)
  }

  const handleToggleTimer = (e: React.MouseEvent) => {
    e.stopPropagation()

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("relative group", isDragging && "opacity-50 rotate-3 shadow-lg z-50")}
    >
      <Card
        className="trello-card cursor-pointer border-l-4 border-l-primary/60 hover:border-l-primary transition-all duration-200 hover:shadow-md"
        onClick={handleCardClick}
      >
        <CardContent className="p-4 space-y-3">
          {/* Task Image */}
          {task.imageUrl && (
            <div className="relative w-full h-32 rounded-md overflow-hidden bg-muted">
              <img
                src={task.imageUrl || "/placeholder.svg"}
                alt="Task attachment"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                <ImageIcon className="h-3 w-3 text-white" />
              </div>
            </div>
          )}

          {/* Title */}
          <h3 className="font-medium text-sm leading-tight text-card-foreground group-hover:text-primary transition-colors">
            {task.title}
          </h3>

          {/* Description Preview */}
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description.replace(/[#*`_~]/g, "").substring(0, 80)}...
            </p>
          )}

          {/* Priority Badge */}
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className={`text-xs ${priorityColors[task.priority]}`}>
              {task.priority}
            </Badge>
          </div>

          {/* Timer Section */}
          <div className="flex items-center justify-between">
            <div className={cn("flex items-center gap-1.5 text-xs", task.timerActive && "text-primary")}>
              <Timer className={cn("h-3 w-3", task.timerActive && "animate-pulse")} />
              <span className="font-mono font-medium tabular-nums">{formatTime(task.timeSpent)}</span>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-primary/10" onClick={handleToggleTimer}>
              {task.timerActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </Button>
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}

          {/* Bottom Row - Assignee and Indicators */}
          <div className="flex items-center justify-between">
            {/* Assignee */}
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={`/placeholder-user.png`} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {task.assignedToId?.split("").slice(0, 2).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground truncate max-w-20">{task.assignedToId}</span>
            </div>

            {/* Indicators */}
            <div className="flex items-center gap-1">
              {task.description && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageSquare className="h-3 w-3" />
                  <span className="text-xs">1</span>
                </div>
              )}
              {task.imageUrl && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Paperclip className="h-3 w-3" />
                  <span className="text-xs">1</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drag Handle - Bottom Right Corner */}
      <DragHandle />
    </div>
  )
}

// Separate Drag Handle Component
function DragHandle() {
  const { attributes, listeners } = useSortable({
    id: "drag-handle", // This will be overridden by the parent
  })

  return (
    <div
      data-drag-handle="true"
      className="absolute bottom-2 right-2 p-2 rounded-md cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-muted/80 bg-background/90 border border-border/50 shadow-sm"
      {...attributes}
      {...listeners}
      onClick={(e) => e.stopPropagation()}
      title="Drag to move task"
    >
      <GripVertical className="h-4 w-4 text-muted-foreground" />
    </div>
  )
}
