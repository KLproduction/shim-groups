import React from "react"
import LandingPageNavbar from "./_components/navbar"
import Navbar from "@/components/OldNavbar"
import { onAuthenticatedUser } from "@/data/user"
import { currentUser } from "@/lib/auth"

const layoutPageLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const user = await currentUser()
  return (
    <div className=" flex flex-col container relative">
      <LandingPageNavbar user={user || null} />
      {children}
    </div>
  )
}

export default layoutPageLayout
