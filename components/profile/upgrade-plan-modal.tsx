"use client"

import { useState } from "react"
import { Check, X, Zap, Crown, Rocket } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SubscriptionSelector } from "@/components/subscription/subscription-selector"

interface UpgradePlanModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const plans = {
  monthly: [
    {
      name: "Básico",
      price: 0,
      description: "Perfecto para empezar",
      icon: Zap,
      color: "text-gray-600",
      bgColor: "bg-gray-50 dark:bg-gray-900/30",
      features: ["Hasta 3 proyectos", "5 miembros del equipo", "1GB de almacenamiento", "Soporte por email"],
      limitations: ["Sin integraciones avanzadas", "Sin reportes personalizados"],
      current: true,
    },
    {
      name: "Pro",
      price: 12,
      description: "Para equipos en crecimiento",
      icon: Crown,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      popular: true,
      features: [
        "Proyectos ilimitados",
        "25 miembros del equipo",
        "50GB de almacenamiento",
        "Integraciones avanzadas",
        "Reportes personalizados",
        "Soporte prioritario",
      ],
      limitations: [],
    },
    {
      name: "Enterprise",
      price: 25,
      description: "Para organizaciones grandes",
      icon: Rocket,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      features: [
        "Todo lo de Pro",
        "Miembros ilimitados",
        "500GB de almacenamiento",
        "SSO y seguridad avanzada",
        "API personalizada",
        "Soporte 24/7",
        "Gestor de cuenta dedicado",
      ],
      limitations: [],
    },
  ],
  yearly: [
    {
      name: "Básico",
      price: 0,
      description: "Perfecto para empezar",
      icon: Zap,
      color: "text-gray-600",
      bgColor: "bg-gray-50 dark:bg-gray-900/30",
      features: ["Hasta 3 proyectos", "5 miembros del equipo", "1GB de almacenamiento", "Soporte por email"],
      limitations: ["Sin integraciones avanzadas", "Sin reportes personalizados"],
      current: true,
    },
    {
      name: "Pro",
      price: 120,
      originalPrice: 144,
      description: "Para equipos en crecimiento",
      icon: Crown,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      popular: true,
      savings: "Ahorra $24",
      features: [
        "Proyectos ilimitados",
        "25 miembros del equipo",
        "50GB de almacenamiento",
        "Integraciones avanzadas",
        "Reportes personalizados",
        "Soporte prioritario",
      ],
      limitations: [],
    },
    {
      name: "Enterprise",
      price: 250,
      originalPrice: 300,
      description: "Para organizaciones grandes",
      icon: Rocket,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      savings: "Ahorra $50",
      features: [
        "Todo lo de Pro",
        "Miembros ilimitados",
        "500GB de almacenamiento",
        "SSO y seguridad avanzada",
        "API personalizada",
        "Soporte 24/7",
        "Gestor de cuenta dedicado",
      ],
      limitations: [],
    },
  ],
}

export function UpgradePlanModal({ open, onOpenChange }: UpgradePlanModalProps) {
  const [isYearly, setIsYearly] = useState(false)
  const currentPlans = isYearly ? plans.yearly : plans.monthly

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-4">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Elige el plan perfecto para tu equipo
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Desbloquea todo el potencial de tu productividad con nuestros planes premium
          </DialogDescription>

          {/* Billing Toggle */}
          <SubscriptionSelector isYearly={isYearly} onToggle={setIsYearly} />
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {currentPlans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <div
                key={index}
                className={`relative rounded-xl border-2 p-6 transition-all hover:shadow-lg ${
                  plan.popular ? "border-primary shadow-lg scale-105" : "border-border hover:border-primary/50"
                } ${plan.current ? "bg-muted/30" : "bg-card"}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    Más Popular
                  </Badge>
                )}

                {plan.current && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Plan Actual
                  </Badge>
                )}

                <div className="text-center space-y-4">
                  <div className={`inline-flex p-3 rounded-full ${plan.bgColor}`}>
                    <Icon className={`h-6 w-6 ${plan.color}`} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                      <span className="text-muted-foreground">/{isYearly ? "año" : "mes"}</span>
                    </div>

                    {plan.originalPrice && (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm text-muted-foreground line-through">${plan.originalPrice}</span>
                        <Badge variant="secondary" className="text-xs">
                          {plan.savings}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <Button
                    className={`w-full ${
                      plan.current
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : plan.popular
                          ? "trello-button-primary"
                          : "trello-button-secondary"
                    }`}
                    disabled={plan.current}
                  >
                    {plan.current ? "Plan Actual" : plan.price === 0 ? "Gratis" : "Actualizar"}
                  </Button>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Incluye:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Limitaciones:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            ¿Necesitas algo personalizado?
            <Button variant="link" className="p-0 ml-1 h-auto text-primary">
              Contáctanos
            </Button>
          </p>
          <p className="text-xs text-muted-foreground">
            Todos los planes incluyen prueba gratuita de 14 días. Cancela en cualquier momento.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
