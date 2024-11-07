import { BackdropGradient } from "@/components/global/backdrop-gradient"
import { GradientText } from "@/components/global/gradient-text"
import GroupListSlider from "@/components/global/group-list-slider"
import Search from "@/components/global/search"
import { onAuthenticatedUser } from "@/data/user"
import Link from "next/link"
import React from "react"

type Props = {
  children: React.ReactNode
}

const ExploreLayout = async ({ children }: Props) => {
  const user = await onAuthenticatedUser()
  return (
    <div className="flex-1 flex flex-col ">
      <div className=" flex flex-col items-center mt-36 px-10">
        <GradientText className="text-[90px] font-semibold leading-none">
          Explore Groups
        </GradientText>
        <p className="text-themeTextGray leading-none pt-2 flex flex-col gap-5 justify-center">
          <span className="text-center w-full py-2">or</span>
          <Link
            href={user.status === 200 ? "/group/create" : "/sign-in"}
            className="underline"
          >
            <span className="hover:text-zinc-500">Create Your Own</span>
          </Link>
        </p>
        <BackdropGradient
          className="w-4/12 md:5/12 xlw-3/12 xl-h-2/6 h-3/6"
          container="items-center"
        >
          <Search
            placeholder="Search for anything..."
            searchType="GROUPS"
            glass
            inPutStyle="kg:w-[500px] text-lg h-auto z-[9999]"
            className="rounded-3xl border-themeGray py-2 px-5 mt-10 mb-3"
          />
        </BackdropGradient>
        <div className="w-full md:w-[800px]">
          <GroupListSlider overlay={true} route={true} />
        </div>
      </div>
      {children}
    </div>
  )
}

export default ExploreLayout
