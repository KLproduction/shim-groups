"use client"

import { useAllSubscriptions } from "@/hooks/payment"
import React, { useState } from "react"
import SubscriptionCard from "../subscription-card"
import { useRouter } from "next/navigation"

type Props = {
  groupId: string
}

const Subscriptions = ({ groupId }: Props) => {
  const route = useRouter()
  const { data, mutate } = useAllSubscriptions(groupId)
  const [activeSubscriptionId, setActiveSubscriptionId] = useState<
    string | null
  >(null)

  const handleSubscriptionClick = (subscriptionId: string) => {
    mutate({ id: subscriptionId })
    setActiveSubscriptionId(subscriptionId)
    route.refresh()
  }

  return (
    data?.status == 200 &&
    data.subscriptions &&
    data.subscriptions.map((subscription) => (
      <SubscriptionCard
        key={subscription.id}
        onClick={() => handleSubscriptionClick(subscription.id)}
        price={`${subscription.price}`}
        members={`${data.count}`}
        active={subscription.active}
      />
    ))
  )
}
export default Subscriptions
