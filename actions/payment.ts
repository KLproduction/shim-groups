"use server"

import { db } from "@/lib/db"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
  typescript: true,
})
export const onGetStripeClientSecret = async () => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "gbp",
      amount: 9900,
      automatic_payment_methods: {
        enabled: true,
      },
    })
    if (paymentIntent) {
      return { secret: paymentIntent.client_secret }
    }
  } catch (error) {
    return { status: 400, message: "Failed to load form" }
  }
}

export const onTransferCommission = async (destination: string) => {
  try {
    const transfer = await stripe.transfers.create({
      amount: 3960,
      currency: "gbp",
      destination: destination,
    })

    if (transfer) {
      return { status: 200 }
    }
  } catch (error) {
    return { status: 400 }
  }
}

export const onGetGroupSubscriptionPaymentIntent = async (groupId: string) => {
  try {
    const price = await db.subscription.findFirst({
      where: {
        groupId: groupId,
        active: true,
      },
      select: {
        price: true,
        Group: {
          select: {
            User: {
              select: {
                stripeId: true,
              },
            },
          },
        },
      },
    })
    if (price && price.price) {
      const paymentIntent = await stripe.paymentIntents.create(
        {
          currency: "gbp",
          amount: price.price * 100,
          automatic_payment_methods: {
            enabled: true,
          },
        },
        { stripeAccount: price.Group?.User.stripeId! },
      )

      if (paymentIntent) {
        return { secret: paymentIntent.client_secret }
      }
    }
  } catch (e) {
    return { status: 400, message: "Failed to load form" }
  }
}

export const onCreateNewGroupSubscription = async (
  groupId: string,
  price: string,
) => {
  try {
    const subscription = await db.group.update({
      where: {
        id: groupId,
      },
      data: {
        subscription: {
          create: {
            price: parseInt(price),
          },
        },
      },
    })
    if (subscription) {
      return {
        status: 200,
        message: "Successfully created subscription",
      }
    }
    return {
      status: 400,
      message: "Failed to create subscription",
    }
  } catch (e) {
    return {
      status: 400,
      message: "Oops, something went wrong",
    }
  }
}

export const onActivateSubscription = async (id: string) => {
  try {
    const status = await db.subscription.findUnique({
      where: {
        id,
      },
      select: {
        active: true,
      },
    })
    if (status) {
      if (status.active) {
        return {
          status: 200,
          message: "Successfully activated subscription",
        }
      } else {
        const current = await db.subscription.findFirst({
          where: {
            active: true,
          },
          select: {
            id: true,
          },
        })
        if (current && current.id) {
          const deactivate = await db.subscription.update({
            where: {
              id: current.id,
            },
            data: {
              active: false,
            },
          })
          if (deactivate) {
            const activateNew = await db.subscription.update({
              where: {
                id,
              },
              data: {
                active: true,
              },
            })
            if (activateNew) {
              return {
                status: 200,
                message: "New plan activated successfully",
              }
            }
          }
        } else {
          const activateNew = await db.subscription.update({
            where: {
              id,
            },
            data: {
              active: true,
            },
          })
          if (activateNew) {
            return {
              status: 200,
              message: "New plan activated successfully",
            }
          }
        }
      }
    }
  } catch (e) {
    return {
      status: 400,
      message: "Failed to activate subscription",
    }
  }
}
