import { BackdropGradient } from "@/components/global/backdrop-gradient"
import { GradientText } from "@/components/global/gradient-text"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Check } from "@/icons"
import Link from "next/link"
import React from "react"

type Props = {}

const featuresList = [
    { name: "feature number1" },
    { name: "feature number2" },
    { name: "feature number3" },
    { name: "feature number4" },
    { name: "feature number5" },
    { name: "feature number6" },
    { name: "feature number7" },
    { name: "feature number8" },
]

export const PricingSection = (props: Props) => {
    return (
        <div
            className=" w-full pt-20 h-full flex flex-col items-center gap-12 justify-center relative "
            id="pricing"
        >
            <BackdropGradient className=" h-full opacity-80 flex flex-col items-center justify-center w-full absolute top-0 -left-10">
                <GradientText
                    className="text-2xl font-semibold text-center w-full "
                    element="H2"
                >
                    Pricing Plans That Fit Your Right
                </GradientText>
            </BackdropGradient>
            <p className="text-sm md:text-center text-left text-muted-foreground">
                Shim-Groups is a thriving online community platform that enables
                <br className="hidden md:block" />
                members to connect,
                <br className="hidden md:block" />
                collaborate, and build meaningful
                <br className="hidden md:block" />
                relationships.
            </p>
            <Card className="p-7 mt-10 md:w-auto w-full bg-themeBlack border-themeGray">
                <div className="flex flex-col gap-3">
                    <CardTitle>99/m</CardTitle>
                    <CardDescription>
                        Great if you are just getting started
                    </CardDescription>
                    <Link href="#" className="w-full mt-3">
                        <Button
                            variant={"default"}
                            className="bg-[#333337] w-full rounded-2xl text-white hover:text-zinc-700"
                        >
                            Start For free
                        </Button>
                    </Link>
                </div>
                <div className="flex flex-col gap-2 text-zinc-400 mt-5">
                    <p>Features</p>
                    {featuresList.map((feature, index) => (
                        <span
                            key={index}
                            className="flex gap-2 mt-3 items-center"
                        >
                            <Check />
                            {feature.name}
                        </span>
                    ))}
                </div>
            </Card>
        </div>
    )
}
