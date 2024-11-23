"use client"

import { useComments, useReply } from "@/hooks/channels"

import React from "react"
import { UserComment } from "../user-comment"

type Props = {
  postId: string
}

const PostComment = ({ postId }: Props) => {
  const { data } = useComments(postId)
  const { onReply, onSetReply, onSetActiveComment, activeComment } = useReply()
  return (
    <div className="mt-5">
      {data?.comments && data.status === 200 ? (
        data.comments.map((comment) => (
          <UserComment
            key={comment.id}
            id={comment.id}
            onReply={() => onSetReply(comment.id)}
            reply={onReply}
            username={comment.user.name!}
            image={comment.user.image!}
            content={comment.content}
            postId={comment.postId}
            replyCount={comment._count.reply}
            commentid={comment.id}
            activeComment={activeComment}
            onActiveComment={() => onSetActiveComment(comment.id)}
          />
        ))
      ) : (
        <p>No Comments</p>
      )}
    </div>
  )
}

export default PostComment
