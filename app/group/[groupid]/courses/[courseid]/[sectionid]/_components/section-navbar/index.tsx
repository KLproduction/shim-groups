"use client"

import { Button } from "@/components/ui/button"
import { useSectionNavBar } from "@/hooks/channels"
import { Check } from "lucide-react"
import React from "react"

type Props = {
  sectionId: string
  courseId: string
}

const SectionNavBar = ({ sectionId, courseId }: Props) => {
  const { data, isPending, mutate } = useSectionNavBar(sectionId, courseId)
  if (data?.status !== 200) return null
  return (
    <div className="flex justify-between p-5 overflow-y-auto items-center">
      <div>
        <p className=" text-themeTextGray ">Course Title</p>
        <h2 className=" text-3xl text-themeTextWhite font-bold">
          {data.section?.name}
        </h2>
      </div>
      <div>
        <Button
          className="bg-themeDarkGray flex gap-3 items-center border-themeGray text-themeTextWhite"
          variant={"outline"}
          onClick={() => mutate()}
        >
          <Check size={16} />
          {isPending
            ? "Completed"
            : !data.section?.complete
              ? "Mark as complete"
              : "Completed"}
        </Button>
      </div>
    </div>
  )
}

export default SectionNavBar
