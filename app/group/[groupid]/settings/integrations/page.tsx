import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { INTEGRATION_LIST_ITEMS } from "@/constants/menu"
import { onGetStripeIntegration } from "@/data/payments"
import Image from "next/image"
import React from "react"
import IntegrationTrigger from "./_components/integration-trigger"

type Props = {
  params: { groupid: string }
}

const page = async ({ params }: Props) => {
  const payment = await onGetStripeIntegration()
  const connection = {
    stripe: payment ? true : false,
  }

  return (
    <div className="flex-1 grid grid-cols-1 p-5 content-start lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {INTEGRATION_LIST_ITEMS.map((item) => (
        <Card className="bg-themeBlack border-themeDarkGray" key={item.name}>
          <CardContent className="flex flex-col p-5 gap-2">
            <div className="flex min-w-full justify-between items-start gap-20">
              <div>
                <div className=" w-10 h-10 relative">
                  <Image
                    src={`/stripe.png`}
                    alt="logo"
                    width={60}
                    height={60}
                  />
                </div>
                <h2 className=" font-bold capitalize">Stripe</h2>
              </div>
              <IntegrationTrigger
                connections={connection}
                title={item.title}
                description={item.description}
                logo={item.logo}
                name={item.name}
                groupId={params.groupid}
              />
            </div>
            <CardDescription>{item.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default page
