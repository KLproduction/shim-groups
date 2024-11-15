"use server"

import { db } from "@/lib/db"
import { onAuthenticatedUser } from "./user"

export const onGetChannelInfo = async (channelId: string) => {
  try {
    const user = await onAuthenticatedUser()
    const channel = await db.channel.findUnique({
      where: {
        id: channelId,
      },
      include: {
        posts: {
          take: 3,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            channel: {
              select: {
                name: true,
              },
            },
            author: {
              select: {
                name: true,
                image: true,
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
            likes: {
              where: {
                userId: user.id,
              },
              select: {
                userId: true,
                id: true,
              },
            },
          },
        },
      },
    })
    return channel
  } catch (error) {
    return {
      status: 400,
      message: "Oops! something went wrong",
    }
  }
}

export const onCreateChannelPost = async (
  channelid: string,
  title: string,
  content: string,
  htmlContent: string,
  jsonContent: string,
  postid: string,
) => {
  try {
    const user = await onAuthenticatedUser()
    const post = await db.post.create({
      data: {
        id: postid,
        authorId: user.id!,
        channelId: channelid,
        title,
        content,
        htmlContent,
        jsonContent,
      },
    })

    if (post) {
      return { status: 200, message: "Post successfully created" }
    }

    return { status: 404, message: "Channel not found" }
  } catch (error) {
    return { status: 400, message: "Oops! something went wrong" }
  }
}

export const onLikeChannelPost = async (postid: string, likeid: string) => {
  try {
    const user = await onAuthenticatedUser()

    const liked = await db.like.findFirst({
      where: {
        id: likeid,
        userId: user.id!,
      },
    })

    if (liked) {
      await db.like.delete({
        where: {
          id: likeid,
          userId: user.id,
        },
      })

      return { status: 200, message: "You unliked this post" }
    }

    const like = await db.like.create({
      data: {
        id: likeid,
        postId: postid,
        userId: user.id!,
      },
    })

    if (like) return { status: 200, message: "You liked this post" }

    return { status: 404, message: "Post not found!" }
  } catch (error) {
    console.log(error)
    return { status: 400, message: "Something went wrong" }
  }
}

export const onGetScrollPost = async (
  channelId: string,
  pageParam: number = 0,
) => {
  try {
    const user = await onAuthenticatedUser()
    const posts = await db.post.findMany({
      where: {
        channelId: channelId,
      },
      skip: pageParam,
      take: 2,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        channel: {
          select: {
            name: true,
          },
        },
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        likes: {
          where: {
            userId: user.id,
          },
          select: {
            id: true,
            userId: true,
          },
        },
      },
    })

    if (posts) {
      // Assuming that `take: 2` is the limit for each page
      const hasMore = posts.length === 2
      const nextPage = hasMore ? pageParam + 2 : undefined

      return {
        status: 200,
        posts,
        nextPage,
      }
    } else {
      return {
        status: 200,
        posts: [],
        nextPage: undefined,
      }
    }
  } catch (e) {
    return {
      status: 404,
      message: "No posts found",
    }
  }
}
