"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"

type Event = {
    id: string
    title: string
    startTime: string // HH:mm
    endTime: string // HH:mm
    type: "work" | "personal" | "routine"
}

const events: Event[] = [
    { id: "1", title: "Morning Routine", startTime: "07:00", endTime: "08:00", type: "routine" },
    { id: "2", title: "Deep Work Block", startTime: "09:00", endTime: "11:30", type: "work" },
    { id: "3", title: "Lunch Break", startTime: "12:00", endTime: "13:00", type: "personal" },
    { id: "4", title: "Team Sync", startTime: "14:00", endTime: "15:00", type: "work" },
    { id: "5", title: "Gym", startTime: "17:30", endTime: "19:00", type: "personal" },
]

export function Timeline() {
    const hours = Array.from({ length: 18 }, (_, i) => i + 6) // 6:00 to 23:00

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Timeline - {format(new Date(), "EEEE, MMMM do")}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[600px] px-4">
                    <div className="relative space-y-4 py-4">
                        {hours.map((hour) => (
                            <div key={hour} className="flex items-start gap-4">
                                <span className="w-12 text-sm text-muted-foreground text-right pt-1">
                                    {hour}:00
                                </span>
                                <div className="flex-1 border-t pt-2 min-h-[60px] relative">
                                    {/* Render events that start in this hour */}
                                    {events
                                        .filter((event) => parseInt(event.startTime.split(":")[0]) === hour)
                                        .map((event) => (
                                            <div
                                                key={event.id}
                                                className={`absolute top-2 left-0 right-0 p-2 rounded-md text-sm font-medium border-l-4 ${event.type === "work"
                                                        ? "bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                                        : event.type === "personal"
                                                            ? "bg-green-100 border-green-500 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                                            : "bg-orange-100 border-orange-500 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                                                    }`}
                                            >
                                                <div className="flex justify-between">
                                                    <span>{event.title}</span>
                                                    <span className="text-xs opacity-75">
                                                        {event.startTime} - {event.endTime}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
