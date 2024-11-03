import React from "react"
import LandingPageNavbar from "./_components/navbar"
import Navbar from "@/components/OldNavbar"

const layoutPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" flex flex-col container relative">
      <LandingPageNavbar />
      {children}
    </div>
  )
}

export default layoutPageLayout
