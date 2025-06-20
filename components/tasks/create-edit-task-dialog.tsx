"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, ImagePlus, X, Bold, Italic, List, Link } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Task, TaskStatus } from "@/types"

interface CreateEditTaskDialogProps {
  task?: Task
  triggerButton: React.ReactNode
  onTaskSave?: (task: Partial<Task> & { id?: string }) => void
  defaultStatus?: TaskStatus
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const mockTeamsForSelect = [
  "Diseño UX/UI",
  "Backend Devs",
  "Tech Writers",
  "Frontend Masters",
  "Product Team",
  "General",
]

const statuses: TaskStatus[] = ["Pendiente", "En Progreso", "Revisión", "Completada", "Cancelada"]
const priorities: Task["priority"][] = ["Baja", "Media", "Alta", "Urgente"]

export function CreateEditTaskDialog({
  task,
  triggerButton,
  onTaskSave,
  defaultStatus,
  open,
  onOpenChange,
}: CreateEditTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState(task?.title || "")
  const [description, setDescription] = useState(task?.description || "")
  const [dueDate, setDueDate] = useState<Date | undefined>(task?.dueDate ? new Date(task.dueDate) : undefined)
  const [status, setStatus] = useState<TaskStatus | undefined>(task?.status || defaultStatus)
  const [priority, setPriority] = useState<Task["priority"] | undefined>(task?.priority)
  const [assignedTeam, setAssignedTeam] = useState(task?.team || "")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(task?.imageUrl || null)

  // Handle controlled open state
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  // Handle open state changes
  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    if (onOpenChange) {
      onOpenChange(newOpen)
    }
  }

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || "")
      setDueDate(task.dueDate ? new Date(task.dueDate) : undefined)
      setStatus(task.status)
      setPriority(task.priority)
      setAssignedTeam(task.team || "")
      setImagePreview(task.imageUrl || null)
      setImageFile(null)
    } else {
      setTitle("")
      setDescription("")
      setDueDate(undefined)
      setStatus(defaultStatus)
      setPriority(undefined)
      setAssignedTeam("")
      setImagePreview(null)
      setImageFile(null)
    }
  }, [task, isOpen, defaultStatus])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const insertMarkdown = (syntax: string, placeholder = "") => {
    const textarea = document.getElementById("task-description") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = description.substring(start, end)
    const replacement = selectedText || placeholder

    let newText = ""
    if (syntax === "**") {
      newText = description.substring(0, start) + `**${replacement}**` + description.substring(end)
    } else if (syntax === "*") {
      newText = description.substring(0, start) + `*${replacement}*` + description.substring(end)
    } else if (syntax === "- ") {
      const lines = description.split("\n")
      const lineStart = description.lastIndexOf("\n", start - 1) + 1
      const lineEnd = description.indexOf("\n", end)
      const currentLine = description.substring(lineStart, lineEnd === -1 ? description.length : lineEnd)

      if (currentLine.trim().startsWith("- ")) {
        newText =
          description.substring(0, lineStart) +
          currentLine.replace(/^(\s*)- /, "$1") +
          description.substring(lineEnd === -1 ? description.length : lineEnd)
      } else {
        newText =
          description.substring(0, lineStart) +
          `- ${currentLine}` +
          description.substring(lineEnd === -1 ? description.length : lineEnd)
      }
    } else if (syntax === "[](") {
      newText =
        description.substring(0, start) + `[${replacement || "texto del enlace"}](url)` + description.substring(end)
    }

    setDescription(newText)

    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus()
      if (syntax === "**" || syntax === "*") {
        textarea.setSelectionRange(start + syntax.length, start + syntax.length + replacement.length)
      }
    }, 0)
  }

  const handleSubmit = () => {
    console.log("Form submitted with data:", {
      title,
      description,
      status,
      priority,
      assignedTeam,
      dueDate,
      imagePreview,
    })

    if (!title.trim()) {
      alert("Por favor, ingresa un título para la tarea")
      return
    }

    const taskData = {
      id: task?.id,
      title,
      description,
      dueDate: dueDate ? format(dueDate, "yyyy-MM-dd") : undefined,
      status,
      priority,
      team: assignedTeam,
      imageUrl: imagePreview,
    }

    if (onTaskSave) {
      onTaskSave(taskData as Partial<Task> & { id?: string })
    }
    handleOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? "Editar Tarea" : "Crear Nueva Tarea"}</DialogTitle>
          <DialogDescription>
            {task ? "Modifica los detalles de la tarea." : "Completa la información para crear una nueva tarea."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="task-title">Título *</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Revisar diseño de la app"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task-description">Descripción</Label>
            <div className="space-y-2">
              <div className="flex gap-1 p-2 border rounded-md bg-muted/50">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown("**", "texto en negrita")}
                  className="h-8 w-8 p-0"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown("*", "texto en cursiva")}
                  className="h-8 w-8 p-0"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown("- ", "")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown("[](", "")}
                  className="h-8 w-8 p-0"
                >
                  <Link className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                id="task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Añade más detalles sobre la tarea... 

Puedes usar markdown:
**negrita**, *cursiva*, - listas, [enlaces](url)"
                className="min-h-[120px] resize-none"
              />
              <div className="text-xs text-muted-foreground">
                Soporta formato Markdown: **negrita**, *cursiva*, - listas, [enlaces](url)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="task-due-date">Fecha Límite</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus locale={es} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-status">Estado</Label>
              <Select value={status} onValueChange={(value: TaskStatus) => setStatus(value)}>
                <SelectTrigger id="task-status">
                  <SelectValue placeholder="Selecciona estado" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="task-priority">Prioridad</Label>
              <Select value={priority} onValueChange={(value: Task["priority"]) => setPriority(value)}>
                <SelectTrigger id="task-priority">
                  <SelectValue placeholder="Selecciona prioridad" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-team">Asignar a Equipo</Label>
              <Select value={assignedTeam} onValueChange={setAssignedTeam}>
                <SelectTrigger id="task-team">
                  <SelectValue placeholder="Selecciona equipo" />
                </SelectTrigger>
                <SelectContent>
                  {mockTeamsForSelect.map((team) => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task-image">Imagen (Opcional)</Label>
            <Input id="task-image" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <Button variant="outline" asChild className="cursor-pointer">
              <label htmlFor="task-image" className="flex items-center gap-2">
                <ImagePlus className="h-4 w-4" /> Subir Imagen
              </label>
            </Button>
            {imagePreview && (
              <div className="relative mt-2">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Vista previa"
                  className="max-h-40 w-full object-cover rounded-md border"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>
            {task ? "Guardar Cambios" : "Crear Tarea"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
