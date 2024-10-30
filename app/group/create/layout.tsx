import { BackdropGradient } from "@/components/global/backdrop-gradient"
import GlassCard from "@/components/global/glass-card"
import { GradientText } from "@/components/global/gradient-text"
import GroupLogo from "@/components/GroupLogo"
import { GROUPLE_CONSTANTS } from "@/constants"
import Link from "next/link"
import React from "react"

type Props = {
    children: React.ReactNode
}

const CreateGroupLayout = ({ children }: Props) => {
    return (
        <div className="container h-screen flex flex-col items-center ">
            <Link className="absolute top-10 left-10" href={"/"}>
                Back
            </Link>
            <div className="flex flex-col items-center md:flex-row w-full mb-32 mt-32 justify-center ">
                <BackdropGradient className="w-8/12 h-2/6 opacity-50">
                    <GradientText
                        element="H2"
                        className="text-4xl font-semibold py-5 w-full md:min-w-[300px] lg:min-w-[51/2]"
                    >
                        Create your Group
                    </GradientText>
                    <p className="text-themeTextGray">
                        Free for 14 days, then $99/month. <br />
                        Cancel anytime. <br />
                        All features. <br />
                        Unlimited everything. <br />
                        No hidden fees.
                    </p>
                    <div className="flex flex-col gap-3 mt-16 pl-5">
                        {GROUPLE_CONSTANTS.createGroupPlaceholder.map(
                            (placeholder) => (
                                <div
                                    className="flex gap-3"
                                    key={placeholder.id}
                                >
                                    {placeholder.icon}
                                    <p className="text-themeTextGray">
                                        {placeholder.label}
                                    </p>
                                </div>
                            ),
                        )}
                    </div>
                </BackdropGradient>
                <div>
                    <BackdropGradient
                        className="w-6/12 h-3/6 opacity-40"
                        container="lg:items-center max-w-[500px] xl:max-w-[700px] "
                    >
                        <GlassCard className="mt-16 py-7 max-w-[500px] xl:max-w-[700px]">
                            {children}
                        </GlassCard>
                    </BackdropGradient>
                </div>
            </div>
        </div>
    )
}

export default CreateGroupLayout
