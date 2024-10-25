"use server"

import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { decodeBase64 } from "bcryptjs"

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({
            where: {
                email,
            },
        })
        return user
    } catch (e) {
        console.error(e)
    }
}
export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({
            where: {
                id,
            },
        })
        return user
    } catch {
        return null
    }
}

export const onSignInUser = async (id: string) => {
    try {
        const loggedInUser = await db.user.findUnique({
            where: {
                id,
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

        if (loggedInUser) {
            if (loggedInUser.group.length > 0) {
                return {
                    status: 207,
                    id: loggedInUser.id,
                    groupId: loggedInUser.group[0].id,
                    channelId: loggedInUser.group[0].channel[0].id,
                }
            }

            return {
                status: 200,
                message: "User successfully logged in",
                id: loggedInUser.id,
            }
        }

        return {
            status: 400,
            message: "User could not be logged in! Try again",
        }
    } catch (error) {
        return {
            status: 400,
            message: "Oops! something went wrong. Try again",
        }
    }
}

export const onAuthenticatedUser = async () => {
    try {
        const existingUser = await currentUser()
        if (!existingUser) return { status: 404 }

        const userData = await db.user.findUnique({
            where: {
                id: existingUser.id,
            },
            select: {
                id: true,
                name: true,
                image: true,
            },
        })
        if (userData)
            return {
                status: 200,
                id: userData.id,
                image: userData.image,
                username: userData.name,
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
