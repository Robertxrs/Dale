"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider" // Need to add slider
import { useState } from "react"

export default function GoalsPage() {
    const [goals, setGoals] = useState([
        { id: 1, title: "Save $10k", current: 65, image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
        { id: 2, title: "Run Marathon", current: 30, image: "https://images.unsplash.com/photo-1552674605-469523170d9e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
        { id: 3, title: "Learn Piano", current: 10, image: "https://images.unsplash.com/photo-1552422535-c45813c61732?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
    ])

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Vision Board</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {goals.map((goal) => (
                        <div key={goal.id} className="group relative aspect-video overflow-hidden rounded-xl bg-muted">
                            <img
                                src={goal.image}
                                alt={goal.title}
                                className="object-cover w-full h-full transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white font-bold text-xl">{goal.title}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Active Goals</h2>
                <div className="grid gap-4">
                    {goals.map((goal) => (
                        <Card key={goal.id}>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">{goal.title}</CardTitle>
                                    <span className="text-sm text-muted-foreground">{goal.current}%</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Slider
                                    defaultValue={[goal.current]}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                    onValueChange={(val) => {
                                        const newGoals = goals.map(g => g.id === goal.id ? { ...g, current: val[0] } : g)
                                        setGoals(newGoals)
                                    }}
                                />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
