"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Bell, Palette, Globe } from "lucide-react"

export default function SettingsPage() {
  // Placeholder state for settings - in a real app, this would come from a store or API
  const [settings, setSettings] = useState({
    language: "es",
    timezone: "America/New_York",
    emailNotifications: true,
    inAppNotifications: true,
    theme: "system",
  })

  const handleInputChange = (id: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [id]: value }))
  }

  const handleSaveSettings = () => {
    // Placeholder for save logic
    console.log("Settings saved:", settings)
    // Add toast notification here
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Ajustes</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Globe className="mr-3 h-6 w-6 text-primary" />
            General
          </CardTitle>
          <CardDescription>Configura las preferencias generales de tu cuenta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select value={settings.language} onValueChange={(value) => handleInputChange("language", value)}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Selecciona idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Zona Horaria</Label>
              <Select value={settings.timezone} onValueChange={(value) => handleInputChange("timezone", value)}>
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Selecciona zona horaria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">America/New York (EST)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Bell className="mr-3 h-6 w-6 text-primary" />
            Notificaciones
          </CardTitle>
          <CardDescription>Gestiona cómo recibes las notificaciones.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-md">
            <div>
              <Label htmlFor="emailNotifications" className="font-medium">
                Notificaciones por Email
              </Label>
              <p className="text-sm text-muted-foreground">Recibe actualizaciones importantes por correo.</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-md">
            <div>
              <Label htmlFor="inAppNotifications" className="font-medium">
                Notificaciones en la App
              </Label>
              <p className="text-sm text-muted-foreground">Muestra alertas dentro de la aplicación.</p>
            </div>
            <Switch
              id="inAppNotifications"
              checked={settings.inAppNotifications}
              onCheckedChange={(checked) => handleInputChange("inAppNotifications", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Palette className="mr-3 h-6 w-6 text-primary" />
            Apariencia
          </CardTitle>
          <CardDescription>Personaliza la apariencia de la aplicación.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="theme">Tema</Label>
            <Select value={settings.theme} onValueChange={(value) => handleInputChange("theme", value)}>
              <SelectTrigger id="theme">
                <SelectValue placeholder="Selecciona tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Oscuro</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              El tema del sistema se adaptará a las preferencias de tu SO.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSaveSettings}>
          <Save className="mr-2 h-4 w-4" /> Guardar Cambios
        </Button>
      </div>
    </div>
  )
}
// Need to import useState
import { useState } from "react"
