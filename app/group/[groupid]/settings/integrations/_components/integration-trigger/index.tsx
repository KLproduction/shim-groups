import { SimpleModal } from "@/components/global/simple-modal"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2Icon, CloudIcon } from "lucide-react"
import React from "react"
import StripeConnect from "../connect"

type Props = {
  name: string
  logo: string
  title: string
  description: string
  groupId: string
  connections: {
    [key in "stripe"]: boolean
  }
}

const IntegrationTrigger = ({
  connections,
  name,
  logo,
  title,
  description,
  groupId,
}: Props) => {
  return (
    <SimpleModal
      title={title}
      type="Integration"
      logo={logo}
      description={description}
      trigger={
        <Card className=" px-3 py-2 cursor-pointer flex gap-2 bg-themeBlack border-themeGray">
          <CloudIcon />
          {connections[name as "stripe"] ? "Connected" : "Connect"}
        </Card>
      }
    >
      <Separator orientation="horizontal" />
      <div className=" flex flex-col gap-2">
        <h2 className=" font-bold">Stripe would like to access</h2>
        {[
          "Payment and back information",
          "Products and services you sell",
          "Business and tax information",
          "Create and update Products",
        ].map((item, index) => (
          <div key={index} className="flex gap-2 items-center pl-3">
            <CheckCircle2Icon />
            <p>{item}</p>
          </div>
        ))}
        <div className=" flex justify-between mt-10">
          <Button
            variant={"outline"}
            className="bg-themeBlack border-themeGray "
          >
            Learn More
          </Button>
          <StripeConnect connected={connections["stripe"]} groupId={groupId} />
        </div>
      </div>
    </SimpleModal>
  )
}

export default IntegrationTrigger
