import { db } from "@/lib/db"

export const onSearchPosts = async (
  mode: "GROUPS" | "POSTS",
  query: string,
  paginate?: number,
) => {
  try {
    if (mode === "POSTS") {
      const fetchedPosts = await db.post.findMany({
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        take: 6,
        skip: paginate || 0,
      })
      if (fetchedPosts && fetchedPosts.length > 0) {
        return {
          status: 200,
          posts: fetchedPosts,
        }
      }
      return {
        status: 404,
        message: "No posts found",
      }
    }
  } catch (e) {
    return {
      status: 400,
      message: "Oops! something went wrong",
    }
  }
}
