import CopyButton from "@/components/global/copy-button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { onGetAffiliateLink } from "@/data/groups"
import React from "react"

type Props = {
  params: {
    groupid: string
  }
}

const AffiliatesPage = async ({ params }: Props) => {
  const affiliate = await onGetAffiliateLink(params.groupid)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  return (
    <div className=" flex flex-col items-start p-5">
      <Card className=" border-themeGray bg-[#1A1A1D] p-5">
        <CardTitle className=" text-3xl">Affiliate Link</CardTitle>
        <CardDescription className=" text-themeTextGray">
          Create and share an invitations link
        </CardDescription>
        <div className=" mt-8 flex flex-col gap-2">
          <div className=" bg-black border-themeGray p-3 rounded-lg flex items-center gap-3">
            {baseUrl}/affiliates/{affiliate.affiliate?.id}
            <CopyButton
              content={`${baseUrl}/affiliates/${affiliate.affiliate?.id}`}
              className=" mx-auto"
            />
          </div>
          <CardDescription className=" text-themeTextGray">
            This link will redirect users to the main page where <br />
            they can purchase or request memberships
          </CardDescription>
        </div>
      </Card>
    </div>
  )
}

export default AffiliatesPage
