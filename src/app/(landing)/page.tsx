import Image from "next/image"
import { CallToAction } from "./_components/call-to-action/CallToAction"
import { DashboardSnippet } from "./_components/dashbaord-snippet"
import dynamic from "next/dynamic"

const PricingSection = dynamic(
    () =>
        import("./_components/pricing-section").then(
            (component) => component.PricingSection,
        ),
    {
        ssr: true,
        loading: () => <div>Loading...</div>,
    },
)

export default function Home() {
    return (
        <main className="md:px-10 py-20 flex flex-col gap-36">
            <CallToAction />
            <DashboardSnippet />
            <PricingSection />
        </main>
    )
}
