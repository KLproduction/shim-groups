import { GroupSubscriptionForm } from "@/components/forms/group-subscription"
import React from "react"
import Subscriptions from "./_components/show-subscriptions"

type Props = {
  params: { groupid: string }
}

const SubScriptionsPage = ({ params }: Props) => {
  return (
    <div className=" p-10 flex flex-col gap-10">
      <h2 className="font-bold text-3xl">Group Subscriptions</h2>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <GroupSubscriptionForm groupId={params.groupid} />
        <Subscriptions groupId={params.groupid} />
      </div>
    </div>
  )
}

export default SubScriptionsPage
