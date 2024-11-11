import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import React from "react"

type Props = {
  light?: boolean
}

export const LeaderBoardCard = ({ light }: Props) => {
  return (
    <Card
      className={cn(
        "border-themeGray lg:sticky lg:top-0 mt-10 rounded-xl p-5 overflow-hidden",
        light ? "border-themeGray bg-[#1A1A1D]" : "bg-themeBlack",
      )}
    >
      <h2 className=" text-themeTextWhite text-xl font-bold">
        leaderboard (30-days)
      </h2>
      <p className=" text-sm text-themeTextGray">
        See who performed the best this month.
      </p>
    </Card>
  )
}
