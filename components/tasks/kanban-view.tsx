"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"
import { KanbanColumn } from "./kanban-column"
import { TaskDetailsModal } from "./task-details-modal"
import type { Task, TaskStatus } from "@/types"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { CreateEditTaskDialog } from "./create-edit-task-dialog"
import { SortableKanbanCard } from "./sortable-kanban-card"

interface KanbanViewProps {
  initialTasks: Task[]
  onUpdateTask: (task: Partial<Task> & { id: string }) => void
  onDeleteTask: (taskId: string) => void
  onCreateTask: (task: Omit<Task, "id" | "createdAt" | "timeSpent" | "timerActive">) => void
}

const taskStatuses: TaskStatus[] = ["pending", "in-progress", "in-review", "completed"]

// Droppable Column Component
function DroppableColumn({
  status,
  children,
  tasksCount,
}: {
  status: TaskStatus
  children: React.ReactNode
  tasksCount: number
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${status}`,
  })

  return (
    <div ref={setNodeRef} className="h-full">
      <KanbanColumn status={status} tasksCount={tasksCount} isOver={isOver}>
        {children}
      </KanbanColumn>
    </div>
  )
}

export function KanbanView({ initialTasks, onUpdateTask, onDeleteTask, onCreateTask }: KanbanViewProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<Task | null>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  // Update local tasks when initialTasks changes
  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      console.log("Drag started for task:", event.active.id)
      const task = tasks.find((t) => t.id === event.active.id)
      if (task) {
        setActiveTask(task)
      }
    },
    [tasks],
  )

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event
      if (!over || !activeTask) return

      const overId = over.id.toString()

      // Check if we're over a column
      if (overId.startsWith("column-")) {
        const newStatus = overId.replace("column-", "") as TaskStatus

        // Only update if status is different
        if (activeTask.status !== newStatus) {
          setTasks((currentTasks) =>
            currentTasks.map((task) => (task.id === active.id ? { ...task, status: newStatus } : task)),
          )
        }
      }
    },
    [activeTask],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      console.log("Drag ended")
      const { active, over } = event

      if (!over || !activeTask) {
        setActiveTask(null)
        return
      }

      const overId = over.id.toString()
      let finalStatus = activeTask.status

      // Determine final status
      if (overId.startsWith("column-")) {
        finalStatus = overId.replace("column-", "") as TaskStatus
      } else {
        // If dropped on a task, use that task's status
        const targetTask = tasks.find((t) => t.id === overId)
        if (targetTask) {
          finalStatus = targetTask.status
        }
      }

      // Update task if status changed
      if (activeTask.status !== finalStatus) {
        console.log(`Moving task from ${activeTask.status} to ${finalStatus}`)
        const updatedTask = { ...activeTask, status: finalStatus }
        onUpdateTask(updatedTask)
      }

      setActiveTask(null)
    },
    [activeTask, tasks, onUpdateTask],
  )

  const openTaskDetailsModal = useCallback((task: Task) => {
    console.log("Opening modal for task:", task.title)
    setSelectedTaskForModal(task)
    setIsTaskModalOpen(true)
  }, [])

  const handleTaskUpdate = useCallback(
    (updatedTask: Partial<Task> & { id: string }) => {
      setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? { ...task, ...updatedTask } : task)))
      onUpdateTask(updatedTask)
    },
    [onUpdateTask],
  )

  const getTasksByStatus = useCallback(
    (status: TaskStatus) => {
      return tasks.filter((task) => task.status === status)
    },
    [tasks],
  )

  return (
    <div className="h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Main Kanban Container with proper overflow handling */}
        <div className="flex gap-6 h-[calc(100vh-280px)] min-h-[600px] overflow-x-auto overflow-y-hidden pb-4">
          {taskStatuses.map((status) => {
            const statusTasks = getTasksByStatus(status)

            return (
              <div key={status} className="flex-shrink-0 w-80 h-full">
                <DroppableColumn status={status} tasksCount={statusTasks.length}>
                  <SortableContext items={statusTasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col gap-3 h-full overflow-y-auto pr-2 pb-4">
                      {statusTasks.map((task) => (
                        <SortableKanbanCard
                          key={task.id}
                          task={task}
                          onUpdateTask={handleTaskUpdate}
                          onDeleteTask={onDeleteTask}
                          onOpenTaskDetails={openTaskDetailsModal}
                        />
                      ))}

                      {/* Add Task Button for each column */}
                      <CreateEditTaskDialog
                        onTaskSave={(newTaskData) => onCreateTask({ ...newTaskData, status })}
                        triggerButton={
                          <Button
                            variant="ghost"
                            className="w-full h-12 border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Añadir tarea
                          </Button>
                        }
                        defaultStatus={status}
                      />
                    </div>
                  </SortableContext>
                </DroppableColumn>
              </div>
            )
          })}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask ? (
            <div className="rotate-3 opacity-90">
              <SortableKanbanCard
                task={activeTask}
                onUpdateTask={() => {}}
                onDeleteTask={() => {}}
                onOpenTaskDetails={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Details Modal */}
      {selectedTaskForModal && (
        <TaskDetailsModal
          task={selectedTaskForModal}
          isOpen={isTaskModalOpen}
          onOpenChange={setIsTaskModalOpen}
          onUpdateTask={handleTaskUpdate}
          onDeleteTask={onDeleteTask}
        />
      )}
    </div>
  )
}
