import { onGetGroupInfo } from "@/data/groups"
import { onGetActiveSubscriptions } from "@/data/payments"
import { onAuthenticatedUser } from "@/data/user"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import React from "react"
import AboutGroup from "./_components/about-group"
import GroupSideWidget from "@/components/global/group-side-widget"
import Link from "next/link"
import { FaBackward } from "react-icons/fa"

type Props = {
  params: {
    groupid: string
  }
}

const AboutPage = async ({ params }: Props) => {
  const query = new QueryClient()
  await query.prefetchQuery({
    queryKey: ["about-group-info", params.groupid],
    queryFn: () => onGetGroupInfo(params.groupid),
  })
  await query.prefetchQuery({
    queryKey: ["active-subscription"],
    queryFn: () => onGetActiveSubscriptions(params.groupid),
  })

  const user = await onAuthenticatedUser()

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <Link
        href={`/explore`}
        className="absolute top-20 left-10 cursor-pointer hover:underline flex gap-3 items-center z-30"
      >
        <FaBackward />
        BACK TO EXPLORE
      </Link>
      <div className="relative pt-36 pb-10 container grid grid-cols-1 lg:grid-cols-3 gap-x-10">
        <div className="col-span-1 lg:col-span-2">
          <AboutGroup
            key={params.groupid}
            userId={user.id!}
            groupId={params.groupid}
          />
        </div>
        <div className=" col-span-1 relative">
          <GroupSideWidget groupId={params.groupid} userId={user.id!} />
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default AboutPage
