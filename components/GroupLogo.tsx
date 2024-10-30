import React from "react"

type Props = {
    size: "small" | "large"
}

const GroupLogo = ({ size }: Props) => {
    switch (size) {
        case "small":
            return (
                <div className="relative">
                    <p className=" font-bold text-3xl text-zinc-50 before:absolute before:top-[-15%] before:left-[-15%] before:text-xl before:text-orange-400 before:content-['Shim'] before:z-[-1]">
                        Groups
                    </p>
                </div>
            )
        case "large":
            return (
                <div>
                    <p className="relative font-bold text-6xl text-zinc-200 before:absolute before:top-[-15%] before:left-[-15%] before:text-4xl before:text-orange-400 before:content-['Shim'] before:z-[-1]">
                        Groups
                    </p>
                </div>
            )
    }
}

export default GroupLogo
