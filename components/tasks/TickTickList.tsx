"use client"

import { useState } from "react"
import { createTask, toggleTaskStatus, deleteTask } from "@/lib/actions/tasks"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Check,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  CornerDownRight,
  AlertCircle
} from "lucide-react"

export type TaskModel = {
  id: string
  title: string
  description?: string | null
  status: "TODO" | "DOING" | "DONE"
  priority?: string | null
  due_date?: Date | string | null
  parentId?: string | null
  subtasks?: TaskModel[]
}

interface TickTickListProps {
  initialTasks: TaskModel[]
  userId: string
}

export function TickTickList({ initialTasks, userId }: TickTickListProps) {
  const [tasks, setTasks] = useState<TaskModel[]>(initialTasks)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [newTitle, setNewTitle] = useState("")
  const [subtaskParentId, setSubtaskParentId] = useState<string | null>(null)
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Alterna status com Optimistic UI
  const handleToggleStatus = async (taskId: string, currentStatus: "TODO" | "DOING" | "DONE") => {
    const newStatus = currentStatus === "DONE" ? "TODO" : "DONE"

    const updateRecursively = (list: TaskModel[]): TaskModel[] => {
      return list.map(t => {
        if (t.id === taskId) return { ...t, status: newStatus }
        if (t.subtasks && t.subtasks.length > 0) {
          return { ...t, subtasks: updateRecursively(t.subtasks) }
        }
        return t
      })
    }

    setTasks(prev => updateRecursively(prev))

    try {
      await toggleTaskStatus(taskId, currentStatus)
    } catch (error) {
      console.error("Erro ao sincronizar status:", error)
      // Reverte em caso de falha
      setTasks(initialTasks)
    }
  }

  // Criação rápida de tarefa principal
  const handleCreateTask = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = newTitle.trim()
    if (!trimmed || isSubmitting) return

    const tempId = `temp-${Date.now()}`
    const optimisticTask: TaskModel = {
      id: tempId,
      title: trimmed,
      status: "TODO",
      priority: "medium",
      due_date: null,
      subtasks: [],
    }

    setTasks(prev => [optimisticTask, ...prev])
    setNewTitle("")
    setIsSubmitting(true)

    try {
      const created = await createTask({
        user_id: userId,
        title: trimmed,
      })

      // Substitui o id temporário pelo id real retornado do banco
      setTasks(prev => prev.map(t => (t.id === tempId ? { ...t, id: created.id } : t)))
    } catch (error) {
      console.error("Erro ao criar tarefa:", error)
      setTasks(prev => prev.filter(t => t.id !== tempId))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Criação rápida de subtarefa inline
  const handleCreateSubtask = async (parentId: string) => {
    const trimmed = newSubtaskTitle.trim()
    if (!trimmed || isSubmitting) return

    const tempId = `temp-sub-${Date.now()}`
    const optimisticSubtask: TaskModel = {
      id: tempId,
      title: trimmed,
      status: "TODO",
      parentId,
      subtasks: [],
    }

    // Adiciona na lista otimista e expande o pai
    const addSubtaskRecursively = (list: TaskModel[]): TaskModel[] => {
      return list.map(t => {
        if (t.id === parentId) {
          return {
            ...t,
            subtasks: [...(t.subtasks || []), optimisticSubtask],
          }
        }
        if (t.subtasks && t.subtasks.length > 0) {
          return { ...t, subtasks: addSubtaskRecursively(t.subtasks) }
        }
        return t
      })
    }

    setTasks(prev => addSubtaskRecursively(prev))
    setExpandedIds(prev => new Set(prev).add(parentId))
    setNewSubtaskTitle("")
    setSubtaskParentId(null)
    setIsSubmitting(true)

    try {
      const created = await createTask({
        user_id: userId,
        title: trimmed,
        parentId,
      })

      const replaceSubtaskId = (list: TaskModel[]): TaskModel[] => {
        return list.map(t => {
          if (t.id === tempId) return { ...t, id: created.id }
          if (t.subtasks && t.subtasks.length > 0) {
            return { ...t, subtasks: replaceSubtaskId(t.subtasks) }
          }
          return t
        })
      }

      setTasks(prev => replaceSubtaskId(prev))
    } catch (error) {
      console.error("Erro ao criar subtarefa:", error)
      const removeTemp = (list: TaskModel[]): TaskModel[] => {
        return list
          .filter(t => t.id !== tempId)
          .map(t => ({
            ...t,
            subtasks: t.subtasks ? removeTemp(t.subtasks) : [],
          }))
      }
      setTasks(prev => removeTemp(prev))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Exclusão de tarefa/subtarefa
  const handleDeleteTask = async (taskId: string) => {
    const removeRecursively = (list: TaskModel[]): TaskModel[] => {
      return list
        .filter(t => t.id !== taskId)
        .map(t => ({
          ...t,
          subtasks: t.subtasks ? removeRecursively(t.subtasks) : [],
        }))
    }

    setTasks(prev => removeRecursively(prev))

    try {
      await deleteTask(taskId)
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error)
    }
  }

  // Renderiza cada linha de tarefa/subtarefa
  const renderTaskRow = (task: TaskModel, isSubtask = false) => {
    const isExpanded = expandedIds.has(task.id)
    const hasSubtasks = task.subtasks && task.subtasks.length > 0
    const isDone = task.status === "DONE"
    const isAddingSubtaskHere = subtaskParentId === task.id

    return (
      <div key={task.id} className="flex flex-col border-b last:border-0 border-muted/40">
        <div
          className={`group flex items-center gap-3 py-2.5 px-3 hover:bg-muted/40 rounded-lg transition-colors ${
            isSubtask ? "ml-7 bg-muted/15" : ""
          }`}
        >
          {/* Checkbox circular estilo TickTick */}
          <button
            type="button"
            onClick={() => handleToggleStatus(task.id, task.status)}
            aria-label={isDone ? "Marcar como não concluída" : "Marcar como concluída"}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
              isDone
                ? "bg-emerald-500 border-emerald-500 text-white"
                : "border-muted-foreground/50 hover:border-emerald-500 hover:scale-105"
            }`}
          >
            {isDone && <Check className="h-3 w-3 stroke-[3]" />}
          </button>

          {/* Título e Metadados */}
          <div className="flex-1 flex items-center justify-between min-w-0">
            <span
              className={`text-sm truncate select-none ${
                isDone ? "line-through text-muted-foreground" : "text-foreground font-normal"
              }`}
            >
              {task.title}
            </span>

            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-2 flex-shrink-0">
              {/* Data de entrega */}
              {task.due_date && (
                <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-[11px]">
                  <CalendarIcon className="h-3 w-3" />
                  {format(new Date(task.due_date), "dd MMM", { locale: ptBR })}
                </span>
              )}

              {/* Prioridade */}
              {task.priority === "high" && (
                <span className="flex items-center gap-1 text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded text-[11px] font-medium">
                  <AlertCircle className="h-3 w-3" />
                  Alta
                </span>
              )}

              {/* Botões de Ação no Hover */}
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                {/* Botão de adicionar subtarefa */}
                {!isSubtask && (
                  <button
                    type="button"
                    title="Adicionar subtarefa"
                    onClick={() => {
                      setSubtaskParentId(isAddingSubtaskHere ? null : task.id)
                      setNewSubtaskTitle("")
                    }}
                    className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                  >
                    <CornerDownRight className="h-3.5 w-3.5" />
                  </button>
                )}

                {/* Botão de excluir */}
                <button
                  type="button"
                  title="Excluir tarefa"
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Toggle de Subtarefas */}
              {hasSubtasks && (
                <button
                  type="button"
                  onClick={() => toggleExpand(task.id)}
                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground ml-1"
                  title={isExpanded ? "Recolher subtarefas" : "Expandir subtarefas"}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Input inline para adicionar subtarefa */}
        {isAddingSubtaskHere && (
          <div className="flex items-center gap-2 ml-10 mr-4 my-2 p-2 bg-muted/40 rounded-md border border-dashed border-muted-foreground/30">
            <CornerDownRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              autoFocus
              value={newSubtaskTitle}
              onChange={e => setNewSubtaskTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleCreateSubtask(task.id)
                } else if (e.key === "Escape") {
                  setSubtaskParentId(null)
                }
              }}
              placeholder="Nome da subtarefa (Enter para salvar, Esc para cancelar)..."
              className="flex-1 bg-transparent border-none text-xs focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleCreateSubtask(task.id)}
              className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded hover:opacity-90"
            >
              Adicionar
            </button>
          </div>
        )}

        {/* Subtarefas renderizadas recursivamente */}
        {hasSubtasks && isExpanded && (
          <div className="flex flex-col border-l-2 border-muted ml-5 pl-2 my-1 space-y-0.5">
            {task.subtasks!.map(sub => renderTaskRow(sub, true))}
          </div>
        )}
      </div>
    )
  }

  const completedCount = tasks.filter(t => t.status === "DONE").length
  const totalCount = tasks.length

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
      {/* Cabeçalho de Resumo / Filtro estilo TickTick */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            {totalCount > 0 ? `${completedCount} de ${totalCount} concluídas` : "Nenhuma tarefa"}
          </span>
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-xs overflow-hidden">
        {/* Input de criação rápida estilo TickTick */}
        <form onSubmit={handleCreateTask} className="flex items-center gap-3 p-3.5 border-b bg-card">
          <Plus className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Adicionar tarefa (pressione Enter para salvar)..."
            className="flex-1 bg-transparent border-none focus:outline-none text-sm placeholder:text-muted-foreground"
          />
          {newTitle.trim() && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:opacity-90 transition-opacity"
            >
              Adicionar
            </button>
          )}
        </form>

        {/* Lista de Tarefas */}
        <div className="flex flex-col p-2">
          {tasks.map(task => renderTaskRow(task))}
          {tasks.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
              <p>Tudo limpo por aqui!</p>
              <p className="text-xs text-muted-foreground/70">
                Digite uma nova tarefa acima para começar seu dia organizado no estilo TickTick.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
