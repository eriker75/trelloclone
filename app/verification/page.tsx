"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Mail, MessageSquare, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function VerificationPage() {
  const [otp, setOtp] = useState(["", "", "", ""])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)
  const [verificationMethod, setVerificationMethod] = useState<"email" | "sms">("email")

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError("")

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-verify when all fields are filled
    if (newOtp.every((digit) => digit !== "") && !isVerifying) {
      handleVerify(newOtp.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 4)
    const newOtp = pastedData.split("").concat(["", "", "", ""]).slice(0, 4)
    setOtp(newOtp)

    if (newOtp.every((digit) => digit !== "")) {
      handleVerify(newOtp.join(""))
    }
  }

  const handleVerify = async (code: string) => {
    setIsVerifying(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock verification logic
      if (code === "1234") {
        setIsVerified(true)
      } else {
        setError("Código incorrecto. Por favor, inténtalo de nuevo.")
        setOtp(["", "", "", ""])
        inputRefs.current[0]?.focus()
      }
    } catch (err) {
      setError("Error al verificar el código. Por favor, inténtalo de nuevo.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    setResendCooldown(60)
    setError("")

    try {
      // Simulate resend API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Show success message or handle response
    } catch (err) {
      setError("Error al reenviar el código.")
    }
  }

  const handleMethodChange = (method: "email" | "sms") => {
    setVerificationMethod(method)
    setOtp(["", "", "", ""])
    setError("")
    inputRefs.current[0]?.focus()
  }

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
        <Card className="w-full max-w-md trello-card">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">¡Verificación Exitosa!</h2>
                <p className="text-muted-foreground mt-2">Tu cuenta ha sido verificada correctamente.</p>
              </div>
              <Button asChild className="w-full trello-button-primary">
                <Link href="/dashboard">Continuar al Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md trello-card">
        <CardHeader className="text-center space-y-2">
          <div className="flex items-center justify-center mb-4">
            <Button variant="ghost" size="sm" asChild className="absolute left-4 top-4">
              <Link href="/login">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Link>
            </Button>
          </div>

          <CardTitle className="text-2xl font-bold text-foreground">Verificar tu cuenta</CardTitle>
          <CardDescription className="text-muted-foreground">
            Hemos enviado un código de 4 dígitos a tu{" "}
            {verificationMethod === "email" ? "correo electrónico" : "teléfono"}
          </CardDescription>

          {/* Method selector */}
          <div className="flex gap-2 justify-center pt-2">
            <Button
              variant={verificationMethod === "email" ? "default" : "outline"}
              size="sm"
              onClick={() => handleMethodChange("email")}
              className={verificationMethod === "email" ? "trello-button-primary" : "trello-button-secondary"}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button
              variant={verificationMethod === "sms" ? "default" : "outline"}
              size="sm"
              onClick={() => handleMethodChange("sms")}
              className={verificationMethod === "sms" ? "trello-button-primary" : "trello-button-secondary"}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              SMS
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* OTP Input */}
          <div className="space-y-4">
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={cn(
                    "w-12 h-12 text-center text-lg font-semibold trello-card border-primary/20 focus:border-primary",
                    error && "border-destructive focus:border-destructive",
                    digit && "border-primary bg-primary/5",
                  )}
                  disabled={isVerifying}
                />
              ))}
            </div>

            {error && (
              <div className="text-center">
                <Badge variant="destructive" className="text-xs">
                  {error}
                </Badge>
              </div>
            )}

            {isVerifying && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Verificando código...
                </div>
              </div>
            )}
          </div>

          {/* Manual verify button */}
          <Button
            onClick={() => handleVerify(otp.join(""))}
            disabled={otp.some((digit) => digit === "") || isVerifying}
            className="w-full trello-button-primary"
          >
            {isVerifying ? "Verificando..." : "Verificar Código"}
          </Button>

          {/* Resend section */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">¿No recibiste el código?</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className="text-primary hover:text-primary hover:bg-primary/10"
            >
              {resendCooldown > 0 ? (
                `Reenviar en ${resendCooldown}s`
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reenviar código
                </>
              )}
            </Button>
          </div>

          {/* Help text */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              El código expira en 10 minutos. Para pruebas, usa: <code className="bg-muted px-1 rounded">1234</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
