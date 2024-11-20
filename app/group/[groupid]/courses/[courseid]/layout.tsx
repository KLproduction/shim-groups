import { onGetCourseModules } from "@/data/course"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import CreateCourseModule from "../_components/create-module"
import CourseModuleList from "../_components/module-list"

type Props = {
  params: {
    courseid: string
    groupid: string
  }
  children: React.ReactNode
}

const layout = async ({ params, children }: Props) => {
  const query = new QueryClient()
  await query.prefetchQuery({
    queryKey: ["course-modules", params.courseid],
    queryFn: () => onGetCourseModules(params.courseid),
  })
  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className=" grid grid-cols-1 lg:grid-cols-4 h-full overflow-hidden">
        <div className=" bg-themeBlack p-5 overflow-y-auto">
          <div className="">
            <CreateCourseModule
              courseId={params.courseid}
              groupId={params.groupid}
            />
          </div>
          <CourseModuleList
            courseId={params.courseid}
            groupId={params.groupid}
          />
        </div>
        <div className="lg:col-span-3 max-h-full h-full pb-10 overflow-y-auto bg-[#101011]/90">
          {children}
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default layout
