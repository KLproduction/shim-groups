"use client"

import HTMLparser from "@/components/global/html-parser"
import NoResult from "@/components/global/search/no-result"
import { useGetPost } from "@/hooks/channels"
import React from "react"
import { Interactions } from "../../../_components/post-feed/interactions"
import { PostAuthor } from "../../../_components/post-feed/post-author"

type Props = {
  id: string
  channelid: string
}

const PostInfo = ({ id, channelid }: Props) => {
  const { data } = useGetPost(id)

  if (!data) {
    return (
      <div>
        <NoResult />
      </div>
    )
  }

  return (
    <div className=" flex flex-col gap-5 m-5 ">
      <PostAuthor
        username={data.post?.author.name!}
        image={data.post?.author.image!}
        channel={data.post?.channel.name!}
      />

      <div className=" flex flex-col gap-3">
        <h2 className="text-2xl font-bold">{data.post?.title}</h2>
        <HTMLparser html={data.post?.htmlContent as string} />
      </div>
      <Interactions
        id={id}
        page
        userid={data.post?.authorId}
        likedUser={
          data.post && data.post.likes.length > 0
            ? data.post.likes[0].userId
            : undefined
        }
        likeid={
          data.post && data.post.likes.length > 0
            ? data.post.likes[0].id
            : undefined
        }
        likes={data.post?._count.likes!}
        comments={data.post?._count.comments!}
        channelId={channelid}
      />
    </div>
  )
}

export default PostInfo
