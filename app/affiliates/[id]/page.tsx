import { onVerifyAffiliateLink } from "@/data/groups"
import { redirect } from "next/navigation"
import React from "react"

type Props = {
  params: { id: string }
}

const AffiliatesRedirectPage = async ({ params }: Props) => {
  const status = await onVerifyAffiliateLink(params.id)

  if (status.status === 200) {
    redirect(`/group/create?affiliate=${params.id}`)
  }

  if (status.status !== 200) {
    return redirect(`/`)
  }
}

export default AffiliatesRedirectPage
