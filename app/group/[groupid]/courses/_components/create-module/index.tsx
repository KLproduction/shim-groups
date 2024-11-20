"use client"

import GlobalAccordion from "@/components/global/accordion"
import { Button } from "@/components/ui/button"
import { useCreateModule } from "@/hooks/courses"
import { Plus, PlusCircle } from "lucide-react"

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
        <GlobalAccordion id={variables.moduleId} title={variables.title}>
          <Button
            variant={"outline"}
            className=" bg-transparent border-themeGray text-themeTextGray mt-2 flex items-center gap-3"
          >
            <Plus />
          </Button>
        </GlobalAccordion>
      )}
    </div>
  )
}

export default CreateCourseModule
