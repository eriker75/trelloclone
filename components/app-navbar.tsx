"use client"

import { useState } from "react"
import { Bell, Search, Menu, SettingsIcon, User, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const initialNotifications = [
  { id: 1, text: "Carlos ha completado la tarea 'Desarrollar API'.", read: false },
  { id: 2, text: "Has sido añadido al equipo 'Producto Alpha'.", read: false },
  { id: 3, text: "La tarea 'Reunión de Sprint' vence mañana.", read: true },
  { id: 4, text: "Nuevo comentario en 'Diseñar Landing Page'.", read: false },
  { id: 5, text: "Recordatorio: Actualizar dependencias del proyecto.", read: false },
  { id: 6, text: "El equipo 'Marketing' ha alcanzado un hito.", read: true },
  { id: 7, text: "Tarea 'Investigación de mercado' asignada.", read: false },
]

export function AppNavbar() {
  const { isMobile } = useSidebar()
  const [notifications, setNotifications] = useState(initialNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      {isMobile ? (
        <SidebarTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SidebarTrigger>
      ) : (
        <SidebarTrigger className="hidden md:flex" />
      )}

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar tareas, equipos..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
              <span className="sr-only">Notificaciones</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 sm:w-96 max-h-[calc(100vh-200px)] overflow-y-auto">
            <DropdownMenuLabel className="flex justify-between items-center sticky top-0 bg-background z-10 px-2 py-1.5">
              Notificaciones
              {unreadCount > 0 && (
                <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={handleMarkAllAsRead}>
                  Marcar todas como leídas
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn("flex items-start gap-2.5 p-2.5", !notification.read && "font-semibold")}
                  onSelect={() => handleMarkAsRead(notification.id)} // Use onSelect to prevent closing on click
                  onClick={(e) => e.preventDefault()} // Prevent default behavior that might close menu
                >
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full mt-1.5 shrink-0",
                      !notification.read ? "bg-primary" : "bg-muted",
                    )}
                  />
                  <span className="flex-1 whitespace-normal text-sm">{notification.text}</span>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled className="p-2.5 text-sm">
                No tienes notificaciones.
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.png" alt="Usuario" />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
              <span className="sr-only">Menú de usuario</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                <User className="mr-2 h-4 w-4" />
                Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <SettingsIcon className="mr-2 h-4 w-4" />
                Ajustes
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
