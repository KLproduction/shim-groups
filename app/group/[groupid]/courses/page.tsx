import CourseCreate from "@/components/global/create-course"
import { onGetGroupCourses } from "@/data/course"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import React from "react"
import CourseList from "./_components/course-list"

type Props = {
  params: {
    groupid: string
  }
}

const CoursePage = async ({ params }: Props) => {
  const query = new QueryClient()
  await query.prefetchQuery({
    queryKey: ["group-courses"],
    queryFn: () => onGetGroupCourses(params.groupid),
  })
  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="container grid lg:grid-cols-2 2xl:grid-cols-3 py-10 gap-5">
        <CourseCreate groupId={params.groupid} />
        <CourseList groupId={params.groupid} />
      </div>
    </HydrationBoundary>
  )
}

export default CoursePage
