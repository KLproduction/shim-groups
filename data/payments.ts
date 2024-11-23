"use server"

import { db } from "@/lib/db"
import { onAuthenticatedUser } from "./user"

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

export const onGetStripeIntegration = async () => {
  try {
    const user = await onAuthenticatedUser()
    const stripeId = await db.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        stripeId: true,
      },
    })
    if (stripeId) {
      return {
        status: 200,
        stripeId: stripeId.stripeId,
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
