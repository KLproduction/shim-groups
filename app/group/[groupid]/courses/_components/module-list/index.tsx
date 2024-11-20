"use client"

import { useCourseModule } from "@/hooks/courses"
import React from "react"

type Props = {
  courseId: string
  groupId: string
}

const CourseModuleList = ({ courseId, groupId }: Props) => {
  const {
    onEditModule,
    edit,
    triggerRef,
    variables,
    pathname,
    isPending,
    groupOwner,
    sectionVariables,
    pendingSection,
    mutateSection,
    setActiveSection,
    activeSection,
    contentRef,
    onEditSection,
    sectionInputRef,
    sectionUpdatePending,
    updateVariables,
    data,
  } = useCourseModule(courseId, groupId)
  return <div>CourseModuleList</div>
}

export default CourseModuleList
