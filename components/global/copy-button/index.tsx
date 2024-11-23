"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Copy } from "lucide-react"
import React from "react"
import { toast } from "sonner"

type Props = {
  content: string
  className?: string
}

const CopyButton = ({ content, className }: Props) => {
  return (
    <Button
      onClick={() => {
        navigator.clipboard.writeText(content)
        toast.message("Affiliate link Copied to clipboard")
      }}
      className={cn(
        "bg-black border-themeGray flex hover:bg-themeDarkGray gap-3",
        className,
      )}
      variant={"outline"}
    >
      <Copy size={20} />
      Copy Link
    </Button>
  )
}

export default CopyButton
