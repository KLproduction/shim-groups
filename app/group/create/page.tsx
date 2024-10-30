import LandingPageNavbar from "@/app/(landing)/_components/navbar"
import CreateGroup from "@/components/forms/create-group"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { onGetAffiliateInfo } from "@/data/groups"
import { onAuthenticatedUser } from "@/data/user"
import { User } from "lucide-react"
import { redirect } from "next/navigation"
import React from "react"

type Props = {
    searchParams: { [affiliate: string]: string }
}

const GroupCreatePage = async ({ searchParams }: Props) => {
    const user = await onAuthenticatedUser()
    const affiliate = await onGetAffiliateInfo(searchParams.affiliate)

    if (!user || !user.id) redirect("/sign-in")
    return (
        <>
            <div className="px-7 flex flex-col w-full">
                <h5 className="font-bold text-base text-themeTextWhite py-7">
                    Payment Method
                </h5>
                <p className="text-themeTextGray leading-tight">
                    Free for 14 days, then $99/month. <br />
                    Cancel anytime. <br />
                    All features. <br />
                    Unlimited everything. <br />
                    No hidden fees.
                </p>
                {affiliate.status === 200 && (
                    <div className="w-full mt-5 flex justify-center items-center gap-x-2 italic text-themeTextGray text-sm">
                        You were referred by
                        <Avatar>
                            <AvatarImage
                                src={
                                    affiliate.user?.Group?.User.image as string
                                }
                            />
                            <AvatarFallback>
                                <User />
                            </AvatarFallback>
                        </Avatar>
                        {affiliate.user?.Group?.User.name}
                    </div>
                )}
            </div>
            <CreateGroup
                userId={user.id}
                affiliate={affiliate.status === 200 ? true : false}
                stripeId={affiliate.user?.Group?.User.id || ""}
            />
        </>
    )
}

export default GroupCreatePage
