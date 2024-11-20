import { onGetSectionInfo } from "@/data/course"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import React from "react"
import SectionNavBar from "./_components/section-navbar"

type Props = {
  children: React.ReactNode
  params: {
    sectionid: string
    courseid: string
  }
}

const CourseContentPageLayout = async ({ children, params }: Props) => {
  const query = new QueryClient()
  await query.prefetchQuery({
    queryKey: ["section-info", params.sectionid],
    queryFn: () => onGetSectionInfo(params.sectionid),
  })
  return (
    <HydrationBoundary state={dehydrate(query)}>
      <SectionNavBar sectionId={params.sectionid} courseId={params.courseid} />
      <div className=" h-full">{children}</div>
    </HydrationBoundary>
  )
}

export default CourseContentPageLayout
