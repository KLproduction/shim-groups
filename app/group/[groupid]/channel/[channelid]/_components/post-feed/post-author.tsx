import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"

type PostAuthorProps = {
  image?: string
  username?: string
  channel: string
}

export const PostAuthor = ({ image, username, channel }: PostAuthorProps) => {
  return (
    <div className="flex gap-x-3 items-center">
      <Avatar className="cursor-pointer">
        <AvatarImage src={image} alt="user" />
        <AvatarFallback>
          <User />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="text-themeTextGray text-sm capitalize">{username}</p>
        <p className="text-sm capitalize text-themeTextGray">
          Posted in{" "}
          <span className="font-bold capitalize text-themeTextWhite">
            {channel}
          </span>
        </p>
      </div>
    </div>
  )
}
