// "use client"

// import { useChannelPage } from "@/hooks/channels"

// import { PostCard } from "./post-card"
// import InfiniteScrollObserver from "@/components/global/infinite-scroll-observer"

// type PostFeedProps = {
//   channelId: string
//   userId: string
// }

// const PostFeed = ({ channelId, userId }: PostFeedProps) => {
//   const { data } = useChannelPage(channelId)
//   const { posts } = data as {
//     posts: ({
//       likes: {
//         id: string
//         userId: string
//       }[]
//       channel: {
//         name: string
//       }
//       _count: {
//         likes: number
//         comments: number
//       }
//       author: {
//         name: string
//         image: string | null
//       }
//     } & {
//       id: string
//       createdAt: Date
//       title: string | null
//       htmlContent: string | null
//       jsonContent: string | null
//       content: string
//       authorId: string
//       channelId: string
//     })[]
//   }
//   return posts && posts.length > 0 ? (
//     <>
//       {posts.map((post) => (
//         <PostCard
//           key={post.id}
//           channelname={post.channel.name!}
//           title={post.title!}
//           html={post.htmlContent!}
//           username={post.author.name}
//           userImage={post.author.image!}
//           likes={post._count.likes}
//           comments={post._count.comments}
//           postId={post.id}
//           likedUser={post.likes.length > 0 ? post.likes[0].userId : undefined}
//           userId={userId}
//           likeId={post.likes.length > 0 ? post.likes[0].id : undefined}
//           channelId={post.channelId}
//         />
//       ))}
//       {/* <InfiniteScrollObserver
//         mode="POSTS"
//         loading="POST"
//         identifier={channelid}
//         paginate={posts.length}
//       >
//         <PaginatedPosts userid={userid} />
//         <></>
//       </InfiniteScrollObserver> */}
//     </>
//   ) : (
//     <></>
//   )
// }

"use client"

import React, { useEffect, useRef, useState } from "react"

import { ExtenderUser } from "@/next-auth"
import { currentUser } from "@/lib/auth"
import { useInfiniteQuery } from "@tanstack/react-query"
import { onGetScrollPost } from "@/data/channels"
import { PostCard } from "./post-card"
import { CgSpinner } from "react-icons/cg"

type Props = {
  channelId: string
  userId: string
}

const PostFeed = ({ channelId, userId }: Props) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isFetched,
  } = useInfiniteQuery({
    queryKey: ["scroll-posts", channelId],
    queryFn: async ({ pageParam = 0 }) =>
      await onGetScrollPost(channelId, pageParam),
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
    <div className="">
      {data?.pages.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page?.posts?.map((post) => (
            <div key={post.id}>
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
                channelId={post.channelId}
              />
            </div>
          ))}
        </div>
      ))}
      <div ref={observerRef}>
        {isFetchingNextPage ? (
          <div className="flex justify-center opacity-50 animate-spin">
            <CgSpinner />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default PostFeed
