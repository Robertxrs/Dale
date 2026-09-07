import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Endpoint para o AppWidget Android consumir tarefas ativas
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  const expectedKey = process.env.WIDGET_API_KEY

  // Validação simples e segura da API Key
  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = process.env.WIDGET_USER_ID

  if (!userId) {
    return NextResponse.json(
      { error: "WIDGET_USER_ID não configurado no ambiente (.env)" },
      { status: 500 }
    )
  }

  try {
    // Busca as tarefas principais (sem parentId) e inclui as subtarefas pendentes
    const tasks = await prisma.task.findMany({
      where: {
        user_id: userId,
        parentId: null,
        status: { in: ["TODO", "DOING"] }, // Apenas tarefas ativas
      },
      include: {
        subtasks: {
          where: {
            status: { in: ["TODO", "DOING"] },
          },
          orderBy: [
            { order: "asc" },
            { createdAt: "asc" },
          ],
        },
      },
      orderBy: [
        { priority: "desc" },
        { order: "asc" },
        { createdAt: "desc" },
      ],
      take: 10, // Limite para não sobrecarregar a memória do RemoteViews do Android
    })

    return NextResponse.json({
      success: true,
      count: tasks.length,
      tasks: tasks.map(task => ({
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        due_date: task.due_date,
        subtasks: task.subtasks.map(sub => ({
          id: sub.id,
          title: sub.title,
          status: sub.status,
        })),
      })),
    })
  } catch (error) {
    console.error("Erro na API do Widget:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// Suporte para o widget marcar tarefa como concluída diretamente pelo Android
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization")
  const expectedKey = process.env.WIDGET_API_KEY

  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { taskId, action } = body

    if (!taskId) {
      return NextResponse.json({ error: "taskId é obrigatório" }, { status: 400 })
    }

    if (action === "toggle" || action === "complete") {
      const task = await prisma.task.findUnique({ where: { id: taskId } })
      if (!task) {
        return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 })
      }

      const newStatus = action === "complete" ? "DONE" : task.status === "DONE" ? "TODO" : "DONE"
      const updated = await prisma.task.update({
        where: { id: taskId },
        data: { status: newStatus },
      })

      return NextResponse.json({ success: true, task: updated })
    }

    return NextResponse.json({ error: "Ação não suportada" }, { status: 400 })
  } catch (error) {
    console.error("Erro ao atualizar tarefa via widget:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
