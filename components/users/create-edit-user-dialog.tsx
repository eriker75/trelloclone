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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ImagePlus, PlusCircle, X } from "lucide-react"
import type { UserProfile, Project, ParticipantRole, UserAssignedProject } from "@/types"
import { useToast } from "@/components/ui/use-toast"

interface CreateEditUserDialogProps {
  user?: UserProfile
  allProjects: Project[] // To populate project selection
  triggerButton: React.ReactNode
  onUserSave: (userData: Partial<UserProfile> & { id?: string }) => void
}

export function CreateEditUserDialog({ user, allProjects, triggerButton, onUserSave }: CreateEditUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [assignedProjects, setAssignedProjects] = useState<UserAssignedProject[]>([])

  const { toast } = useToast()

  useEffect(() => {
    if (user && isOpen) {
      setName(user.name)
      setEmail(user.email)
      setJobTitle(user.jobTitle || "")
      setAvatarUrl(user.avatarUrl)
      setAvatarPreview(user.avatarUrl || null)
      setAssignedProjects(user.assignedProjects || [])
    } else if (!user && isOpen) {
      // Reset for new user
      setName("")
      setEmail("")
      setJobTitle("")
      setAvatarUrl(undefined)
      setAvatarPreview(null)
      setAssignedProjects([])
    }
  }, [user, isOpen])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
        setAvatarUrl(reader.result as string) // Simulating upload by using data URL
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddProjectAssignment = () => {
    setAssignedProjects([...assignedProjects, { projectId: "", role: "Miembro" }])
  }

  const handleRemoveProjectAssignment = (index: number) => {
    setAssignedProjects(assignedProjects.filter((_, i) => i !== index))
  }

  const handleProjectAssignmentChange = (index: number, field: "projectId" | "role", value: string) => {
    const updatedAssignments = [...assignedProjects]
    if (field === "projectId") {
      updatedAssignments[index].projectId = value
    } else {
      updatedAssignments[index].role = value as ParticipantRole
    }
    setAssignedProjects(updatedAssignments)
  }

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Error de validación",
        description: "El nombre y el email son obligatorios.",
        variant: "destructive",
      })
      return
    }

    const userData: Partial<UserProfile> & { id?: string } = {
      id: user?.id,
      name,
      email,
      jobTitle: jobTitle.trim() || undefined,
      avatarUrl,
      assignedProjects: assignedProjects.filter((p) => p.projectId), // Only save assignments with a project
      role: user?.role || "user", // Preserve existing system role or default to 'user'
      createdAt: user?.createdAt || new Date().toISOString().split("T")[0],
    }
    onUserSave(userData)
    setIsOpen(false)
  }

  const availableRoles: ParticipantRole[] = ["Miembro", "Manager"]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{user ? "Editar Usuario" : "Añadir Nuevo Usuario"}</DialogTitle>
          <DialogDescription>
            {user ? "Modifica los detalles del usuario." : "Completa la información para crear un nuevo usuario."}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-1 pr-3">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="user-name">Nombre Completo</Label>
              <Input
                id="user-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Ada Lovelace"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@dominio.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-job-title">Puesto de Trabajo (Ej: Desarrollador Backend)</Label>
              <Input
                id="user-job-title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="UX/UI Designer"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-avatar-input">Avatar (Opcional)</Label>
              <Input
                id="user-avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <Button variant="outline" asChild className="cursor-pointer w-full">
                <label htmlFor="user-avatar-input" className="flex items-center gap-2">
                  <ImagePlus className="h-4 w-4" /> Subir Imagen
                </label>
              </Button>
              {avatarPreview && (
                <div className="mt-2 flex justify-center">
                  <img
                    src={avatarPreview || "/placeholder.svg"}
                    alt="Vista previa del avatar"
                    className="h-20 w-20 rounded-full object-cover border"
                  />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label>Proyectos Asignados</Label>
              {assignedProjects.map((assignment, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-2 p-3 border rounded-md">
                  <div className="flex-1 grid gap-2">
                    <Label htmlFor={`project-select-${index}`} className="text-xs">
                      Proyecto
                    </Label>
                    <Select
                      value={assignment.projectId}
                      onValueChange={(value) => handleProjectAssignmentChange(index, "projectId", value)}
                    >
                      <SelectTrigger id={`project-select-${index}`}>
                        <SelectValue placeholder="Seleccionar proyecto" />
                      </SelectTrigger>
                      <SelectContent>
                        {allProjects.map((proj) => (
                          <SelectItem key={proj.id} value={proj.id}>
                            {proj.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 grid gap-2">
                    <Label htmlFor={`role-select-${index}`} className="text-xs">
                      Rol en Proyecto
                    </Label>
                    <Select
                      value={assignment.role}
                      onValueChange={(value) => handleProjectAssignmentChange(index, "role", value)}
                    >
                      <SelectTrigger id={`role-select-${index}`}>
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveProjectAssignment(index)}
                    className="mt-auto sm:mt-5" // Adjust alignment
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Eliminar asignación</span>
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={handleAddProjectAssignment}>
                <PlusCircle className="mr-2 h-4 w-4" /> Asignar a Proyecto
              </Button>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>
            {user ? "Guardar Cambios" : "Crear Usuario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
