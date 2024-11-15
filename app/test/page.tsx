"use client"

import React, { useEffect, useRef, useState } from "react"

import { ExtenderUser } from "@/next-auth"
import { currentUser } from "@/lib/auth"
import { useInfiniteQuery } from "@tanstack/react-query"
import { onGetScrollPost } from "@/data/channels"
import { PostCard } from "../group/[groupid]/channel/[channelid]/_components/post-feed/post-card"

type Props = {
  channelId: string
  userId: string
}

const TestPage = (props: Props) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["channel-info"],
      queryFn: async ({ pageParam = 0 }) =>
        await onGetScrollPost(
          "35763f92-2a1b-4f9e-903b-f29e07fa2901",
          pageParam,
        ),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
    })
  const observerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage()
      }
    })
    if (observerRef.current) observer.observe(observerRef.current)
    return () => {
      if (observerRef.current) observer.disconnect()
    }
  }, [fetchNextPage, hasNextPage])

  const [user, setUser] = useState<ExtenderUser | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const user = await currentUser()
      if (!user) return
      setUser(user)
    }
    fetchUser()
  }, [])

  return (
    <div className="container">
      {data?.pages.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page?.posts?.map((post) => (
            <div className="w-full h-full m-10 p-10">
              <PostCard
                key={post.id}
                channelname={post.channel.name!}
                title={post.title!}
                html={post.htmlContent!}
                username={post.author.name!}
                userImage={post.author.image!}
                likes={post._count.likes}
                comments={post._count.comments}
                postId={post.id}
                likedUser={
                  post.likes.length > 0 ? post.likes[0].userId : undefined
                }
                userId={user?.id}
                likeId={post.likes.length > 0 ? post.likes[0].id : undefined}
                channelId={"35763f92-2a1b-4f9e-903b-f29e07fa2901"}
              />
            </div>
          ))}
        </div>
      ))}
      <div ref={observerRef}>
        {isFetchingNextPage ? "Loading more..." : "posts"}
      </div>
    </div>
  )
}

export default TestPage
