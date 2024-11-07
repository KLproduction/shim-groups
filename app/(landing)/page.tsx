import dynamic from "next/dynamic"
import { CallToAction } from "./_components/call-to-action/CallToAction"
import { DashboardSnippet } from "./_components/dashbaord-snippet"
import { revalidatePath } from "next/cache"
import { onAuthenticatedUser } from "@/data/user"

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

export default async function Home() {
  return (
    <main className="md:px-10 py-20 flex flex-col gap-36">
      <CallToAction />
      <DashboardSnippet />
      <PricingSection />
    </main>
  )
}
