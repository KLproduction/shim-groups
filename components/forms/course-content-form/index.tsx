"use client"

import { Loader } from "@/components/global/loader"
import BlockTextEditor from "@/components/global/rich-text-editor"
import { Button } from "@/components/ui/button"
import { useCourseContent, useCourseSectionInfo } from "@/hooks/courses"
import React from "react"

type Props = {
  groupUserId: string
  sectionId: string
  userId: string
}

const CourseContentForm = ({ groupUserId, sectionId, userId }: Props) => {
  const { data } = useCourseSectionInfo(sectionId)
  const {
    errors,
    onUpdateContent,
    setOnJsonDescription,
    setOnDescription,
    onEditDescription,
    setOnHtmlDescription,
    editor,
    isPending,
  } = useCourseContent(
    sectionId,
    data?.section?.content || null,
    data?.section?.JsonContent || null,
    data?.section?.htmlContent || null,
  )
  return (
    groupUserId === userId && (
      <form
        onSubmit={onUpdateContent}
        className="p-5 flex flex-col border-[1px] border-themeGray rounded-2xl"
        ref={editor}
      >
        <BlockTextEditor
          onEdit={onEditDescription}
          max={10000}
          inline
          min={100}
          disabled={userId === groupUserId ? false : true}
          name="jsoncontent"
          errors={errors}
          setContent={setOnJsonDescription || undefined}
          content={JSON.parse(data?.section?.JsonContent as string)}
          htmlContent={data?.section?.htmlContent!}
          setHtmlContent={setOnHtmlDescription}
          textContent={data?.section?.content || undefined}
          setTextContent={setOnDescription}
        />
        {onEditDescription && (
          <Button
            className="mt-10 self-end bg-themeBlack border-themeGray"
            variant={"outline"}
          >
            <Loader loading={isPending}>Save Content</Loader>
          </Button>
        )}
      </form>
    )
  )
}

export default CourseContentForm
