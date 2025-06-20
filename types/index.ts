import type { LucideIcon } from "lucide-react"

export type TaskStatus = "Pendiente" | "En Progreso" | "Completado" | "Revisión" | "Bloqueado" | "Cancelado"
export type TaskPriority = "Baja" | "Media" | "Alta" | "Urgente"

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string // YYYY-MM-DD
  teamId?: string // Corresponds to projectId
  assignedToId?: string // User ID
  timeSpentHours?: number
  estimatedHours?: number
  createdAt: string // YYYY-MM-DD
  team?: string
  timeSpent: number
  timerActive: boolean
  lastStartTime?: number
  initialTimeSpentWhileActive?: number
  imageUrl?: string // Added for image uploads
}

export interface UserProfile {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  phoneNumber?: string
  assignedProjects: { projectId: string; role: ParticipantRole }[]
  createdAt: string // YYYY-MM-DD
  avatarUrl?: string
  jobTitle?: string
}

export type ParticipantRole = "Creador" | "Manager" | "Miembro"

export interface Project {
  id: string
  name: string
  description?: string
  creatorId: string // User ID
  avatarUrl?: string
  participants: { userId: string; role: ParticipantRole }[]
  createdAt: string // YYYY-MM-DD
  status?: "Activo" | "Completado" | "Pausado" | "Cancelado"
  dueDate?: string // YYYY-MM-DD
  progress?: number // 0-100
  budgetAllocated?: number
  budgetSpent?: number
  teamName?: string
  lastUpdated?: string
  coverImageUrl?: string
}

export interface Team {
  id: string
  name: string
  description: string
  members: { userId: string; role: "admin" | "member" }[]
  createdAt: string
  avatarUrl?: string
}

export interface NavLink {
  title: string
  href: string
  icon: LucideIcon
  label?: string
}

export interface Notification {
  id: string
  title: string
  description: string
  read: boolean
  timestamp: string // ISO string
}
