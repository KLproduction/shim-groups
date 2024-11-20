"use client"

import { Card } from "@/components/ui/card"
import { useCourses } from "@/hooks/courses"
import { truncateString } from "@/lib/utils"
import Link from "next/link"

type Props = {
  groupId: string
}

const CourseList = ({ groupId }: Props) => {
  const { data } = useCourses(groupId)
  console.log(data)

  if (data?.status !== 200) {
    return <></>
  }

  return data?.group?.courses.map((course) => (
    <div key={course.id}>
      <Link href={`/group/${groupId}/courses/${course.id}`}>
        <Card className="max-h-[400px] min-h-[400px] bg-transparent border-themeGray h-full rounded-xl overflow-hidden hover:scale-105 transition-all duration-100">
          <img
            src={`https://ucarecdn.com/${course.thumbnail}/`}
            alt="thumbnail"
            className="h-4/6 w-full opacity-60 object-cover object-center "
          />
          <div className="h-2/6 flex flex-col justify-center pl-5">
            <h2 className="text-lg text-white font-semibold">{course.name}</h2>
            <p className=" text-sm text-themeTextGray">
              {truncateString(course.description)}
            </p>
          </div>
        </Card>
      </Link>
    </div>
  ))
}
export default CourseList
