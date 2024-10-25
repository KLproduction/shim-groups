import LandingPageNavbar from "@/app/(landing)/_components/navbar"
import { BackdropGradient } from "@/components/global/backdrop-gradient"

import GlassCard from "@/components/global/glass-card"
import Logo from "@/icons/logo"
import Link from "next/link"
import { redirect } from "next/navigation"
import { FaBackward } from "react-icons/fa"

type Props = {
    children: React.ReactNode
}

const AuthLayout = async ({ children }: Props) => {
    return (
        <>
            <div className="container h-screen flex justify-center items-center relative">
                <div className="absolute top-10 right-0 ">
                    <Link href={"/"} className="flex items-center gap-3">
                        <FaBackward />
                        Back to HomePage
                    </Link>
                </div>
                <div className="flex flex-col w-full items-center py-24">
                    <BackdropGradient
                        className="w-4/12 h-2/6 opacity-40"
                        container="flex flex-col items-center"
                    >
                        {children}
                    </BackdropGradient>
                </div>
            </div>
        </>
    )
}

export default AuthLayout
