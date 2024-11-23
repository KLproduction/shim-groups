"use server"

import { db } from "@/lib/db"
import { CreateGroupSchema } from "@/schemas"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import { onAuthenticatedUser } from "./user"
import { sub } from "date-fns"
import { revalidatePath } from "next/cache"
import { stat } from "fs"
import { group } from "console"
import { QueryClient } from "@tanstack/react-query"

export const onGetAffiliateInfo = async (id: string) => {
  try {
    const affiliateInfo = await db.affiliate.findFirst({
      where: {
        id,
      },
      select: {
        Group: {
          select: {
            User: {
              select: {
                name: true,
                image: true,
                id: true,
                stripeId: true,
              },
            },
          },
        },
      },
    })

    if (affiliateInfo) {
      return { status: 200, user: affiliateInfo }
    }

    return { status: 404 }
  } catch (error) {
    return { status: 400 }
  }
}

export const onCreateNewGroup = async (
  userId: string,
  data: z.infer<typeof CreateGroupSchema>,
) => {
  try {
    const created = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        group: {
          create: {
            ...data,
            affiliate: {
              create: {},
            },
            member: {
              create: {
                userId: userId,
              },
            },
            channel: {
              create: [
                {
                  id: uuidv4(),
                  name: "general",
                  icon: "general",
                },
                {
                  id: uuidv4(),
                  name: "announcements",
                  icon: "announcement",
                },
              ],
            },
          },
        },
      },
      select: {
        id: true,
        group: {
          select: {
            id: true,
            channel: {
              select: {
                id: true,
              },
              take: 1,
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        },
      },
    })

    if (created) {
      return {
        status: 200,
        data: created,
        message: "Group created successfully",
      }
    }
  } catch (error) {
    return {
      status: 400,
      message: "Oops! group creation failed, try again later",
    }
  }
}

export const onGetGroupInfo = async (groupId: string) => {
  try {
    const user = await onAuthenticatedUser()
    const group = await db.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        channel: true,
        courses: true,
      },
    })

    if (group) {
      return {
        status: 200,
        group,
        groupOwner: user.id === group.userId ? true : false,
      }
    }

    return {
      status: 404,
    }
  } catch (error) {
    return {
      status: 400,
    }
  }
}

export const onGetUserGroups = async (id: string) => {
  try {
    const groups = await db.user.findUnique({
      where: {
        id,
      },
      select: {
        group: {
          select: {
            id: true,
            name: true,
            icon: true,
            channel: {
              where: {
                name: "general",
              },
              select: {
                id: true,
              },
            },
          },
        },
        membership: {
          select: {
            Group: {
              select: {
                id: true,
                icon: true,
                name: true,
                channel: {
                  where: {
                    name: "general",
                  },
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (groups && (groups.group.length > 0 || groups.membership.length > 0)) {
      return {
        status: 200,
        groups: groups.group,
        members: groups.membership,
      }
    }

    return {
      status: 404,
    }
  } catch (error) {
    return { status: 400 }
  }
}

export const onGetGroupChannels = async (groupId: string) => {
  try {
    const channels = await db.channel.findMany({
      where: {
        groupId: groupId,
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return {
      status: 200,
      channels,
    }
  } catch (error) {
    return {
      status: 400,
      message: "Oops! something went wrong",
    }
  }
}

export const onGetGroupSubscriptions = async (groupId: string) => {
  try {
    const subscriptions = await db.subscription.findMany({
      where: {
        groupId: groupId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const count = await db.members.count({
      where: {
        groupId: groupId,
      },
    })

    if (subscriptions) {
      return {
        status: 200,
        subscriptions,
        count,
      }
    }
  } catch (error) {
    return {
      status: 400,
    }
  }
}

export const onGetAllGroupMembers = async (groupId: string) => {
  try {
    const user = await onAuthenticatedUser()
    const members = await db.members.findMany({
      where: {
        groupId: groupId,
        NOT: {
          userId: user.id,
        },
      },
      include: {
        User: true,
      },
    })

    if (members && members.length > 0) {
      return {
        status: 200,
        members,
      }
    }

    return {
      status: 404,
      message: "No members found",
    }
  } catch (error) {
    return {
      status: 400,
      message: "Oops! something went wrong",
    }
  }
}

export const onSearchGroups = async (
  mode: "GROUPS" | "POSTS",
  query: string,
  paginate?: number,
) => {
  try {
    if (mode === "GROUPS") {
      const fetchedGroups = await db.group.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        take: 6,
        skip: paginate || 0,
      })
      if (fetchedGroups && fetchedGroups.length > 0) {
        return {
          status: 200,
          groups: fetchedGroups,
        }
      }
      return {
        status: 404,
        message: "No groups found",
      }
    }
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

export const onUpDateGroupSettings = async (
  groupId: string,
  type:
    | "IMAGE"
    | "ICON"
    | "NAME"
    | "DESCRIPTION"
    | "JSONDESCRIPTION"
    | "HTMLDESCRIPTION",
  content: string,
  path: string,
) => {
  try {
    if (type === "IMAGE") {
      await db.group.update({
        where: {
          id: groupId,
        },
        data: {
          thumbnail: content,
        },
      })
      revalidatePath(path)
      return {
        status: 200,
      }
    }

    if (type === "ICON") {
      await db.group.update({
        where: {
          id: groupId,
        },
        data: {
          icon: content,
        },
      })
      revalidatePath(path)
      return {
        status: 200,
      }
    }
    if (type === "NAME") {
      await db.group.update({
        where: {
          id: groupId,
        },
        data: {
          name: content,
        },
      })
      revalidatePath(path)
      return {
        status: 200,
      }
    }
    if (type === "DESCRIPTION") {
      await db.group.update({
        where: {
          id: groupId,
        },
        data: {
          description: content,
        },
      })
      revalidatePath(path)
      return {
        status: 200,
      }
    }
    if (type === "JSONDESCRIPTION") {
      await db.group.update({
        where: {
          id: groupId,
        },
        data: {
          jsonDescription: content,
        },
      })
      revalidatePath(path)
      return {
        status: 200,
      }
    }
    if (type === "HTMLDESCRIPTION") {
      await db.group.update({
        where: {
          id: groupId,
        },
        data: {
          htmlDescription: content,
        },
      })
      revalidatePath(path)
      return {
        status: 200,
      }
    }
    return {
      status: 404,
    }
  } catch (e) {
    console.error(e)
    return {
      status: 400,
    }
  }
}

export const onGetExploreGroups = async (
  category: string,
  paginate: number,
) => {
  try {
    const groups = await db.group.findMany({
      where: {
        category,
        NOT: {
          description: null,
          thumbnail: null,
        },
      },
      take: 6,
      skip: paginate,
    })

    if (groups) {
      return {
        status: 200,
        groups,
      }
    }
    return {
      status: 404,
      message: "No groups found for this category",
    }
  } catch (e) {
    return {
      status: 400,
      message: "Oops! something went wrong",
    }
  }
}

export const onGetPaginatedPosts = async (
  identifier: string,
  paginate: number,
) => {
  try {
    const user = await onAuthenticatedUser()
    const posts = await db.post.findMany({
      where: {
        channelId: identifier,
      },
      skip: paginate,
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
    if (posts && posts.length > 0) {
      return {
        status: 200,
        posts,
      }
    }
  } catch (e) {
    return {
      status: 404,
      message: "No posts found",
    }
  }
}

export const onUpdateGallery = async (groupId: string, content: string) => {
  try {
    const isYouTubeLink = (url: string) => {
      const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/
      return youtubeRegex.test(url)
    }

    const convertToEmbedLink = (url: string) => {
      const youtubeRegex =
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/
      const match = url.match(youtubeRegex)
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`
      }
      return url
    }

    if (isYouTubeLink(content)) {
      content = convertToEmbedLink(content)
    }

    const mediaLimit = await db.group.findUnique({
      where: {
        id: groupId,
      },
      select: {
        gallery: true,
      },
    })

    if (mediaLimit && mediaLimit.gallery.length < 6) {
      await db.group.update({
        where: {
          id: groupId,
        },
        data: {
          gallery: { push: content },
        },
      })
      revalidatePath(`/about/${groupId}`)
      return {
        status: 200,
      }
    }
    return {
      status: 400,
      message: "Looks like you have reached the maximum media allowed.",
    }
  } catch (e) {
    return {
      status: 400,
      message: "Oops! something went wrong",
    }
  }
}

export const onJoinGroup = async (groupId: string) => {
  try {
    const user = await onAuthenticatedUser()
    const member = await db.group.update({
      where: {
        id: groupId,
      },
      data: {
        member: {
          create: {
            userId: user.id,
          },
        },
      },
    })
    if (member) {
      return {
        status: 200,
        message: "Successfully joined group",
      }
    }
    return {
      status: 400,
      message: "No group or user found",
    }
  } catch (e) {
    return {
      status: 400,
      message: "Oops! something went wrong",
    }
  }
}

export const onDeleteGallery = async (groupId: string, galleryId: string) => {
  try {
    const query = new QueryClient()
    const group = await db.group.findUnique({
      where: {
        id: groupId,
      },
    })

    if (group) {
      const updatedGallery = group.gallery.filter((gal) => gal !== galleryId)

      const updateGroup = await db.group.update({
        where: {
          id: groupId,
        },
        data: {
          gallery: updatedGallery,
        },
      })

      if (updateGroup) {
        query.invalidateQueries({ queryKey: ["about-group-info", groupId] })
        return {
          status: 200,
          message: "Gallery deleted",
        }
      }
      return {
        status: 404,
        message: "Gallery not found",
      }
    }
  } catch (err) {
    return {
      status: 400,
      message: "Oops, something went wrong, try later",
    }
  }
}

export const onGetAffiliateLink = async (groupId: string) => {
  try {
    const affiliate = await db.affiliate.findUnique({
      where: {
        groupId: groupId,
      },
      select: {
        id: true,
      },
    })

    if (affiliate) {
      return {
        status: 200,
        affiliate,
      }
    }
    return {
      status: 404,
    }
  } catch (e) {
    return {
      status: 400,
    }
  }
}

export const onVerifyAffiliateLink = async (id: string) => {
  try {
    const link = await db.affiliate.findUnique({
      where: { id },
    })
    if (link) {
      return {
        status: 200,
      }
    }
    return {
      status: 404,
    }
  } catch (e) {
    return {
      status: 400,
    }
  }
}

export const onGetUserFromMembership = async (membershipId: string) => {
  try {
    const member = await db.members.findUnique({
      where: {
        id: membershipId,
      },
      select: {
        User: true,
      },
    })
    if (member) {
      return {
        status: 200,
        user: member,
      }
    }
    return {
      status: 404,
    }
  } catch (e) {
    return {
      status: 400,
    }
  }
}

export const onGetAllUserMessages = async (recieverId: string) => {
  try {
    const sender = await onAuthenticatedUser()
    const messages = await db.message.findMany({
      where: {
        senderid: {
          in: [sender.id!, recieverId],
        },
        recieverId: {
          in: [sender.id!, recieverId],
        },
      },
    })

    if (messages && messages.length > 0) {
      return { status: 200, messages }
    }

    return { status: 404 }
  } catch (error) {
    return { status: 400, message: "Oops something went wrong" }
  }
}

export const onGetPostInfo = async (postId: string) => {
  try {
    const user = await onAuthenticatedUser()
    const post = await db.post.findUnique({
      where: {
        id: postId,
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
            userId: user.id!,
          },
          select: {
            userId: true,
            id: true,
          },
        },
        comments: true,
      },
    })

    if (post) {
      return { status: 200, post }
    }
    return { status: 404, message: "No post found" }
  } catch (e) {
    return { status: 400, message: "Oops something went wrong" }
  }
}

export const onGetPostComments = async (postId: string) => {
  try {
    const comments = await db.comment.findMany({
      where: {
        postId: postId,
        replied: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        _count: {
          select: {
            reply: true,
          },
        },
      },
    })

    if (comments && comments.length > 0) {
      return { status: 200, comments }
    }

    return { status: 404, message: "No comments found" }
  } catch (e) {
    return { status: 400, message: "Oops something went wrong" }
  }
}

export const onGetCommentReplies = async (commentId: string) => {
  try {
    const replies = await db.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        reply: {
          include: {
            user: true,
          },
        },
      },
    })
    if (replies && replies.reply && replies.reply.length > 0) {
      return {
        status: 200,
        replies: replies.reply,
      }
    }
    return {
      status: 404,
      message: "No replies found",
    }
  } catch (e) {
    return {
      status: 400,
      message: "Oops something went wrong",
    }
  }
}
