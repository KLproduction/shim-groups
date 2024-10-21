import { onAuthenticatedUser } from "@/actions/auth"
import { BackdropGradient } from "@/components/global/backdrop-gradient"
import GlassCard from "@/components/global/glass-card"
import Logo from "@/icons/logo"
import { redirect } from "next/navigation"

type Props = {
    children: React.ReactNode
}

const AuthLayout = async ({ children }: Props) => {
    const user = await onAuthenticatedUser()
    if (user.status === 200) {
        redirect("/callback/sing-in")
    }
    return (
        <div className=" container h-screen flex justify-center items-center">
            <div className="flex flex-col w-full items-center py-24 relative">
                <Logo size="large" />

                <BackdropGradient
                    className="w-4/12 h-2/6 opacity-80 "
                    container="flex flex-col items-center justify-center item-center min-w-[300px] max-w-[600px]"
                >
                    <GlassCard className=" p-7 mt-16">{children}</GlassCard>
                </BackdropGradient>
            </div>
        </div>
    )
}

export default AuthLayout
