"use client"

import { useState, KeyboardEvent } from "react"
import { Plus, Loader2 } from "lucide-react"

interface QuickTaskInputProps {
  onAddTask: (title: string) => Promise<void>
  placeholder?: string
}

export function QuickTaskInput({
  onAddTask,
  placeholder = "Adicionar tarefa (pressione Enter para salvar)...",
}: QuickTaskInputProps) {
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const trimmed = title.trim()
      if (!trimmed || isLoading) return

      setIsLoading(true)
      const titleToSubmit = trimmed
      setTitle("") // Limpa o campo imediatamente após dar Enter

      try {
        await onAddTask(titleToSubmit)
      } catch (error) {
        console.error("Erro ao adicionar tarefa:", error)
        // Se houver falha no servidor, recupera o texto para o usuário não perder o que digitou
        setTitle(titleToSubmit)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="flex items-center gap-3 p-3.5 border-b bg-card rounded-t-xl transition-colors focus-within:bg-accent/10">
      {isLoading ? (
        <Loader2 className="h-5 w-5 text-muted-foreground animate-spin flex-shrink-0" />
      ) : (
        <Plus className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      )}
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        className="flex-1 bg-transparent border-none focus:outline-none text-sm placeholder:text-muted-foreground disabled:opacity-50"
      />
      {title.trim() && (
        <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded border border-muted-foreground/20 hidden sm:inline-block">
          Pressione Enter ↵
        </span>
      )}
    </div>
  )
}
