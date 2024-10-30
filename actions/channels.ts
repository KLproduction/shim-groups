"use server"

import { db } from "@/lib/db"
import { stat } from "fs"

export const onCreateNewChannel = async (
    groupId: string,
    data: {
        id: string
        name: string
        icon: string
    },
) => {
    try {
        const channel = await db.group.update({
            where: {
                id: groupId,
            },
            data: {
                channel: {
                    create: {
                        ...data,
                    },
                },
            },
            select: {
                channel: true,
            },
        })
        if (channel) {
            return {
                status: 200,
                channel: channel.channel,
            }
        }

        return {
            status: 404,
            message: "Channel could not be created",
        }
    } catch (err) {
        return {
            status: 400,
            message: "Oops! something went wrong, try again later",
        }
    }
}

export const onUpdateChannelInfo = async (
    channelId: string,
    name?: string | undefined,
    icon?: string | undefined,
) => {
    try {
        if (name) {
            const channel = await db.channel.update({
                where: {
                    id: channelId,
                },
                data: {
                    name,
                },
            })

            if (channel) {
                return {
                    status: 200,
                    message: "Channel name updated successfully",
                }
            }
            return {
                status: 404,
                message: "Channel not found, try again later",
            }
        }

        if (icon) {
            const channel = await db.channel.update({
                where: {
                    id: channelId,
                },
                data: {
                    icon,
                },
            })

            if (channel) {
                return {
                    status: 200,
                    message: "Channel icon updated successfully",
                }
            }
            return {
                status: 404,
                message: "Channel not found, try again later",
            }
        } else {
            const channel = await db.channel.update({
                where: {
                    id: channelId,
                },
                data: {
                    name,
                    icon,
                },
            })
            if (channel) {
                return {
                    status: 200,
                    message: "Channel updated successfully",
                }
            }
            return {
                status: 404,
                message: "Channel not found, try again later",
            }
        }
    } catch (err) {
        return {
            status: 400,
            message: "Oops! something went wrong, try again later",
        }
    }
}

export const onDeleteChannel = async (channelId: string) => {
    try {
        const channel = await db.channel.delete({
            where: {
                id: channelId,
            },
        })
        if (channel) {
            return {
                status: 200,
                message: "Channel deleted successfully",
            }
        }
        return {
            status: 404,
            message: "Channel not found, try again later",
        }
    } catch (err) {
        return {
            status: 400,
            message: "Oops! something went wrong, try again later",
        }
    }
}
