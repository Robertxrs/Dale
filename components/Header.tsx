"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Wallet, CheckSquare, Calendar, ShoppingCart, Repeat, Notebook } from "lucide-react";

export default function Header() {
    const { isSignedIn } = useAuth();

    return (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Link href="/" className="font-bold text-xl flex items-center gap-2">
                        <LayoutDashboard className="h-6 w-6 text-primary" />
                        <span>Dayle</span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {!isSignedIn ? (
                        <>
                            <Link href="/sign-in">
                                <Button variant="ghost">Entrar</Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button>Cadastrar</Button>
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
