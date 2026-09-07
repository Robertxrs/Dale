import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-white gap-4">
      <h1 className="text-4xl font-bold">Bem-vindo ao Dayle</h1>
      <p className="text-gray-400">Seu sistema operacional pessoal.</p>
      <div className="flex gap-4">
        <Link href="/sign-in">
          <Button variant="default">Entrar no Sistema</Button>
        </Link>
        <Link href="/sign-up">
          <Button variant="outline">Criar Conta</Button>
        </Link>
      </div>
    </div>
  );
}
