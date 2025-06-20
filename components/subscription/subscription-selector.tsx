"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SubscriptionSelectorProps {
  onPlanChange?: (isAnnual: boolean) => void
  className?: string
}

export function SubscriptionSelector({ onPlanChange, className }: SubscriptionSelectorProps) {
  const [isAnnual, setIsAnnual] = useState(true)

  const handleToggle = (annual: boolean) => {
    setIsAnnual(annual)
    onPlanChange?.(annual)
  }

  return (
    <div className={cn("flex items-center justify-center gap-4 p-1 bg-muted rounded-lg", className)}>
      <Button
        variant={!isAnnual ? "default" : "ghost"}
        size="sm"
        onClick={() => handleToggle(false)}
        className={cn(
          "relative transition-all duration-200",
          !isAnnual
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10",
        )}
      >
        Mensual
      </Button>

      <Button
        variant={isAnnual ? "default" : "ghost"}
        size="sm"
        onClick={() => handleToggle(true)}
        className={cn(
          "relative transition-all duration-200",
          isAnnual
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10",
        )}
      >
        Anual
        <Badge
          variant="secondary"
          className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs px-1.5 py-0.5"
        >
          -20%
        </Badge>
      </Button>
    </div>
  )
}
