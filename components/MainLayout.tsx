"use client"

import { usePathname } from "next/navigation"
import { AppSidebar } from "./AppSidebar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isLandingPage = pathname === "/"

    if (isLandingPage) {
        return <main className="flex-1">{children}</main>
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <AppSidebar />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
