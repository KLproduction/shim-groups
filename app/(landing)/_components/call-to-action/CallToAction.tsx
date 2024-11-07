import { GradientText } from "@/components/global/gradient-text"
import { Button } from "@/components/ui/button"
import { BadgePlus } from "@/icons"
import Link from "next/link"

type Props = {}

export const CallToAction = (props: Props) => {
  return (
    <div className=" flex flex-col items-start md:items-center gap-y-5 md:gap-y-0">
      <GradientText
        className="text-[35px] md:text-[40px] lg:text-[55px] xl:text-[70px] 2xl:text-[80px]
        leading-tight font-semibold"
        element="H1"
      >
        Brining Communities <br className="md:hidden" /> Together
      </GradientText>
      <p className="text-sm md:text-center text-left text-muted-foreground">
        Shim-Groups is a thriving online community platform that enables
        <br className="hidden md:block" />
        members to connect,
        <br className="hidden md:block" />
        collaborate, and build meaningful
        <br className="hidden md:block" />
        relationships.
      </p>
      <div className="flex md:flex-row flex-col md:justify-center gap-5 md:mt-5 w-full">
        <Link href={"/explore"}>
          <Button
            variant={"outline"}
            className="rounded-xl bg-transparent text-base"
          >
            Watch Demo
          </Button>
        </Link>
        <Link href={"/sign-in"}>
          <Button className="rounded-xl text-base flex gap-2 items-center w-full">
            <BadgePlus />
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  )
}
