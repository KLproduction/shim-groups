"use client"

import { UserComment } from "@/app/group/[groupid]/channel/[channelid]/[postid]/_components/user-comment"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePostComment } from "@/hooks/channels"
import { Send } from "lucide-react"
import React from "react"

type Props = {
  postId: string
  image: string
  username: string
}

const PostCommentForm = ({ postId, image, username }: Props) => {
  const { isPending, onCreateComment, register, variables } =
    usePostComment(postId)
  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={onCreateComment}
        className="flex items-center border-2 bg-transparent p-3 mt-5 border-themeGray rounded-2xl overflow-hidden"
      >
        <Input
          {...register("comment")}
          className=" flex-1 bg-transparent border-none outline-none"
          placeholder="Add a comment..."
          type="text"
        />
        <Button
          variant={"ghost"}
          className=" p-0 hover:bg-transparent "
          type="submit"
        >
          <Send className="text-themeTextGray hover:text-themeGray" />
        </Button>
      </form>
      {isPending && variables && (
        <UserComment
          postId={postId!}
          id={variables.commentId}
          optimistic
          username={username}
          image={image}
          content={variables.content}
        />
      )}
    </div>
  )
}

export default PostCommentForm
