"use client"

import GlobalAccordion from "@/components/global/accordion"
import { IconRender } from "@/components/global/icon-render"
import { AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCourseModule } from "@/hooks/courses"
import { EmptyCircle, PurpleCheck } from "@/icons"
import { ArrowDown, Plus, Trash } from "lucide-react"
import Link from "next/link"
import React from "react"
import { v4 } from "uuid"

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
    inputRef,
    deleteModule,
    editSection,
  } = useCourseModule(courseId, groupId)

  return (
    <div className=" flex flex-col">
      {data?.status === 200 &&
        data.modules?.map((module) => (
          <div key={module.id} className=" flex gap-3 items-center ">
            <Button onClick={() => deleteModule(module.id)} variant={"ghost"}>
              <Trash size={16} className=" text-red-500" />
            </Button>
            <GlobalAccordion
              id={module.id}
              edit={edit}
              editable={
                <Input
                  ref={inputRef}
                  className="bg-themeBlack border-themeGray"
                />
              }
              onEdit={() => onEditModule(module.id)}
              title={isPending ? variables?.content! : module.title}
            >
              <AccordionContent className=" flex flex-col gap-2 px-3">
                {module.section.length ? (
                  module.section.map((section) => (
                    <Link
                      ref={contentRef}
                      onDoubleClick={() => onEditModule}
                      onClick={() => setActiveSection(section.id)}
                      className=" flex gap-3 items-center capitalize"
                      key={section.id}
                      href={`/group/${groupId}/courses/${courseId}/${section.id}`}
                    >
                      {section.complete ? <PurpleCheck /> : <EmptyCircle />}
                      <IconRender
                        icon={section.icon}
                        mode={
                          pathname.split("/").pop() === section.id
                            ? "LIGHT"
                            : "DARK"
                        }
                      />

                      {editSection && activeSection === section.id ? (
                        <Input
                          ref={sectionInputRef}
                          className="flex-1 bg-transparent border-none p-0"
                        />
                      ) : sectionUpdatePending &&
                        activeSection === section.id ? (
                        updateVariables?.content
                      ) : (
                        section.name
                      )}
                    </Link>
                  ))
                ) : (
                  <></>
                )}
                {groupOwner?.groupOwner && (
                  <>
                    {pendingSection && sectionVariables && (
                      <Link
                        onClick={() =>
                          setActiveSection(sectionVariables.sectionId)
                        }
                        href={`/group/${groupId}/courses/${courseId}/${sectionVariables.sectionId}`}
                        className="flex gap-3 items-center"
                      >
                        <EmptyCircle />
                        <IconRender
                          icon={"doc"}
                          mode={
                            pathname.split("/").pop() === activeSection
                              ? "LIGHT"
                              : "DARK"
                          }
                        />
                        New Section
                      </Link>
                    )}
                    <Button
                      onClick={() =>
                        mutateSection({
                          moduleId: module.id,
                          sectionId: v4(),
                        })
                      }
                      variant={"outline"}
                      className=" bg-transparent border text-themeTextGray mt-2"
                    >
                      <Plus />
                    </Button>
                  </>
                )}
              </AccordionContent>
            </GlobalAccordion>
          </div>
        ))}
    </div>
  )
}

export default CourseModuleList
