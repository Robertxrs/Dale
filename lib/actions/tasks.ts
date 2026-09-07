"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { TaskStatus } from "@prisma/client"

// Busca tarefas principais (que não são subtarefas) com suas subtarefas aninhadas
export async function getTasks(userId: string) {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        user_id: userId,
        parentId: null, // Pega apenas as tarefas "pai"
      },
      include: {
        subtasks: {
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
    })
    return tasks
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error)
    return []
  }
}

// Cria uma nova tarefa ou subtarefa (se parentId for informado)
export async function createTask(data: {
  user_id: string
  title: string
  parentId?: string
  priority?: string
  due_date?: Date | null
  description?: string
}) {
  try {
    const newTask = await prisma.task.create({
      data: {
        user_id: data.user_id,
        title: data.title,
        parentId: data.parentId || null,
        priority: data.priority || "medium",
        due_date: data.due_date || null,
        description: data.description || null,
        status: TaskStatus.TODO,
        order: Date.now(), // Estratégia de timestamp para ordenação inicial
      },
    })

    revalidatePath("/tasks")
    revalidatePath("/dashboard")
    return newTask
  } catch (error) {
    console.error("Erro ao criar tarefa:", error)
    throw new Error("Falha ao criar tarefa")
  }
}

// Alterna o status da tarefa (TODO <-> DONE)
export async function toggleTaskStatus(id: string, currentStatus: "TODO" | "DOING" | "DONE") {
  try {
    const newStatus: TaskStatus = currentStatus === "DONE" ? TaskStatus.TODO : TaskStatus.DONE

    const updated = await prisma.task.update({
      where: { id },
      data: { status: newStatus },
    })

    revalidatePath("/tasks")
    revalidatePath("/dashboard")
    return updated
  } catch (error) {
    console.error("Erro ao atualizar status:", error)
    throw new Error("Falha ao atualizar tarefa")
  }
}

// Exclui uma tarefa (e subtarefas em cascata)
export async function deleteTask(id: string) {
  try {
    await prisma.task.delete({
      where: { id },
    })

    revalidatePath("/tasks")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error)
    throw new Error("Falha ao excluir tarefa")
  }
}

// Atualiza detalhes da tarefa
export async function updateTask(
  id: string,
  data: {
    title?: string
    description?: string | null
    priority?: string | null
    due_date?: Date | null
  }
) {
  try {
    const updated = await prisma.task.update({
      where: { id },
      data,
    })

    revalidatePath("/tasks")
    revalidatePath("/dashboard")
    return updated
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error)
    throw new Error("Falha ao atualizar tarefa")
  }
}
