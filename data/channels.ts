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
