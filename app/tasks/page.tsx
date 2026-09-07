import { auth } from "@clerk/nextjs/server"
import { getTasks } from "@/lib/actions/tasks"
import { TickTickList } from "@/components/tasks/TickTickList"
import { redirect } from "next/navigation"

export default async function TasksPage() {
    const { userId } = await auth()

    if (!userId) {
        redirect("/sign-in")
    }

    const tasks = await getTasks(userId)

    return (
        <div className="min-h-[calc(100vh-8rem)] py-4">
            <div className="max-w-4xl mx-auto mb-6 px-1 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Tarefas</h1>
                    <p className="text-sm text-muted-foreground">Gerencie suas tarefas e subtarefas diárias com fluidez</p>
                </div>
            </div>
            <TickTickList initialTasks={tasks} userId={userId} />
        </div>
    )
}
