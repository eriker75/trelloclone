"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TaskStatus } from "@/types"

interface KanbanColumnProps {
  status: TaskStatus
  tasksCount: number
  children: React.ReactNode
  isOver?: boolean
}

const statusConfig = {
  pending: {
    title: "Pendiente",
    bgClass: "kanban-column-todo",
    headerColor: "text-[hsl(var(--kanban-todo-text))]",
    addButtonClass:
      "border-[hsl(var(--kanban-todo-header))] text-[hsl(var(--kanban-todo-text))] hover:bg-[hsl(var(--kanban-todo-header))]/10",
  },
  "in-progress": {
    title: "En Progreso",
    bgClass: "kanban-column-progress",
    headerColor: "text-[hsl(var(--kanban-progress-text))]",
    addButtonClass:
      "border-[hsl(var(--kanban-progress-header))] text-[hsl(var(--kanban-progress-text))] hover:bg-[hsl(var(--kanban-progress-header))]/10",
  },
  "in-review": {
    title: "En Revisión",
    bgClass: "kanban-column-review",
    headerColor: "text-[hsl(var(--kanban-review-text))]",
    addButtonClass:
      "border-[hsl(var(--kanban-review-header))] text-[hsl(var(--kanban-review-text))] hover:bg-[hsl(var(--kanban-review-header))]/10",
  },
  completed: {
    title: "Completado",
    bgClass: "kanban-column-completed",
    headerColor: "text-[hsl(var(--kanban-completed-text))]",
    addButtonClass:
      "border-[hsl(var(--kanban-completed-header))] text-[hsl(var(--kanban-completed-text))] hover:bg-[hsl(var(--kanban-completed-header))]/10",
  },
}

export function KanbanColumn({ status, tasksCount, children, isOver = false }: KanbanColumnProps) {
  const config = statusConfig[status]

  // Fallback config if status is not found
  if (!config) {
    console.warn(`Unknown status: ${status}`)
    return (
      <Card className="w-80 flex-shrink-0 kanban-column-todo border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            {status}
            <span className="bg-white/20 text-xs px-2 py-1 rounded-full">{tasksCount}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">{children}</CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={`w-80 flex-shrink-0 ${config.bgClass} border-2 ${isOver ? "ring-2 ring-primary ring-opacity-50" : ""}`}
    >
      <CardHeader className="pb-3">
        <CardTitle className={`text-sm font-semibold flex items-center justify-between ${config.headerColor}`}>
          {config.title}
          <span className="bg-white/20 text-xs px-2 py-1 rounded-full">{tasksCount}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto kanban-scroll pr-1">{children}</div>
      </CardContent>
    </Card>
  )
}
