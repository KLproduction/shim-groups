import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth"
import { Toaster } from "@/components/ui/sonner"
import { Plus_Jakarta_Sans } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { ReduxProvider } from "@/redux/provider"
import { ReactQueryProvider } from "@/react-query/provider"
import Navbar from "@/components/Navbar"
import LandingPageNavbar from "./(landing)/_components/navbar"

const inter = Inter({ subsets: ["latin"] })
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Shim-Groups",
    description: "Let the groups full-fill your live",
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const session = await auth()

    return (
        <SessionProvider session={session}>
            <html lang="en" suppressHydrationWarning>
                <body className={`${inter.className} bg-black`}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        disableTransitionOnChange
                    >
                        <ReduxProvider>
                            <ReactQueryProvider>
                                <div className="h-full w-screen ">
                                    {children}
                                </div>
                            </ReactQueryProvider>
                        </ReduxProvider>
                        <Toaster />
                    </ThemeProvider>
                </body>
            </html>
        </SessionProvider>
    )
}
