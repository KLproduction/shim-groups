"use client"

import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { useStripeConnect } from "@/hooks/payment"
import React from "react"

type Props = { connected: boolean; groupId: string }

const StripeConnect = ({ connected, groupId }: Props) => {
  const { onStripeConnect, onStripeAccountPending } = useStripeConnect(groupId)
  return (
    <Button disabled={connected} onClick={onStripeConnect}>
      <Loader loading={onStripeAccountPending}>
        {connected ? "Connected" : "Connect to stripe"}
      </Loader>
    </Button>
  )
}

export default StripeConnect
