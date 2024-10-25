import Image from "next/image"
import React from "react"

type Props = {}

export const DashboardSnippet = (props: Props) => {
    return (
        <div className="relative sm:min-h-[25rem] md:min-[40rem]">
            <div className=" w-full absolute rounded-[50%] opacity-80  ">
                <div className=" aspect-video relative object-cover">
                    <Image
                        src="/dashboard-snippet.png"
                        className="opacity-[0.95]"
                        alt="snippet"
                        fill
                        priority
                        objectFit="contain"
                    />
                </div>
            </div>
        </div>
    )
}
