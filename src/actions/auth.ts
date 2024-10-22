"use server"

import { db } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export const onAuthenticatedUser = async () => {
    try {
        const clerk = await currentUser()
        if (!clerk) {
            return { status: 404 }
        }

        const user = await db.user.findUnique({
            where: {
                clerkId: clerk.id,
            },
            select: {
                id: true,
                firstname: true,
                lastname: true,
            },
        })

        if (user) {
            return {
                status: 200,
                id: user.id,
                image: clerk.imageUrl,
                username: `${user.firstname} ${user.lastname}`,
            }
        }
        return { status: 404 }
    } catch (err) {
        console.log(err)
        return { status: 400 }
    }
}

export const onSignUpUser = async (data: {
    firstname: string
    lastname: string
    image: string
    clerkId: string
}) => {
    try {
        const createdUser = await db.user.create({
            data: {
                ...data,
            },
        })

        if (createdUser) {
            return {
                status: 200,
                message: "User successfully created",
                id: createdUser.id,
            }
        }

        return {
            status: 400,
            message: "User creation failed, Try again",
        }
    } catch (err) {
        console.log(err)
        return {
            status: 400,
            message: "Oops something went wrong",
        }
    }
}
