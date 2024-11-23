import { onAuthenticatedUser } from "@/data/user"
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: "2024-06-20",
})

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams

    const groupid = searchParams.get("groupid")
    const account = await stripe.accounts.create({
      type: "standard",
      country: "GB",

      business_type: "individual",
    })

    if (account) {
      console.log(account)
      const user = await onAuthenticatedUser()
      const integrateStripeAccount = await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeId: account.id,
        },
      })

      if (integrateStripeAccount) {
        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: `http//localhost:3000/callback/stripe/refresh`,
          return_url: `http//localhost:3000/group/${groupid}/setting/integrations`,
          type: "account_onboarding",
        })
        return NextResponse.json({
          url: accountLink.url,
        })
      }
    }
  } catch (err) {
    return new NextResponse(
      `An error occurred when calling the Stripe API to create an account:${err}`,
    )
  }
}
