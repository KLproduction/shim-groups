import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogDescription } from "@radix-ui/react-dialog"
import React from "react"

type Props = {
  trigger: JSX.Element
  children: React.ReactNode
  title: string
  description: string
}

const GlassModal = ({ trigger, children, title, description }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-clip-padding backdrop--blur__safari backdrop-filter backdrop-blur-3xl bg-opacity-20 bg-themeGray border-themeGray">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default GlassModal
