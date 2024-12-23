import { Card } from "@/components/ui/card"
import { truncateString } from "@/lib/utils"
import Link from "next/link"
import React from "react"

type Props = {
  id: string
  category: string
  createdAt: Date
  name: string
  userId: string
  thumbnail: string | null
  description: string | null
  privacy: "PUBLIC" | "PRIVATE"
  preview?: string
}

const GroupCard = ({
  id,
  category,
  preview,
  name,
  createdAt,
  userId,
  thumbnail,
  description,
  privacy,
}: Props) => {
  return (
    <Link href={`/about/${id}`} passHref>
      <Card className="bg-themeBlack border-themeGray rounded-xl overflow-hidden">
        <img
          src={preview || `https://ucarecdn.com/${thumbnail}/`}
          alt="thumbnail"
          className=" w-full optional-70 h-56 object-cover object-center"
        />
        <div className="p-6">
          <h3 className="text-lg text-themeTextGray font-bold ">{name}</h3>
          <p className="text-base text-themeTextGray">
            {description && truncateString(description)}
          </p>
        </div>
      </Card>
    </Link>
  )
}

export default GroupCard
