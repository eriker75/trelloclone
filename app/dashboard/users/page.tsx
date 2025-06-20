// Make sure to export initialMockUsers, initialMockTasks, initialMockProjects
// For example, at the end of the file:
// export { initialMockUsers, initialMockProjects, initialMockTasks };

"use client"

import * as React from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UsersTable } from "@/components/users/users-table"
import { CreateEditUserDialog } from "@/components/users/create-edit-user-dialog"
import type { UserProfile, Project, Task } from "@/types" // Ensure all types are imported
import { useToast } from "@/components/ui/use-toast"

// MOCK DATA (Ensure this is comprehensive enough for the profile page)
export const initialMockProjects: Project[] = [
  {
    id: "proj-001",
    name: "Plataforma eCommerce",
    description: "Desarrollo de la nueva plataforma de ventas online.",
    creatorId: "user-001",
    participants: [
      { userId: "user-001", role: "Creador" },
      { userId: "user-002", role: "Manager" },
      { userId: "user-003", role: "Miembro" },
    ],
    createdAt: "2023-01-15",
    status: "Activo",
    dueDate: "2024-12-31",
    progress: 60,
    coverImageUrl: "/ecommerce-platform-concept.png",
  },
  {
    id: "proj-002",
    name: "App Móvil de Fitness",
    description: "Aplicación para seguimiento de actividad física y dietas.",
    creatorId: "user-002",
    participants: [
      { userId: "user-002", role: "Creador" },
      { userId: "user-004", role: "Miembro" },
      { userId: "user-005", role: "Miembro" },
    ],
    createdAt: "2023-03-01",
    status: "Activo",
    dueDate: "2024-09-30",
    progress: 35,
    coverImageUrl: "/fitness-app-interface.png",
  },
  {
    id: "proj-003",
    name: "Sistema CRM Interno",
    description: "Actualización y mejora del sistema de gestión de clientes.",
    creatorId: "user-001",
    participants: [
      { userId: "user-001", role: "Creador" },
      { userId: "user-003", role: "Manager" },
      { userId: "user-005", role: "Miembro" },
    ],
    createdAt: "2022-11-10",
    status: "Completado",
    dueDate: "2023-06-30",
    progress: 100,
    coverImageUrl: "/crm-system.png",
  },
  {
    id: "proj-004",
    name: "Campaña Marketing Q4",
    description: "Planificación y ejecución de la campaña de marketing para el último trimestre.",
    creatorId: "user-004",
    participants: [
      { userId: "user-004", role: "Creador" },
      { userId: "user-001", role: "Miembro" },
    ],
    createdAt: "2023-08-20",
    status: "Pausado",
    dueDate: "2023-12-15",
    progress: 20,
    coverImageUrl: "/marketing-campaign-brainstorm.png",
  },
]

export const initialMockUsers: UserProfile[] = [
  {
    id: "user-001",
    name: "Ana López",
    email: "ana.lopez@example.com",
    avatarUrl: "/ana-lopez.png",
    jobTitle: "Desarrolladora Full-Stack",
    phoneNumber: "555-0101",
    assignedProjects: [
      { projectId: "proj-001", role: "Creador" },
      { projectId: "proj-003", role: "Creador" },
      { projectId: "proj-004", role: "Miembro" },
    ],
    role: "admin",
    plan: "Premium",
    createdAt: "2022-05-10",
    totalHoursWorked: 1250,
    tasksCompleted: 85,
    tasksPending: 12,
    tasksOverdue: 2,
  },
  {
    id: "user-002",
    name: "Carlos García",
    email: "carlos.garcia@example.com",
    avatarUrl: "/carlos-garcia-portrait.png",
    jobTitle: "Jefe de Proyecto",
    phoneNumber: "555-0102",
    assignedProjects: [
      { projectId: "proj-001", role: "Manager" },
      { projectId: "proj-002", role: "Creador" },
    ],
    role: "user",
    plan: "Pro",
    createdAt: "2022-06-15",
    totalHoursWorked: 1100,
    tasksCompleted: 70,
    tasksPending: 8,
    tasksOverdue: 1,
  },
  {
    id: "user-003",
    name: "Laura Martínez",
    email: "laura.martinez@example.com",
    avatarUrl: "/portrait-woman.png",
    jobTitle: "Diseñadora UX/UI",
    phoneNumber: "555-0103",
    assignedProjects: [
      { projectId: "proj-001", role: "Miembro" },
      { projectId: "proj-003", role: "Manager" },
    ],
    role: "user",
    plan: "Gratuito",
    createdAt: "2022-08-01",
    totalHoursWorked: 980,
    tasksCompleted: 60,
    tasksPending: 15,
    tasksOverdue: 3,
  },
  {
    id: "user-004",
    name: "Pedro Rodríguez",
    email: "pedro.rodriguez@example.com",
    avatarUrl: "/pedro-rodriguez-portrait.png",
    jobTitle: "Especialista en Marketing",
    phoneNumber: "555-0104",
    assignedProjects: [
      { projectId: "proj-002", role: "Miembro" },
      { projectId: "proj-004", role: "Creador" },
    ],
    role: "user",
    plan: "Premium",
    createdAt: "2023-01-20",
    totalHoursWorked: 750,
    tasksCompleted: 45,
    tasksPending: 5,
    tasksOverdue: 0,
  },
  {
    id: "user-005",
    name: "Sofía Hernández",
    email: "sofia.hernandez@example.com",
    avatarUrl: "/portrait-woman.png",
    jobTitle: "Analista de Datos",
    phoneNumber: "555-0105",
    assignedProjects: [
      { projectId: "proj-002", role: "Miembro" },
      { projectId: "proj-003", role: "Miembro" },
    ],
    role: "user",
    plan: "Gratuito",
    createdAt: "2023-03-10",
    totalHoursWorked: 600,
    tasksCompleted: 50,
    tasksPending: 7,
    tasksOverdue: 1,
  },
]

export const initialMockTasks: Task[] = [
  // Tasks for Ana López (user-001)
  {
    id: "task-001",
    title: "Diseñar API para pagos",
    description: "Definir endpoints y modelos de datos para el módulo de pagos.",
    status: "Completada",
    priority: "Alta",
    dueDate: "2023-08-15",
    team: "proj-001",
    assignedTo: "user-001",
    timeSpent: 28800,
    timerActive: false,
    createdAt: "2023-08-01",
  },
  {
    id: "task-002",
    title: "Implementar autenticación OAuth2",
    description: "Integrar OAuth2 para el login de usuarios.",
    status: "En Progreso",
    priority: "Urgente",
    dueDate: "2024-07-30",
    team: "proj-001",
    assignedTo: "user-001",
    timeSpent: 14400,
    timerActive: true,
    createdAt: "2024-07-10",
  },
  {
    id: "task-003",
    title: "Revisar wireframes CRM",
    description: "Dar feedback sobre los nuevos wireframes del CRM.",
    status: "Pendiente",
    priority: "Media",
    dueDate: "2024-08-05",
    team: "proj-003",
    assignedTo: "user-001",
    timeSpent: 0,
    timerActive: false,
    createdAt: "2024-07-25",
  },
  {
    id: "task-004",
    title: "Crear copies para landing page Q4",
    description: "Redactar textos persuasivos para la campaña.",
    status: "Revisión",
    priority: "Media",
    dueDate: "2023-09-10",
    team: "proj-004",
    assignedTo: "user-001",
    timeSpent: 7200,
    timerActive: false,
    createdAt: "2023-09-01",
  },
  {
    id: "task-016",
    title: "Optimizar consultas de base de datos",
    description: "Mejorar rendimiento de queries en módulo de reportes.",
    status: "Pendiente",
    priority: "Alta",
    dueDate: "2024-08-20",
    team: "proj-001",
    assignedTo: "user-001",
    timeSpent: 0,
    timerActive: false,
    createdAt: "2024-07-28",
  },

  // Tasks for Carlos García (user-002)
  {
    id: "task-005",
    title: "Definir KPIs proyecto eCommerce",
    description: "Establecer métricas clave para el seguimiento del proyecto.",
    status: "Completada",
    priority: "Alta",
    dueDate: "2023-07-20",
    team: "proj-001",
    assignedTo: "user-002",
    timeSpent: 10800,
    timerActive: false,
    createdAt: "2023-07-10",
  },
  {
    id: "task-006",
    title: "Planificar sprint 5 App Fitness",
    description: "Organizar tareas y objetivos para el próximo sprint.",
    status: "En Progreso",
    priority: "Alta",
    dueDate: "2024-08-02",
    team: "proj-002",
    assignedTo: "user-002",
    timeSpent: 3600,
    timerActive: false,
    createdAt: "2024-07-28",
  },
  {
    id: "task-007",
    title: "Investigar SDKs de gamificación",
    description: "Evaluar opciones para integrar gamificación en la app de fitness.",
    status: "Pendiente",
    priority: "Media",
    dueDate: "2024-08-15",
    team: "proj-002",
    assignedTo: "user-002",
    timeSpent: 0,
    timerActive: false,
    createdAt: "2024-07-20",
  },
  {
    id: "task-017",
    title: "Presentación de avances a stakeholders",
    description: "Preparar y realizar la demo del sprint actual.",
    status: "Completada",
    priority: "Urgente",
    dueDate: "2024-07-15",
    team: "proj-001",
    assignedTo: "user-002",
    timeSpent: 18000,
    timerActive: false,
    createdAt: "2024-07-01",
  },

  // Tasks for Laura Martínez (user-003)
  {
    id: "task-008",
    title: "Diseñar flujo de checkout",
    description: "Crear prototipos para el proceso de pago del eCommerce.",
    status: "Revisión",
    priority: "Alta",
    dueDate: "2023-09-01",
    team: "proj-001",
    assignedTo: "user-003",
    timeSpent: 21600,
    timerActive: false,
    createdAt: "2023-08-10",
  },
  {
    id: "task-009",
    title: "Crear guía de estilos CRM",
    description: "Documentar los componentes visuales y de marca para el CRM.",
    status: "Completada",
    priority: "Media",
    dueDate: "2023-05-30",
    team: "proj-003",
    assignedTo: "user-003",
    timeSpent: 32400,
    timerActive: false,
    createdAt: "2023-05-01",
  },
  {
    id: "task-010",
    title: "Test de usabilidad dashboard CRM",
    description: "Realizar pruebas con usuarios para el nuevo dashboard.",
    status: "Pendiente",
    priority: "Alta",
    dueDate: "2024-08-10",
    team: "proj-003",
    assignedTo: "user-003",
    timeSpent: 0,
    timerActive: false,
    createdAt: "2024-07-22",
  }, // Overdue if today is past Aug 10, 2023
  {
    id: "task-018",
    title: "Diseñar interfaz de perfil de usuario",
    description: "Crear mockups para la sección de perfil en la app de eCommerce.",
    status: "En Progreso",
    priority: "Media",
    dueDate: "2024-08-25",
    team: "proj-001",
    assignedTo: "user-003",
    timeSpent: 9000,
    timerActive: true,
    createdAt: "2024-07-18",
  },

  // Tasks for Pedro Rodríguez (user-004)
  {
    id: "task-011",
    title: "Analizar competencia App Fitness",
    description: "Investigar funcionalidades y estrategias de apps similares.",
    status: "Completada",
    priority: "Media",
    dueDate: "2023-04-15",
    team: "proj-002",
    assignedTo: "user-004",
    timeSpent: 14400,
    timerActive: false,
    createdAt: "2023-04-01",
  },
  {
    id: "task-012",
    title: "Definir segmentación de audiencia Q4",
    description: "Identificar públicos objetivo para la campaña de marketing.",
    status: "En Progreso",
    priority: "Alta",
    dueDate: "2023-09-05",
    team: "proj-004",
    assignedTo: "user-004",
    timeSpent: 7200,
    timerActive: false,
    createdAt: "2023-08-25",
  }, // Overdue
  {
    id: "task-019",
    title: "Crear calendario de contenido RRSS",
    description: "Planificar publicaciones para redes sociales para la campaña Q4.",
    status: "Pendiente",
    priority: "Media",
    dueDate: "2023-09-20",
    team: "proj-004",
    assignedTo: "user-004",
    timeSpent: 0,
    timerActive: false,
    createdAt: "2023-09-02",
  }, // Overdue

  // Tasks for Sofía Hernández (user-005)
  {
    id: "task-013",
    title: "Limpiar dataset de usuarios Fitness",
    description: "Procesar y validar datos de usuarios para análisis.",
    status: "Completada",
    priority: "Media",
    dueDate: "2023-05-01",
    team: "proj-002",
    assignedTo: "user-005",
    timeSpent: 18000,
    timerActive: false,
    createdAt: "2023-04-20",
  },
  {
    id: "task-014",
    title: "Generar reporte de ventas CRM",
    description: "Crear dashboard con métricas de ventas del último trimestre.",
    status: "Revisión",
    priority: "Alta",
    dueDate: "2023-06-10",
    team: "proj-003",
    assignedTo: "user-005",
    timeSpent: 25200,
    timerActive: false,
    createdAt: "2023-06-01",
  },
  {
    id: "task-015",
    title: "Modelo predictivo de churn Fitness",
    description: "Desarrollar un modelo para predecir la baja de usuarios.",
    status: "Pendiente",
    priority: "Urgente",
    dueDate: "2024-09-01",
    team: "proj-002",
    assignedTo: "user-005",
    timeSpent: 0,
    timerActive: false,
    createdAt: "2024-07-15",
  },
  {
    id: "task-020",
    title: "Análisis de cohortes de usuarios CRM",
    description: "Estudiar comportamiento de grupos de usuarios a lo largo del tiempo.",
    status: "En Progreso",
    priority: "Alta",
    dueDate: "2024-08-30",
    team: "proj-003",
    assignedTo: "user-005",
    timeSpent: 12000,
    timerActive: false,
    createdAt: "2024-07-20",
  },
]

export default function UsersPage() {
  const [users, setUsers] = React.useState<UserProfile[]>(initialMockUsers)
  const [projects] = React.useState<Project[]>(initialMockProjects) // Projects are static for now
  const { toast } = useToast()

  const handleCreateOrUpdateUser = (userData: Partial<UserProfile> & { id?: string }) => {
    if (userData.id) {
      // Update existing user
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userData.id ? { ...user, ...userData } : user)))
      toast({ title: "Usuario Actualizado", description: `El usuario ${userData.name} ha sido actualizado.` })
    } else {
      // Create new user
      const newUser: UserProfile = {
        id: `user-${Date.now().toString()}`, // Simple unique ID
        createdAt: new Date().toISOString().split("T")[0],
        role: "user", // Default role
        assignedProjects: [],
        ...userData,
        name: userData.name || "Nuevo Usuario",
        email: userData.email || `nuevo${Date.now()}@example.com`,
      }
      setUsers((prevUsers) => [newUser, ...prevUsers])
      toast({ title: "Usuario Creado", description: `El usuario ${newUser.name} ha sido creado.` })
    }
  }

  const handleDeleteUser = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
    const deletedUser = users.find((u) => u.id === userId)
    toast({ title: "Usuario Eliminado", description: `El usuario ${deletedUser?.name || userId} ha sido eliminado.` })
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Gestión de Usuarios</h1>
        <CreateEditUserDialog
          allProjects={projects}
          onUserSave={handleCreateOrUpdateUser}
          triggerButton={
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Añadir Usuario
            </Button>
          }
        />
      </div>
      <UsersTable
        usersData={users}
        allProjects={projects}
        onUpdateUser={handleCreateOrUpdateUser}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  )
}
