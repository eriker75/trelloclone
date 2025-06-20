"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutGrid, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

export function LandingPageHeader() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-background z-50">
      <Link href="/" className="flex items-center justify-center">
        <LayoutGrid className="h-6 w-6 text-primary" />
        <span className="ml-2 font-semibold">TaskFlow</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        <Link href="/#features" className="text-sm font-medium hover:underline underline-offset-4">
          Características
        </Link>
        <Link href="/#pricing" className="text-sm font-medium hover:underline underline-offset-4">
          Precios
        </Link>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Cambiar tema</span>
        </Button>
        <Button asChild>
          <Link href="/login">Iniciar Sesión</Link>
        </Button>
      </nav>
    </header>
  )
}
