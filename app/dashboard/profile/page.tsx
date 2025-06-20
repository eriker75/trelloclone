"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LogOut, AlertTriangle, ExternalLink, Save, ImagePlus } from "lucide-react"
import { UpgradePlanModal } from "@/components/profile/upgrade-plan-modal"

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "Usuario Ejemplo",
    email: "usuario@ejemplo.com",
    plan: "Gratuito",
    avatarUrl: "/placeholder-user.png",
    teamMemberLimitReached: true,
  })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setUser((prev) => ({ ...prev, [id]: value }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Perfil y Plan</h1>

      {user.plan === "Gratuito" && user.teamMemberLimitReached && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Límite de Miembros Alcanzado</AlertTitle>
          <AlertDescription>
            Has alcanzado el límite de 10 miembros por equipo en el plan gratuito. Considera actualizar tu plan para
            añadir más miembros.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Información Personal</CardTitle>
          <CardDescription>Actualiza tu foto de perfil y detalles personales.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarPreview || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <Button asChild variant="outline">
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <ImagePlus className="mr-2 h-4 w-4" /> Cambiar Foto
              </Label>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" value={user.name} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email} onChange={handleInputChange} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-end">
          <Button>
            <Save className="mr-2 h-4 w-4" /> Guardar Cambios
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cambiar Contraseña</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Contraseña Actual</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nueva Contraseña</Label>
            <Input id="new-password" type="password" />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-end">
          <Button>Actualizar Contraseña</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gestionar Plan</CardTitle>
          <CardDescription>
            Tu plan actual es <span className="font-semibold">{user.plan}</span>.
            {user.plan === "Gratuito" && " Actualiza para desbloquear más funcionalidades."}
          </CardDescription>
        </CardHeader>
        <CardFooter className="border-t pt-4 flex justify-between items-center">
          <UpgradePlanModal
            triggerButton={
              <Button>
                <ExternalLink className="mr-2 h-4 w-4" /> Ver y Actualizar Plan
              </Button>
            }
          />
        </CardFooter>
      </Card>

      <div className="flex justify-end">
        <Button variant="destructive">
          <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
