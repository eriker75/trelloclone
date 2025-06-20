import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LayoutGrid } from "lucide-react"

export default function ForgotPasswordPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12 lg:py-0">
        <Card className="mx-auto w-[350px] lg:w-[400px]">
          <CardHeader className="text-center">
            <Link href="/" className="inline-block mb-4">
              <LayoutGrid className="h-8 w-8 mx-auto text-primary" />
              <span className="sr-only">TaskFlow Home</span>
            </Link>
            <CardTitle className="text-2xl">Recuperar Contraseña</CardTitle>
            <CardDescription>
              Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@ejemplo.com" required />
              </div>
              <Button type="submit" className="w-full">
                Enviar Enlace
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              <Link href="/login" className="underline">
                Volver a Iniciar Sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="hidden bg-muted lg:flex items-center justify-center">
        <Image
          src="/abstract-auth-background.png"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
