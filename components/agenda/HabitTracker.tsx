"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Flame, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

type Habit = {
    id: string
    name: string
    streak: number
    completed: boolean
}

const initialHabits: Habit[] = [
    { id: "1", name: "Morning Meditation", streak: 5, completed: true },
    { id: "2", name: "Read 30 mins", streak: 12, completed: false },
    { id: "3", name: "Workout", streak: 3, completed: false },
    { id: "4", name: "Drink 3L Water", streak: 0, completed: false },
]

export function HabitTracker() {
    const [habits, setHabits] = useState<Habit[]>(initialHabits)

    const toggleHabit = (id: string) => {
        setHabits(habits.map(habit => {
            if (habit.id === id) {
                return {
                    ...habit,
                    completed: !habit.completed,
                    streak: !habit.completed ? habit.streak + 1 : habit.streak - 1
                }
            }
            return habit
        }))
    }

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">Habits & Routines</CardTitle>
                <Button size="icon" variant="ghost">
                    <Plus className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {habits.map((habit) => (
                        <div key={habit.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Button
                                    size="icon"
                                    variant={habit.completed ? "default" : "outline"}
                                    className={cn(
                                        "h-8 w-8 rounded-full transition-all",
                                        habit.completed ? "bg-green-500 hover:bg-green-600 border-green-500" : ""
                                    )}
                                    onClick={() => toggleHabit(habit.id)}
                                >
                                    {habit.completed && <Check className="h-4 w-4 text-white" />}
                                </Button>
                                <span className={cn("font-medium", habit.completed && "text-muted-foreground line-through")}>
                                    {habit.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-orange-500">
                                <Flame className={cn("h-4 w-4", habit.streak > 0 ? "fill-orange-500" : "text-muted-foreground")} />
                                <span className={cn("text-sm font-bold", habit.streak === 0 && "text-muted-foreground")}>
                                    {habit.streak}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
