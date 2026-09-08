"use client"

import { useState } from "react"
import { createTask, toggleTaskStatus, deleteTask } from "@/lib/actions/tasks"
import { QuickTaskInput } from "@/components/tasks/QuickTaskInput"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Check,
  ChevronDown,
  ChevronRight,
  Trash2,
  Calendar as CalendarIcon,
  CornerDownRight,
  AlertCircle,
  Plus
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
  const [subtaskParentId, setSubtaskParentId] = useState<string | null>(null)
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("")
  const [isSubmittingSubtask, setIsSubmittingSubtask] = useState(false)

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
      setTasks(initialTasks)
    }
  }

  // Criação rápida de tarefa via QuickTaskInput (pressionando Enter)
  const handleQuickAddTask = async (title: string) => {
    const tempId = `temp-${Date.now()}`
    const optimisticTask: TaskModel = {
      id: tempId,
      title,
      status: "TODO",
      priority: "medium",
      due_date: null,
      subtasks: [],
    }

    setTasks(prev => [optimisticTask, ...prev])

    try {
      const created = await createTask({
        user_id: userId,
        title,
      })

      setTasks(prev => prev.map(t => (t.id === tempId ? { ...t, id: created.id } : t)))
    } catch (error) {
      console.error("Erro ao criar tarefa:", error)
      setTasks(prev => prev.filter(t => t.id !== tempId))
      throw error
    }
  }

  // Criação rápida de subtarefa inline
  const handleCreateSubtask = async (parentId: string) => {
    const trimmed = newSubtaskTitle.trim()
    if (!trimmed || isSubmittingSubtask) return

    const tempId = `temp-sub-${Date.now()}`
    const optimisticSubtask: TaskModel = {
      id: tempId,
      title: trimmed,
      status: "TODO",
      parentId,
      subtasks: [],
    }

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
    setIsSubmittingSubtask(true)

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
      setIsSubmittingSubtask(false)
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

  // Renderiza cada linha de tarefa/subtarefa no estilo TickTick
  const renderTaskRow = (task: TaskModel, isSubtask = false) => {
    const isExpanded = expandedIds.has(task.id)
    const hasSubtasks = task.subtasks && task.subtasks.length > 0
    const isDone = task.status === "DONE"
    const isAddingSubtaskHere = subtaskParentId === task.id

    return (
      <div key={task.id} className="flex flex-col border-b last:border-0 border-muted/30">
        <div
          className={`group flex items-center gap-2.5 py-2.5 px-3 hover:bg-muted/40 rounded-lg transition-colors ${
            isSubtask ? "ml-8 bg-muted/10 border-l-2 border-primary/20" : ""
          }`}
        >
          {/* Botão de Expandir Subtarefas (Chevron) */}
          {hasSubtasks ? (
            <button
              type="button"
              onClick={() => toggleExpand(task.id)}
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-transform flex-shrink-0"
              title={isExpanded ? "Recolher subtarefas" : "Expandir subtarefas"}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            /* Espaçador alinhador se não tiver subtarefa mas não for subtarefa em si */
            !isSubtask && <div className="w-6 flex-shrink-0" />
          )}

          {/* Checkbox circular estilo TickTick */}
          <button
            type="button"
            onClick={() => handleToggleStatus(task.id, task.status)}
            aria-label={isDone ? "Marcar como não concluída" : "Marcar como concluída"}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
              isDone
                ? "bg-emerald-500 border-emerald-500 text-white shadow-xs"
                : "border-muted-foreground/40 hover:border-emerald-500 hover:scale-105"
            }`}
          >
            {isDone && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
          </button>

          {/* Título e Metadados na mesma linha (flex items-center) */}
          <div className="flex-1 flex items-center justify-between min-w-0">
            <span
              className={`text-sm truncate select-none cursor-pointer ${
                isDone
                  ? "line-through text-muted-foreground/70"
                  : "text-foreground font-medium"
              }`}
              onClick={() => handleToggleStatus(task.id, task.status)}
            >
              {task.title}
            </span>

            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-2 flex-shrink-0">
              {/* Data de entrega */}
              {task.due_date && (
                <span className="flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded text-[11px]">
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
                    <Plus className="h-3.5 w-3.5" />
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
            </div>
          </div>
        </div>

        {/* Input inline para adicionar subtarefa */}
        {isAddingSubtaskHere && (
          <div className="flex items-center gap-2 ml-12 mr-4 my-2 p-2 bg-muted/30 rounded-md border border-dashed border-muted-foreground/30">
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
              className="flex-1 bg-transparent border-none text-xs focus:outline-none placeholder:text-muted-foreground/70"
            />
            <button
              type="button"
              onClick={() => handleCreateSubtask(task.id)}
              disabled={isSubmittingSubtask}
              className="px-2.5 py-1 bg-primary text-primary-foreground text-xs font-medium rounded hover:opacity-90 transition-opacity"
            >
              Salvar
            </button>
          </div>
        )}

        {/* Subtarefas renderizadas recursivamente com margem/indentação estilo árvore */}
        {hasSubtasks && isExpanded && (
          <div className="flex flex-col ml-6 pl-2 my-1 space-y-0.5 border-l-2 border-muted/50">
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
        {/* Componente de Adição Rápida com Enter */}
        <QuickTaskInput onAddTask={handleQuickAddTask} />

        {/* Lista de Tarefas */}
        <div className="flex flex-col p-2">
          {tasks.map(task => renderTaskRow(task))}
          {tasks.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
              <p className="font-medium">Sua lista está limpa!</p>
              <p className="text-xs text-muted-foreground/70">
                Digite um título acima e pressione <kbd className="px-1.5 py-0.5 bg-muted rounded border text-[10px]">Enter</kbd> para adicionar uma tarefa no estilo TickTick.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
