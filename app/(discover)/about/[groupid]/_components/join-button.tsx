import { JoinGroupPaymentForm } from "@/components/forms/join-group-payment"
import GlassModal from "@/components/global/glass-modal"
import StripeElements from "@/components/global/stripe/elements"
import { Button } from "@/components/ui/button"
import { onAuthenticatedUser } from "@/data/user"
import { useActiveGroupSubscription, useJoinFree } from "@/hooks/groups"
import React from "react"

type Props = {
  groupId: string
  owner: boolean
}

const JoinButton = ({ groupId, owner }: Props) => {
  const { data, isFetching, isFetched } = useActiveGroupSubscription(groupId)
  const { onJoinFreeGroup } = useJoinFree(groupId)

  if (!owner) {
    if (isFetching) {
      return <div>Loading</div>
    }
    if (data?.status === 200) {
      return (
        <GlassModal
          trigger={
            <Button className="w-full p-10" variant={"ghost"}>
              {data?.subscriptions?.[0] ? (
                <p>Join ${data?.subscriptions?.[0].price as number}/Month</p>
              ) : (
                "Join Free"
              )}
            </Button>
          }
          title="Join Group"
          description="Pay now to join this community"
        >
          <StripeElements>
            <JoinGroupPaymentForm groupId={groupId} />
          </StripeElements>
        </GlassModal>
      )
    }
    return (
      <Button
        onClick={onJoinFreeGroup}
        className="w-full p-10"
        variant={"ghost"}
      >
        Join Now
      </Button>
    )
  }
  return (
    <Button disabled={owner} className="w-full p-10" variant={"ghost"}>
      Owner
    </Button>
  )
}

export default JoinButton
