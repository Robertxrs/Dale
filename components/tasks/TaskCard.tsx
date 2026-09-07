"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GripVertical } from "lucide-react"

type Task = {
    id: string
    title: string
    priority: "low" | "medium" | "high"
}

export function TaskCard({ task }: { task: Task }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: task.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} className="mb-3">
            <Card className="cursor-default hover:shadow-md transition-shadow">
                <CardContent className="p-3 flex items-center gap-3">
                    <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                        <GripVertical className="h-4 w-4" />
                    </button>
                    <div className="flex-1">
                        <p className="text-sm font-medium leading-none">{task.title}</p>
                    </div>
                    <Badge variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"} className="text-[10px] px-1.5 py-0.5 h-5">
                        {task.priority}
                    </Badge>
                </CardContent>
            </Card>
        </div>
    )
}
