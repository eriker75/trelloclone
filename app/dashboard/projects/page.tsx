"use client"

import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import type { Project, ProjectParticipant, ParticipantRole, UserProfile, Task } from "@/types"
import React from "react"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  PlusCircle,
  UserPlus,
  Settings2,
  MoreVertical,
  Trash2,
  ShieldCheck,
  UserCircle,
  ImagePlus,
  X,
  Search,
  BarChart3,
} from "lucide-react"
import { ConfirmDeleteDialog } from "@/components/teams/confirm-delete-dialog"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"

// Mock data for users (needed for creator names and participant details)
const mockUsersData: UserProfile[] = [
  {
    id: "user-1",
    name: "Ana Pérez",
    email: "ana@example.com",
    role: "admin",
    assignedProjects: [],
    createdAt: "2023-01-01",
    avatarUrl: "/placeholder-user.png",
    phoneNumber: "555-1111",
    jobTitle: "Diseñadora UX/UI",
  },
  {
    id: "user-2",
    name: "Carlos López",
    email: "carlos@example.com",
    role: "user",
    assignedProjects: [],
    createdAt: "2023-01-02",
    avatarUrl: "/placeholder-user.png",
    phoneNumber: "555-2222",
    jobTitle: "Desarrollador Frontend",
  },
  {
    id: "user-3",
    name: "Sofía Ramírez",
    email: "sofia@example.com",
    role: "user",
    assignedProjects: [],
    createdAt: "2023-01-03",
    avatarUrl: "/placeholder-user.png",
    phoneNumber: "555-3333",
    jobTitle: "Especialista en Marketing",
  },
  {
    id: "user-4",
    name: "David Chen",
    email: "david@example.com",
    role: "user",
    assignedProjects: [],
    createdAt: "2023-01-04",
    avatarUrl: "/placeholder-user.png",
    phoneNumber: "555-4444",
    jobTitle: "Ingeniero DevOps",
  },
  {
    id: "user-5",
    name: "Elena Petrova",
    email: "elena@example.com",
    role: "user",
    assignedProjects: [],
    createdAt: "2023-01-05",
    avatarUrl: "/placeholder-user.png",
    phoneNumber: "555-5555",
    jobTitle: "Product Manager",
  },
  {
    id: "user-current",
    name: "Usuario Actual (Tú)",
    email: "currentuser@example.com",
    role: "admin",
    assignedProjects: [],
    createdAt: "2023-01-06",
    avatarUrl: "/placeholder-user.png",
    phoneNumber: "555-0000",
    jobTitle: "Administrador",
  },
]

const initialMockProjectsData: Project[] = [
  {
    id: "proj-1",
    name: "Rediseño Web Corporativo",
    description: "Modernización completa del sitio web corporativo con nuevas funcionalidades y diseño responsive.",
    creatorId: "user-1",
    avatarUrl: "/placeholder-team-marketing.png",
    participants: [
      { userId: "user-1", role: "Creador" },
      { userId: "user-4", role: "Manager" },
      { userId: "user-current", role: "Miembro" },
    ],
    createdAt: "2024-01-10",
    status: "Activo",
    dueDate: "2024-12-31",
    progress: 65,
    budgetAllocated: 50000,
    budgetSpent: 32500,
  },
  {
    id: "proj-2",
    name: "Lanzamiento App Móvil V2",
    description: "Segunda versión de nuestra aplicación móvil con nuevas características y mejoras de rendimiento.",
    creatorId: "user-2",
    avatarUrl: "/placeholder-team-2.png",
    participants: [
      { userId: "user-2", role: "Creador" },
      { userId: "user-5", role: "Manager" },
    ],
    createdAt: "2024-02-15",
    status: "Activo",
    dueDate: "2024-11-30",
    progress: 40,
    budgetAllocated: 75000,
    budgetSpent: 25000,
  },
  {
    id: "proj-3",
    name: "Campaña Marketing Q3",
    description: "Estrategia de marketing digital para el tercer trimestre del año.",
    creatorId: "user-3",
    avatarUrl: "/placeholder-team-product.png",
    participants: [{ userId: "user-3", role: "Creador" }],
    createdAt: "2024-03-05",
    status: "Completado",
    dueDate: "2024-09-30",
    progress: 100,
    budgetAllocated: 20000,
    budgetSpent: 19500,
  },
  {
    id: "proj-4",
    name: "Migración a AWS",
    description: "Migración de toda la infraestructura a Amazon Web Services.",
    creatorId: "user-4",
    avatarUrl: "/placeholder-team-1.png",
    participants: [{ userId: "user-4", role: "Creador" }],
    createdAt: "2024-04-10",
    status: "Pausado",
    dueDate: "2024-10-15",
    progress: 25,
    budgetAllocated: 100000,
    budgetSpent: 15000,
  },
  {
    id: "proj-5",
    name: "Sistema de Diseño Interno",
    description: "Desarrollo de un sistema de diseño unificado para todos los productos.",
    creatorId: "user-5",
    avatarUrl: "/placeholder-team-3.png",
    participants: [{ userId: "user-5", role: "Creador" }],
    createdAt: "2024-05-12",
    status: "Activo",
    dueDate: "2024-08-30",
    progress: 80,
    budgetAllocated: 30000,
    budgetSpent: 28000,
  },
  {
    id: "proj-6",
    name: "Integración API de Pagos",
    description: "Implementación de nuevos métodos de pago y mejoras en el sistema de facturación.",
    creatorId: "user-1",
    avatarUrl: "/placeholder-team-marketing.png",
    participants: [{ userId: "user-1", role: "Creador" }],
    createdAt: "2024-06-01",
    status: "Activo",
    dueDate: "2024-07-31",
    progress: 15,
    budgetAllocated: 15000,
    budgetSpent: 5000,
  },
]

const initialMockTasksData: Task[] = [
  {
    id: "task-1",
    title: "Diseñar wireframes para la página de inicio",
    description: "Crear los wireframes de baja fidelidad para la nueva página de inicio del sitio web corporativo.",
    status: "Completado",
    priority: "Alta",
    dueDate: "2024-01-15",
    teamId: "proj-1", // Mapped to project ID
    assignedToId: "user-1",
    timeSpentHours: 8,
    estimatedHours: 10,
    createdAt: "2024-01-10",
  },
  {
    id: "task-2",
    title: "Desarrollar componente de navegación",
    description: "Implementar el componente de navegación principal utilizando React y Tailwind CSS.",
    status: "En Progreso",
    priority: "Alta",
    dueDate: "2024-01-20",
    teamId: "proj-1",
    assignedToId: "user-2",
    timeSpentHours: 12,
    estimatedHours: 16,
    createdAt: "2024-01-12",
  },
  {
    id: "task-3",
    title: "Investigación de mercado para nuevas características",
    description:
      "Realizar encuestas y análisis de la competencia para identificar posibles nuevas características para la App Móvil V2.",
    status: "Pendiente",
    priority: "Media",
    dueDate: "2024-02-20",
    teamId: "proj-2",
    assignedToId: "user-5",
    timeSpentHours: 0,
    estimatedHours: 20,
    createdAt: "2024-02-16",
  },
  {
    id: "task-4",
    title: "Configurar entorno de despliegue en AWS",
    description: "Preparar los servicios de EC2 y S3 para la migración de la infraestructura.",
    status: "Bloqueado",
    priority: "Urgente",
    dueDate: "2024-04-15",
    teamId: "proj-4",
    assignedToId: "user-4",
    timeSpentHours: 5,
    estimatedHours: 24,
    createdAt: "2024-04-11",
  },
  {
    id: "task-5",
    title: "Revisar diseños de interfaz de usuario",
    description: "Revisar los mockups de alta fidelidad para el sistema de diseño interno y proporcionar feedback.",
    status: "Revisión",
    priority: "Media",
    dueDate: "2024-05-20",
    teamId: "proj-5",
    assignedToId: "user-1",
    timeSpentHours: 3,
    estimatedHours: 5,
    createdAt: "2024-05-15",
  },
  {
    id: "task-6",
    title: "Integrar pasarela de pago Stripe",
    description: "Conectar la aplicación con la API de Stripe para procesar pagos con tarjeta de crédito.",
    status: "En Progreso",
    priority: "Alta",
    dueDate: "2024-07-10",
    teamId: "proj-6",
    assignedToId: "user-2",
    timeSpentHours: 10,
    estimatedHours: 15,
    createdAt: "2024-06-05",
  },
  {
    id: "task-7",
    title: "Crear contenido para redes sociales",
    description: "Desarrollar publicaciones y creativos para la campaña de marketing del Q3.",
    status: "Completado",
    priority: "Baja",
    dueDate: "2024-03-20",
    teamId: "proj-3",
    assignedToId: "user-3",
    timeSpentHours: 6,
    estimatedHours: 8,
    createdAt: "2024-03-10",
  },
  {
    id: "task-8",
    title: "Pruebas de regresión App Móvil V2",
    description: "Ejecutar un conjunto completo de pruebas de regresión antes del lanzamiento de la V2.",
    status: "Pendiente",
    priority: "Urgente",
    dueDate: "2024-11-25",
    teamId: "proj-2",
    assignedToId: "user-current",
    timeSpentHours: 0,
    estimatedHours: 30,
    createdAt: "2024-11-01",
  },
  {
    id: "task-9",
    title: "Optimizar base de datos",
    description:
      "Revisar y optimizar las consultas de la base de datos para mejorar el rendimiento general del sistema.",
    status: "En Progreso",
    priority: "Media",
    dueDate: "2024-08-15",
    teamId: "proj-1",
    assignedToId: "user-4",
    timeSpentHours: 7,
    estimatedHours: 12,
    createdAt: "2024-07-20",
  },
  {
    id: "task-10",
    title: "Documentar API de autenticación",
    description:
      "Crear documentación detallada para los endpoints de la API de autenticación para desarrolladores externos.",
    status: "Revisión",
    priority: "Baja",
    dueDate: "2024-06-30",
    teamId: "proj-5",
    assignedToId: "user-5",
    timeSpentHours: 4,
    estimatedHours: 6,
    createdAt: "2024-06-25",
  },
  {
    id: "task-11",
    title: "Planificación de sprint para Q4",
    description: "Sesión de planificación para definir los objetivos y tareas del próximo sprint del cuarto trimestre.",
    status: "Pendiente",
    priority: "Alta",
    dueDate: "2024-10-01",
    teamId: "proj-3",
    assignedToId: "user-current",
    timeSpentHours: 0,
    estimatedHours: 4,
    createdAt: "2024-09-20",
  },
  {
    id: "task-12",
    title: "Auditoría de seguridad de la infraestructura",
    description: "Realizar una auditoría de seguridad exhaustiva en toda la infraestructura de la nube.",
    status: "Bloqueado",
    priority: "Urgente",
    dueDate: "2024-09-01",
    teamId: "proj-4",
    assignedToId: "user-4",
    timeSpentHours: 0,
    estimatedHours: 40,
    createdAt: "2024-08-25",
  },
  // More tasks for proj-1 to make charts more interesting
  {
    id: "task-13",
    title: "Implementar sección de testimonios",
    description: "Añadir una nueva sección de testimonios de clientes al sitio web.",
    status: "Pendiente",
    priority: "Media",
    dueDate: "2024-02-28",
    teamId: "proj-1",
    assignedToId: "user-1",
    timeSpentHours: 0,
    estimatedHours: 8,
    createdAt: "2024-02-10",
  },
  {
    id: "task-14",
    title: "Pruebas de usabilidad del nuevo diseño",
    description: "Realizar pruebas con usuarios reales para evaluar la usabilidad del rediseño.",
    status: "En Progreso",
    priority: "Alta",
    dueDate: "2024-03-15",
    teamId: "proj-1",
    assignedToId: "user-current",
    timeSpentHours: 5,
    estimatedHours: 20,
    createdAt: "2024-03-01",
  },
]

const PROJECTS_PER_PAGE = 3
const CURRENT_USER_ID = "user-current"

export default function ProjectsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [projects, setProjects] = useState(initialMockProjectsData)
  const [allUsers, setAllUsers] = useState(mockUsersData)
  const [searchQuery, setSearchQuery] = useState("")

  const [currentPage, setCurrentPage] = useState(1)

  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] = useState(false)
  const [isManageParticipantsDialogOpen, setIsManageParticipantsDialogOpen] = useState(false)

  const [currentManagingProject, setCurrentManagingProject] = useState<Project | null>(null)

  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectImageFile, setNewProjectImageFile] = useState<File | null>(null)
  const [newProjectImagePreview, setNewProjectImagePreview] = useState<string | null>(null)
  const [newProjectMemberEmails, setNewProjectMemberEmails] = useState<string[]>([""])
  const [newProjectManagerEmails, setNewProjectManagerEmails] = useState<string[]>([""])

  // State for adding new participants in the manage dialog
  const [additionalManagerEmails, setAdditionalManagerEmails] = useState<string[]>([""])
  const [additionalMemberEmails, setAdditionalMemberEmails] = useState<string[]>([""])

  // Filter projects based on search query
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects
    return projects.filter((project) => project.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [projects, searchQuery])

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE
  const endIndex = startIndex + PROJECTS_PER_PAGE
  const currentDisplayProjects = filteredProjects.slice(startIndex, endIndex)

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const getProjectCreatorName = (creatorId: string) => {
    return allUsers.find((u) => u.id === creatorId)?.name || "Desconocido"
  }

  const getParticipantDetails = (userId: string): Pick<UserProfile, "name" | "email" | "avatarUrl"> => {
    const user = allUsers.find((u) => u.id === userId)
    return {
      name: user?.name || "Usuario Desconocido",
      email: user?.email || "email@desconocido.com",
      avatarUrl: user?.avatarUrl,
    }
  }

  const handleNewProjectImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setNewProjectImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setNewProjectImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setNewProjectImageFile(null)
      setNewProjectImagePreview(null)
    }
  }

  const addEmailInput = (type: "member" | "manager", listType: "create" | "manage") => {
    if (listType === "create") {
      if (type === "member") setNewProjectMemberEmails([...newProjectMemberEmails, ""])
      else setNewProjectManagerEmails([...newProjectManagerEmails, ""])
    } else {
      // manage
      if (type === "member") setAdditionalMemberEmails([...additionalMemberEmails, ""])
      else setAdditionalManagerEmails([...additionalManagerEmails, ""])
    }
  }

  const removeEmailInput = (type: "member" | "manager", index: number, listType: "create" | "manage") => {
    if (listType === "create") {
      if (type === "member") {
        setNewProjectMemberEmails(
          newProjectMemberEmails.length > 1 ? newProjectMemberEmails.filter((_, i) => i !== index) : [""],
        )
      } else {
        setNewProjectManagerEmails(
          newProjectManagerEmails.length > 1 ? newProjectManagerEmails.filter((_, i) => i !== index) : [""],
        )
      }
    } else {
      // manage
      if (type === "member") {
        setAdditionalMemberEmails(
          additionalMemberEmails.length > 1 ? additionalMemberEmails.filter((_, i) => i !== index) : [""],
        )
      } else {
        setAdditionalManagerEmails(
          additionalManagerEmails.length > 1 ? additionalManagerEmails.filter((_, i) => i !== index) : [""],
        )
      }
    }
  }

  const handleEmailInputChange = (
    type: "member" | "manager",
    index: number,
    value: string,
    listType: "create" | "manage",
  ) => {
    if (listType === "create") {
      if (type === "member") {
        const updatedEmails = [...newProjectMemberEmails]
        updatedEmails[index] = value
        setNewProjectMemberEmails(updatedEmails)
      } else {
        const updatedEmails = [...newProjectManagerEmails]
        updatedEmails[index] = value
        setNewProjectManagerEmails(updatedEmails)
      }
    } else {
      // manage
      if (type === "member") {
        const updatedEmails = [...additionalMemberEmails]
        updatedEmails[index] = value
        setAdditionalMemberEmails(updatedEmails)
      } else {
        const updatedEmails = [...additionalManagerEmails]
        updatedEmails[index] = value
        setAdditionalManagerEmails(updatedEmails)
      }
    }
  }

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast({ title: "Error", description: "El nombre del proyecto es obligatorio.", variant: "destructive" })
      return
    }

    const managerEmails = newProjectManagerEmails.map((e) => e.trim()).filter(Boolean)
    if (managerEmails.length === 0 && !managerEmails.includes(allUsers.find((u) => u.id === CURRENT_USER_ID)!.email)) {
      toast({
        title: "Error",
        description: "Debe haber al menos un manager (puede ser tu propio email).",
        variant: "destructive",
      })
      return
    }

    const newProjectId = `proj-${Date.now()}`
    const newParticipants: ProjectParticipant[] = []

    // Add creator
    newParticipants.push({ userId: CURRENT_USER_ID, role: "Creador" })

    managerEmails.forEach((email) => {
      const existingUser = allUsers.find((u) => u.email === email)
      const userId = existingUser ? existingUser.id : `newUser-${email.replace(/@.*/, "")}`
      if (!existingUser) {
        /* Potentially create new user stub or invite */
      }
      if (userId !== CURRENT_USER_ID) {
        // Avoid duplicate if creator is also listed as manager
        if (!newParticipants.find((p) => p.userId === userId)) {
          newParticipants.push({ userId, role: "Manager" })
        } else {
          // If already added (e.g. as creator), ensure role is Manager if specified
          const pIndex = newParticipants.findIndex((p) => p.userId === userId)
          if (newParticipants[pIndex].role !== "Creador") newParticipants[pIndex].role = "Manager"
        }
      }
    })

    newProjectMemberEmails
      .map((e) => e.trim())
      .filter(Boolean)
      .forEach((email) => {
        const existingUser = allUsers.find((u) => u.email === email)
        const userId = existingUser ? existingUser.id : `newUser-${email.replace(/@.*/, "")}`
        if (!existingUser) {
          /* Potentially create new user stub or invite */
        }
        if (!newParticipants.find((p) => p.userId === userId)) {
          // Only add if not already a creator or manager
          newParticipants.push({ userId, role: "Miembro" })
        }
      })

    const uniqueParticipants = Array.from(new Map(newParticipants.map((p) => [p.userId, p])).values())

    const newProjectData: Project = {
      id: newProjectId,
      name: newProjectName,
      description: "Descripción del nuevo proyecto...", // Default description
      creatorId: CURRENT_USER_ID,
      avatarUrl: newProjectImagePreview || `/placeholder.svg?query=${newProjectName}`,
      participants: uniqueParticipants,
      createdAt: new Date().toISOString().split("T")[0],
      status: "Activo",
      progress: 0,
      budgetAllocated: 10000, // Default budget
      budgetSpent: 0,
    }

    setProjects((prev) => [...prev, newProjectData])
    // Also update the UserProfile for each participant
    uniqueParticipants.forEach((participant) => {
      setAllUsers((prevUsers) =>
        prevUsers.map((u) => {
          if (u.id === participant.userId) {
            const existingAssignment = u.assignedProjects.find((ap) => ap.projectId === newProjectId)
            if (existingAssignment) {
              existingAssignment.role = participant.role // Update role if already assigned
              return u
            }
            return {
              ...u,
              assignedProjects: [...u.assignedProjects, { projectId: newProjectId, role: participant.role }],
            }
          }
          return u
        }),
      )
    })

    toast({ title: "Proyecto Creado", description: `El proyecto "${newProjectName}" ha sido creado.` })
    resetCreateProjectFormAndCloseDialog()
  }

  const resetCreateProjectFormAndCloseDialog = () => {
    setNewProjectName("")
    setNewProjectImageFile(null)
    setNewProjectImagePreview(null)
    setNewProjectMemberEmails([""])
    setNewProjectManagerEmails([""])
    setIsCreateProjectDialogOpen(false)
  }

  const handleOpenManageParticipantsDialog = (project: Project) => {
    setCurrentManagingProject(project)
    setAdditionalManagerEmails([""]) // Reset for new additions
    setAdditionalMemberEmails([""]) // Reset for new additions
    setIsManageParticipantsDialogOpen(true)
  }

  const handleSaveParticipantsChanges = () => {
    if (!currentManagingProject) return

    const updatedParticipants = [...currentManagingProject.participants]

    // Process additional managers
    additionalManagerEmails
      .map((e) => e.trim())
      .filter(Boolean)
      .forEach((email) => {
        const existingUser = allUsers.find((u) => u.email === email)
        const userId = existingUser ? existingUser.id : `newUser-${email.replace(/@.*/, "")}-${Date.now()}`
        if (!existingUser) {
          /* Logic to handle/invite new user */
          const newUserStub: UserProfile = {
            id: userId,
            name: email.split("@")[0],
            email,
            role: "user",
            assignedProjects: [],
            createdAt: new Date().toISOString().split("T")[0],
          }
          setAllUsers((prev) => [...prev, newUserStub])
        }
        if (!updatedParticipants.find((p) => p.userId === userId)) {
          updatedParticipants.push({ userId, role: "Manager" })
        } else {
          // User exists, ensure role is Manager or Creator
          const pIndex = updatedParticipants.findIndex((p) => p.userId === userId)
          if (updatedParticipants[pIndex].role !== "Creador") {
            updatedParticipants[pIndex].role = "Manager"
          }
        }
      })

    // Process additional members
    additionalMemberEmails
      .map((e) => e.trim())
      .filter(Boolean)
      .forEach((email) => {
        const existingUser = allUsers.find((u) => u.email === email)
        const userId = existingUser ? existingUser.id : `newUser-${email.replace(/@.*/, "")}-${Date.now()}`
        if (!existingUser) {
          /* Logic to handle/invite new user */
          const newUserStub: UserProfile = {
            id: userId,
            name: email.split("@")[0],
            email,
            role: "user",
            assignedProjects: [],
            createdAt: new Date().toISOString().split("T")[0],
          }
          setAllUsers((prev) => [...prev, newUserStub])
        }
        if (!updatedParticipants.find((p) => p.userId === userId)) {
          updatedParticipants.push({ userId, role: "Miembro" })
        } // If user already exists as manager/creator, don't downgrade to member
      })

    const uniqueUpdatedParticipants = Array.from(new Map(updatedParticipants.map((p) => [p.userId, p])).values())

    const updatedProject = { ...currentManagingProject, participants: uniqueUpdatedParticipants }
    setProjects(projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)))

    // Update UserProfile for all involved participants
    uniqueUpdatedParticipants.forEach((participant) => {
      setAllUsers((prevUsers) =>
        prevUsers.map((u) => {
          if (u.id === participant.userId) {
            const assignmentIndex = u.assignedProjects.findIndex((ap) => ap.projectId === updatedProject.id)
            if (assignmentIndex > -1) {
              const newAssignments = [...u.assignedProjects]
              newAssignments[assignmentIndex].role = participant.role
              return { ...u, assignedProjects: newAssignments }
            } else {
              return {
                ...u,
                assignedProjects: [...u.assignedProjects, { projectId: updatedProject.id, role: participant.role }],
              }
            }
          }
          return u
        }),
      )
    })

    toast({
      title: "Participantes Actualizados",
      description: `Los participantes del proyecto "${currentManagingProject.name}" han sido actualizados.`,
    })
    setIsManageParticipantsDialogOpen(false)
    setCurrentManagingProject(null)
    setAdditionalManagerEmails([""])
    setAdditionalMemberEmails([""])
  }

  const handleDeleteParticipant = (projectId: string, participantUserId: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (!project) return

    const participantToDelete = project.participants.find((p) => p.userId === participantUserId)
    if (!participantToDelete) return

    if (participantToDelete.role === "Creador") {
      toast({ title: "Error", description: "No se puede eliminar al creador del proyecto.", variant: "destructive" })
      return
    }

    const managers = project.participants.filter((p) => p.role === "Manager" || p.role === "Creador")
    if (participantToDelete.role === "Manager" && managers.length === 1) {
      toast({ title: "Error", description: "Debe haber al menos un manager en el proyecto.", variant: "destructive" })
      return
    }

    const updatedParticipants = project.participants.filter((p) => p.userId !== participantUserId)
    const updatedProject = { ...project, participants: updatedParticipants }
    setProjects(projects.map((p) => (p.id === projectId ? updatedProject : p)))
    if (currentManagingProject?.id === projectId) {
      setCurrentManagingProject(updatedProject)
    }

    // Remove project from user's assignedProjects
    setAllUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === participantUserId) {
          return { ...u, assignedProjects: u.assignedProjects.filter((ap) => ap.projectId !== projectId) }
        }
        return u
      }),
    )

    const participantName = getParticipantDetails(participantUserId).name
    toast({ title: "Participante Eliminado", description: `${participantName} ha sido eliminado del proyecto.` })
  }

  const handleChangeParticipantRole = (projectId: string, participantUserId: string, newRole: ParticipantRole) => {
    const project = projects.find((p) => p.id === projectId)
    if (!project) return

    const participantToUpdate = project.participants.find((p) => p.userId === participantUserId)
    if (!participantToUpdate) return

    if (participantToUpdate.role === "Creador" && newRole !== "Creador") {
      toast({ title: "Error", description: "El rol del creador no puede ser cambiado.", variant: "destructive" })
      return
    }

    if (participantToUpdate.role === "Manager" || participantToUpdate.role === "Creador") {
      const currentManagers = project.participants.filter((p) => p.role === "Manager" || p.role === "Creador")
      if (currentManagers.length === 1 && newRole === "Miembro" && participantToUpdate.role !== "Creador") {
        // Creator can't be demoted from manager role if they are the only one
        toast({ title: "Error", description: "Debe haber al menos un manager en el proyecto.", variant: "destructive" })
        return
      }
    }

    const updatedParticipants = project.participants.map((p) =>
      p.userId === participantUserId ? { ...p, role: newRole } : p,
    )
    const updatedProject = { ...project, participants: updatedParticipants }
    setProjects(projects.map((p) => (p.id === projectId ? updatedProject : p)))
    if (currentManagingProject?.id === projectId) {
      setCurrentManagingProject(updatedProject)
    }

    // Update role in user's assignedProjects
    setAllUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === participantUserId) {
          const assignmentIndex = u.assignedProjects.findIndex((ap) => ap.projectId === projectId)
          if (assignmentIndex > -1) {
            const newAssignments = [...u.assignedProjects]
            newAssignments[assignmentIndex].role = newRole
            return { ...u, assignedProjects: newAssignments }
          }
        }
        return u
      }),
    )
    const participantName = getParticipantDetails(participantUserId).name
    toast({ title: "Rol Actualizado", description: `El rol de ${participantName} es ahora ${newRole}.` })
  }

  const getStatusVariant = (status: string) => {
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Proyectos</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar proyectos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full sm:w-[300px]"
            />
          </div>
          <Dialog open={isCreateProjectDialogOpen} onOpenChange={setIsCreateProjectDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateProjectDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Crear Nuevo Proyecto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
                <DialogDescription>Ingresa los detalles para crear un nuevo proyecto.</DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[70vh] p-1">
                <div className="grid gap-4 py-4 pr-3">
                  <div className="grid gap-2">
                    <Label htmlFor="new-project-name">Nombre del Proyecto</Label>
                    <Input
                      id="new-project-name"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Ej: Mi Increíble Proyecto"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-project-image-input">Imagen del Proyecto (Opcional)</Label>
                    <Input
                      id="new-project-image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleNewProjectImageChange}
                      className="hidden"
                    />
                    <Button variant="outline" asChild className="cursor-pointer w-full">
                      <label htmlFor="new-project-image-input" className="flex items-center gap-2">
                        <ImagePlus className="h-4 w-4" /> Subir Imagen
                      </label>
                    </Button>
                    {newProjectImagePreview && (
                      <div className="mt-2 flex justify-center">
                        <img
                          src={newProjectImagePreview || "/placeholder.svg"}
                          alt="Vista previa"
                          className="max-h-32 rounded-md border object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label>Managers (emails)</Label>
                    {newProjectManagerEmails.map((email, index) => (
                      <div key={`manager-create-${index}`} className="flex items-center gap-2">
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => handleEmailInputChange("manager", index, e.target.value, "create")}
                          placeholder="manager@ejemplo.com"
                        />
                        {newProjectManagerEmails.length > 0 && ( // Allow removing if at least one, or if it's not the only one and empty
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeEmailInput("manager", index, "create")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addEmailInput("manager", "create")}
                      className="mt-1"
                    >
                      <UserPlus className="mr-2 h-4 w-4" /> Añadir Manager
                    </Button>
                  </div>

                  <div className="grid gap-2">
                    <Label>Miembros (emails)</Label>
                    {newProjectMemberEmails.map((email, index) => (
                      <div key={`member-create-${index}`} className="flex items-center gap-2">
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => handleEmailInputChange("member", index, e.target.value, "create")}
                          placeholder="miembro@ejemplo.com"
                        />
                        {newProjectMemberEmails.length > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeEmailInput("member", index, "create")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addEmailInput("member", "create")}
                      className="mt-1"
                    >
                      <UserPlus className="mr-2 h-4 w-4" /> Añadir Miembro
                    </Button>
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={resetCreateProjectFormAndCloseDialog}>
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="button" onClick={handleCreateProject}>
                  Crear Proyecto
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredProjects.length === 0 && searchQuery && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No se encontraron proyectos que coincidan con "{searchQuery}"</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentDisplayProjects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={project.avatarUrl || `/placeholder.svg?width=48&height=48&query=${project.name}`}
                  alt={project.name}
                />
                <AvatarFallback>{project.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-base">{project.name}</CardTitle>
                <CardDescription>{project.participants.length} participantes</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-2">
              <p className="text-sm text-muted-foreground">Creado por: {getProjectCreatorName(project.creatorId)}</p>
              {project.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
              )}
              <div className="flex items-center justify-between">
                {project.status && (
                  <Badge variant={getStatusVariant(project.status)} className="text-xs">
                    {project.status}
                  </Badge>
                )}
                {project.progress !== undefined && (
                  <span className="text-xs text-muted-foreground">{project.progress}% completado</span>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
              <Button size="sm" variant="outline" onClick={() => router.push(`/dashboard/projects/${project.id}`)}>
                <BarChart3 className="mr-2 h-4 w-4" /> Estadísticas
              </Button>
              <Button size="sm" onClick={() => handleOpenManageParticipantsDialog(project)}>
                <Settings2 className="mr-2 h-4 w-4" /> Gestionar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && searchQuery && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No se encontraron proyectos que coincidan con "{searchQuery}"</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <Dialog open={isManageParticipantsDialogOpen} onOpenChange={setIsManageParticipantsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Gestionar Participantes: {currentManagingProject?.name}</DialogTitle>
            <DialogDescription>Administra los roles y añade nuevos participantes al proyecto.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] p-1 pr-3">
            <div className="space-y-4 py-4">
              <h3 className="text-md font-semibold mb-2">Participantes Actuales</h3>
              {currentManagingProject?.participants.map((participant) => {
                const userDetails = getParticipantDetails(participant.userId)
                return (
                  <div
                    key={participant.userId}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={userDetails.avatarUrl || `/placeholder.svg?width=36&height=36&query=${userDetails.name}`}
                          alt={userDetails.name}
                        />
                        <AvatarFallback>{userDetails.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{userDetails.name}</p>
                        <p className="text-xs text-muted-foreground">{userDetails.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge
                        variant={
                          participant.role === "Creador"
                            ? "default"
                            : participant.role === "Manager"
                              ? "outline"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {participant.role === "Creador" ? (
                          <ShieldCheck className="mr-1 h-3 w-3" />
                        ) : (
                          <UserCircle className="mr-1 h-3 w-3" />
                        )}
                        {participant.role}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={participant.role === "Creador"}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {participant.role !== "Creador" && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleChangeParticipantRole(currentManagingProject!.id, participant.userId, "Manager")
                                }
                                disabled={participant.role === "Manager"}
                              >
                                Hacer Manager
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleChangeParticipantRole(currentManagingProject!.id, participant.userId, "Miembro")
                                }
                                disabled={participant.role === "Miembro"}
                              >
                                Hacer Miembro
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <ConfirmDeleteDialog
                                onConfirm={() =>
                                  handleDeleteParticipant(currentManagingProject!.id, participant.userId)
                                }
                                triggerButton={
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar del Proyecto
                                  </DropdownMenuItem>
                                }
                                itemName={userDetails.name}
                              />
                            </>
                          )}
                          {participant.role === "Creador" && (
                            <DropdownMenuItem disabled>El creador no se puede modificar</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })}

              <div className="pt-4 border-t mt-4">
                <h3 className="text-md font-semibold mb-2">Añadir Nuevos Managers</h3>
                {additionalManagerEmails.map((email, index) => (
                  <div key={`add-manager-${index}`} className="flex items-center gap-2 mb-2">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailInputChange("manager", index, e.target.value, "manage")}
                      placeholder="manager@ejemplo.com"
                    />
                    {additionalManagerEmails.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEmailInput("manager", index, "manage")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addEmailInput("manager", "manage")}
                  className="mt-1"
                >
                  <UserPlus className="mr-2 h-4 w-4" /> Añadir Campo Manager
                </Button>
              </div>

              <div className="pt-4 border-t mt-4">
                <h3 className="text-md font-semibold mb-2">Añadir Nuevos Miembros</h3>
                {additionalMemberEmails.map((email, index) => (
                  <div key={`add-member-${index}`} className="flex items-center gap-2 mb-2">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailInputChange("member", index, e.target.value, "manage")}
                      placeholder="miembro@ejemplo.com"
                    />
                    {additionalMemberEmails.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEmailInput("member", index, "manage")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addEmailInput("member", "manage")}
                  className="mt-1"
                >
                  <UserPlus className="mr-2 h-4 w-4" /> Añadir Campo Miembro
                </Button>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManageParticipantsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveParticipantsChanges}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Export mock data for use in other components
export { initialMockProjectsData, mockUsersData, initialMockTasksData }
