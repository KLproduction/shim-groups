import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PostAuthor } from "./post-author"
import { Interactions } from "./interactions"
import HTMLparser from "@/components/global/html-parser"

type PostCardProps = {
  userImage?: string
  username?: string
  html: string
  channelname: string
  title: string
  likes: number
  comments: number
  postId: string
  likedUser?: string
  userId?: string
  likeId?: string
  optimisitc?: boolean
  channelId: string
}

export const PostCard = ({
  userImage,
  username,
  html,
  channelname,
  title,
  likes,
  comments,
  postId,
  likedUser,
  userId,
  likeId,
  optimisitc,
  channelId,
}: PostCardProps) => {
  const pathname = usePathname()
  return (
    <Card className="border-themeGray bg-[#1A1A1D] first-letter:rounded-2xl overflow-hidden my-10">
      <CardContent className="p-3 flex flex-col gap-y-6 items-start">
        <PostAuthor
          image={userImage}
          username={username}
          channel={channelname}
        />
        <Link href={`${pathname}/${postId}`} className="w-full">
          <div className="flex flex-col gap-y-3">
            <h2 className="text-2xl">{title}</h2>
            <HTMLparser html={html} />
          </div>
        </Link>
      </CardContent>
      <Separator orientation="horizontal" className="bg-themeGray mt-3" />
      <Interactions
        id={postId}
        userid={userId}
        likes={likes}
        comments={comments}
        likedUser={likedUser}
        likeid={likeId}
        optimisitc={optimisitc}
        channelId={channelId}
      />
    </Card>
  )
}
