import GroupSideWidget from "@/components/global/group-side-widget"
import { onGetChannelInfo } from "@/data/channels"
import { onAuthenticatedUser } from "@/data/user"
import { currentUser } from "@clerk/nextjs/server"
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query"
import GroupNav from "../../_components/group-nav"
import { onGetGroupInfo } from "@/data/groups"
import { LeaderBoardCard } from "@/app/group/_components/mobile-nav/leader-board"
import CreateNewPost from "./_components/create-post"
import PostFeed from "./_components/post-feed"

type Props = {
  params: { channelid: string; groupid: string }
}

const GroupChannelPage = async ({ params }: Props) => {
  const client = new QueryClient()
  const user = await onAuthenticatedUser()

  await client.prefetchQuery({
    queryKey: ["channel-info"],
    queryFn: () => onGetChannelInfo(params.channelid),
  })

  await client.prefetchQuery({
    queryKey: ["about-group-info", params.groupid],
    queryFn: () => onGetGroupInfo(params.groupid),
  })

  // await client.prefetchQuery({
  //   queryKey: ["scroll-posts", params.channelid],
  //   queryFn: () => onGetChannelInfo(params.channelid),
  // })
  return (
    <HydrationBoundary state={dehydrate(client)}>
      <div className="grid lg:grid-cols-4 grid-cols-1 w-full flex-1 h-0 gap-x-5 px-5 s">
        <div className="col-span-1 lg:inline relative hidden py-5">
          <LeaderBoardCard light />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-y-5 py-5">
          <GroupNav orientation="desktop" />
          <CreateNewPost
            userImage={user?.image!}
            channelid={params.channelid}
            username={user?.username!}
          />

          <PostFeed channelId={params.channelid} userId={user?.id!} />
        </div>
        <div className="col-span-1 hidden lg:inline relative py-5">
          <GroupSideWidget light groupId={params.groupid} userId={user?.id!} />
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default GroupChannelPage
