"use server"

import { db } from "@/lib/db"
import { CreateGroupSchema } from "@/schemas"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import { onAuthenticatedUser } from "./user"
import { sub } from "date-fns"

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
  } catch (e) {
    return {
      status: 400,
      message: "Oops! something went wrong",
    }
  }
}
