import GroupSideWidget from "@/components/global/group-side-widget"
import { onGetGroupInfo, onGetPostComments, onGetPostInfo } from "@/data/groups"
import { onAuthenticatedUser } from "@/data/user"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import React from "react"
import PostInfo from "./_components/post-info"
import PostCommentForm from "@/components/forms/post-comment-form"
import PostComment from "./_components/post-comment"

type Props = {
  params: {
    postid: string
    groupid: string
    channelid: string
  }
}

const PostPage = async ({ params }: Props) => {
  const query = new QueryClient()

  await query.prefetchQuery({
    queryKey: ["unique-post", params.postid],
    queryFn: () => onGetPostInfo(params.postid),
  })

  await query.prefetchQuery({
    queryKey: ["post-comments", params.postid],
    queryFn: () => onGetPostComments(params.postid),
  })

  await query.prefetchQuery({
    queryKey: ["about-group-info", params.groupid],
    queryFn: () => onGetGroupInfo(params.groupid),
  })

  const user = await onAuthenticatedUser()
  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="grid grid-cols-4 p-5 gap-10 ">
        <div className="col-span-4 lg:col-span-3">
          <PostInfo id={params.postid} channelid={params.channelid} />
          <PostCommentForm
            username={user.username!}
            image={user.image!}
            postId={params.postid}
          />
          <PostComment postId={params.postid} />
        </div>
        <GroupSideWidget light groupId={params.groupid} userId={user.id!} />
      </div>
    </HydrationBoundary>
  )
}

export default PostPage
