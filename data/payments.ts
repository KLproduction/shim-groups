"use server"

import { db } from "@/lib/db"

export const onGetActiveSubscriptions = async (groupId: string) => {
  try {
    const subscriptions = await db.subscription.findMany({
      where: {
        groupId: groupId,
        active: true,
      },
    })

    if (subscriptions) {
      return {
        status: 200,
        subscriptions,
      }
    }

    return {
      status: 404,
      message: "No subscriptions found",
    }
  } catch (error) {
    return {
      status: 400,
      message: "Oops! something went wrong",
    }
  }
}
