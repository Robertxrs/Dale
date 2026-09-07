import { HabitTracker } from "@/components/agenda/HabitTracker"
import { Timeline } from "@/components/agenda/Timeline"

export default function AgendaPage() {
    return (
        <div className="grid gap-6 md:grid-cols-12 h-[calc(100vh-8rem)]">
            <div className="md:col-span-4 lg:col-span-3">
                <HabitTracker />
            </div>
            <div className="md:col-span-8 lg:col-span-9">
                <Timeline />
            </div>
        </div>
    )
}
