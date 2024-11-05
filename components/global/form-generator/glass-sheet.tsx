"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useState } from "react"

type Props = {
  children: React.ReactNode
  trigger: React.ReactNode
  className?: string
  triggerClassName?: string
  side?: "left" | "right" | "top" | "bottom"
}

const GlassSheet = ({
  children,
  trigger,
  className,
  triggerClassName,
  side,
}: Props) => {
  const [open, setOpen] = useState(false)
  const handleToggle = () => {
    setOpen(!open)
  }
  return (
    <>
      <Sheet open={open} onOpenChange={handleToggle}>
        <SheetTrigger className={cn(triggerClassName)} asChild>
          {trigger}
        </SheetTrigger>
        <SheetContent
          side={!side ? "left" : side}
          className={cn(
            className,
            "bg-chip-padding backdrop-filter backdrop--blur__safari backdrop-blur-sm bg-opacity-10 bg-transparent border-themeGray",
          )}
        >
          <div onClick={handleToggle}>{children}</div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default GlassSheet
