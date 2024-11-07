import { Empty } from "@/icons"
import { RefreshCcw } from "lucide-react"
import Link from "next/link"
import React from "react"

type Props = {}

const NoResult = (props: Props) => {
  return (
    <div className="lg:col-span-3 md:col-span-2 flex flex-col items-center gap-y-16">
      <Link href={"/explore"} className="flex gap-3 text-themeTextGray ">
        <RefreshCcw />
      </Link>
      <Empty />
      <div>
        <p className="text-xl font-semibold text-themeTextGray">
          Its quite in here..be the first one!
        </p>
        <p className="text-sm text-themeTextGray">0 Result Found...</p>
      </div>
    </div>
  )
}

export default NoResult
