"use client"

import { UserComment } from "@/app/group/[groupid]/channel/[channelid]/[postid]/_components/user-comment"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePostReply } from "@/hooks/channels"
import { Send } from "lucide-react"
import React from "react"

type Props = {
  commentId: string
  postId: string
  username: string
  image: string
}

const PostReply = ({ commentId, postId, username, image }: Props) => {
  const { register, onCreateReply, variables, isPending } = usePostReply(
    commentId,
    postId,
  )
  return (
    <div className="flex flex-col gap-5 w-full">
      {isPending && variables && (
        <UserComment
          postId={postId}
          id={variables.commentId}
          optimistic
          username={username}
          image={image}
          content={variables.content}
        />
      )}
      <form
        onSubmit={onCreateReply}
        className=" flex items-center border-2 bg-transparent p-3 border-themeGray rounded-2xl overflow-hidden"
      >
        <Input
          {...register("comment")}
          className=" flex-1 bg-transparent border-none outline-none"
          placeholder="Add a comment..."
        />
        <Button
          variant={"ghost"}
          className=" p-0 hover:bg-transparent "
          type="submit"
        >
          <Send className="text-themeTextGray hover:text-themeGray" />
        </Button>
      </form>
    </div>
  )
}

export default PostReply
