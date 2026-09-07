"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Wallet,
    CheckSquare,
    Target,
    Notebook,
    ShoppingCart,
    Repeat,
    Calendar
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarItems = [
    {
        title: "Visão Geral",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Finanças",
        href: "/finance",
        icon: Wallet,
    },
    {
        title: "Tarefas",
        href: "/tasks",
        icon: CheckSquare,
    },
    {
        title: "Metas",
        href: "/goals",
        icon: Target,
    },
    {
        title: "Anotações",
        href: "/notes",
        icon: Notebook,
    },
    {
        title: "Compras",
        href: "/shopping",
        icon: ShoppingCart,
    },
    {
        title: "Hábitos",
        href: "/habits",
        icon: Repeat,
    },
    {
        title: "Agenda",
        href: "/agenda",
        icon: Calendar,
    },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
            <div className="flex h-14 items-center border-b px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <LayoutDashboard className="h-6 w-6" />
                    <span>Dayle</span>
                </Link>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
                <ul className="grid gap-1">
                    {sidebarItems.map((item) => (
                        <li key={item.href}>
                            <Link href={item.href}>
                                <Button
                                    variant={pathname === item.href ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-2",
                                        pathname === item.href && "bg-muted"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.title}
                                </Button>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}
