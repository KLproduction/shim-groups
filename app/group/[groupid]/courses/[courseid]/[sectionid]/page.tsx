import CourseContentForm from "@/components/forms/course-content-form"
import { onGetGroupInfo } from "@/data/groups"
import { onAuthenticatedUser } from "@/data/user"
import React from "react"

type Props = {
  params: {
    sectionid: string
    groupid: string
    courseid: string
  }
}

const SectionPage = async ({ params }: Props) => {
  const user = await onAuthenticatedUser()
  const group = await onGetGroupInfo(params.groupid)

  return (
    <div className="p-5">
      <CourseContentForm
        groupUserId={group.group?.userId!}
        sectionId={params.sectionid}
        userId={user.id!}
      />
    </div>
  )
}

export default SectionPage
