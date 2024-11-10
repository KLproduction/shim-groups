import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"
import React from "react"

type Props = {
  optimisitc?: boolean
  price: string
  members: string
  onClick?(): void
  active?: boolean
}

const SubscriptionCard = ({
  optimisitc,
  price,
  members,
  onClick,
  active,
}: Props) => {
  return (
    <Card
      className={cn(
        "bg-themeBlack cursor-pointer text-themeTextGray flex flex-col gap-3 justify-center aspect-video items-center",
        optimisitc ? "opacity-60" : "",
        active ? "border-orange-500 border-2" : "border-none",
      )}
      onClick={onClick}
    >
      <h3 className="text-2xl">${price}/Month</h3>
      <div className=" flex items-center gap-2 text-sm">
        <User size={20} />
        <p>{members}Members</p>
      </div>
    </Card>
  )
}

export default SubscriptionCard
