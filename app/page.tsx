"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowRight, Users, Zap, Shield, Star } from "lucide-react"
import { LandingPageHeader } from "@/components/landing-page-header"
import { SubscriptionSelector } from "@/components/subscription/subscription-selector"
import Link from "next/link"

const features = [
  {
    icon: Users,
    title: "Colaboración en Equipo",
    description: "Trabaja con tu equipo en tiempo real con herramientas de colaboración avanzadas.",
  },
  {
    icon: Zap,
    title: "Automatización Inteligente",
    description: "Automatiza tareas repetitivas y optimiza tu flujo de trabajo.",
  },
  {
    icon: Shield,
    title: "Seguridad Empresarial",
    description: "Protección de datos de nivel empresarial con cifrado end-to-end.",
  },
]

const testimonials = [
  {
    name: "María González",
    role: "Product Manager",
    company: "TechCorp",
    content:
      "Esta plataforma ha revolucionado la forma en que gestionamos nuestros proyectos. La productividad de nuestro equipo ha aumentado un 40%.",
    rating: 5,
  },
  {
    name: "Carlos Rodríguez",
    role: "CEO",
    company: "StartupXYZ",
    content:
      "La mejor inversión que hemos hecho. La interfaz es intuitiva y las funciones de automatización nos ahorran horas cada semana.",
    rating: 5,
  },
  {
    name: "Ana López",
    role: "Team Lead",
    company: "DesignStudio",
    content:
      "Perfecto para equipos creativos. La colaboración en tiempo real y las herramientas de seguimiento son excepcionales.",
    rating: 5,
  },
]

export default function LandingPage() {
  const [isAnnual, setIsAnnual] = useState(true)

  const plans = [
    {
      name: "Básico",
      description: "Perfecto para equipos pequeños que están comenzando",
      monthlyPrice: 9,
      annualPrice: 7,
      features: [
        "Hasta 5 usuarios",
        "10 proyectos",
        "Almacenamiento de 5GB",
        "Soporte por email",
        "Integraciones básicas",
      ],
      popular: false,
    },
    {
      name: "Profesional",
      description: "Ideal para equipos en crecimiento con necesidades avanzadas",
      monthlyPrice: 19,
      annualPrice: 15,
      features: [
        "Hasta 25 usuarios",
        "Proyectos ilimitados",
        "Almacenamiento de 100GB",
        "Soporte prioritario",
        "Todas las integraciones",
        "Automatizaciones avanzadas",
        "Reportes personalizados",
      ],
      popular: true,
    },
    {
      name: "Empresarial",
      description: "Para organizaciones grandes con requisitos específicos",
      monthlyPrice: 39,
      annualPrice: 31,
      features: [
        "Usuarios ilimitados",
        "Proyectos ilimitados",
        "Almacenamiento ilimitado",
        "Soporte 24/7",
        "Integraciones personalizadas",
        "SSO y seguridad avanzada",
        "Onboarding dedicado",
        "SLA garantizado",
      ],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <LandingPageHeader />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            🚀 Nuevo: Automatizaciones con IA
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Gestiona tus proyectos
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {" "}
              como un profesional
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            La plataforma todo-en-uno para equipos que quieren trabajar de manera más inteligente, no más difícil.
            Colabora, automatiza y escala con confianza.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/register">
                Comenzar gratis <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">Ver demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Todo lo que necesitas para triunfar
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Herramientas poderosas diseñadas para equipos modernos que buscan eficiencia y resultados.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Precios transparentes para todos
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Elige el plan que mejor se adapte a tu equipo. Siempre puedes cambiar después.
            </p>
            <SubscriptionSelector onPlanChange={setIsAnnual} />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? "border-blue-500 shadow-lg scale-105"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                    Más Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">/mes</span>
                    {isAnnual && (
                      <div className="text-sm text-green-600 dark:text-green-400">
                        Ahorra ${(plan.monthlyPrice - plan.annualPrice) * 12}/año
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                    }`}
                    asChild
                  >
                    <Link href="/register">{plan.popular ? "Comenzar ahora" : "Elegir plan"}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Miles de equipos confían en nosotros para gestionar sus proyectos.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">"{testimonial.content}"</CardDescription>
                </CardHeader>
                <CardFooter>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {testimonial.role} en {testimonial.company}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 dark:bg-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            ¿Listo para transformar tu forma de trabajar?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a miles de equipos que ya están trabajando de manera más inteligente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">
                Comenzar gratis <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link href="/login">Hablar con ventas</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
