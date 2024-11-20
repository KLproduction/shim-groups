"use client"

import GlobalAccordion from "@/components/global/accordion"
import { Button } from "@/components/ui/button"
import { useCreateModule } from "@/hooks/courses"
import { Plus, PlusCircle, Trash } from "lucide-react"

type Props = {
  courseId: string
  groupId: string
}

const CreateCourseModule = ({ courseId, groupId }: Props) => {
  const { variables, isPending, onCreateModule, data } = useCreateModule(
    courseId,
    groupId,
  )

  if (!data?.groupOwner) return <></>

  return (
    <div className="flex flex-col gap-2">
      <div className=" flex justify-end">
        <PlusCircle
          onClick={onCreateModule}
          className="text-themeGray cursor-pointer hover:text-themeTextGray/60"
        />
      </div>
      {variables && isPending && (
        <div className=" flex gap-3 items-center">
          <Button variant={"ghost"}>
            <Trash size={16} className=" text-red-500" />
          </Button>
          <GlobalAccordion id={variables.moduleId} title={variables.title}>
            <></>
          </GlobalAccordion>
        </div>
      )}
    </div>
  )
}

export default CreateCourseModule
