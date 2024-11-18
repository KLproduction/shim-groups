"use server"

import { db } from "@/lib/db"

export const onGetGroupCourses = async (groupId: string) => {
  try {
    const courses = await db.course.findMany({
      where: {
        groupId: groupId,
      },
      take: 8,
      orderBy: {
        createdAt: "desc",
      },
    })
    if (courses && courses.length > 0) {
      return {
        status: 200,
        courses,
      }
    }

    return {
      status: 404,
      message: "No courses found",
    }
  } catch (error) {
    return {
      status: 400,
      message: "Oops! something went wrong",
    }
  }
}
