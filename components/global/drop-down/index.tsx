"use client"

import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { PopoverContent } from "@radix-ui/react-popover"
import React, { useState } from "react"

type Props = {
  title: string
  trigger: JSX.Element
  children: React.ReactNode
  ref?: React.RefObject<HTMLButtonElement>
}

const DropDown = ({ title, trigger, children, ref }: Props) => {
  const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)
  const handleToggle = () => {
    setOpen(!open)
  }

  return (
    <Popover open={open} onOpenChange={handleToggle}>
      <PopoverTrigger ref={ref} onClick={handleToggle}>
        {trigger}
      </PopoverTrigger>
      <PopoverContent
        className="rounded-2xl w-56 items-start bg-themeBlack
            bg-clip-padding backdrop--blur__safari backdrop-filter backdrop-blur-4xl p-4 z-[9999]"
      >
        <h4 className="text-sm pl-3">{title}</h4>
        <Separator className="bg-themeGray my-3" />
        <div onClick={handleClose}>{children}</div>
      </PopoverContent>
    </Popover>
  )
}

export default DropDown
