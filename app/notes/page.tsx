"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Folder, FileText, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function NotesPage() {
    return (
        <div className="grid grid-cols-12 h-[calc(100vh-8rem)] gap-6">
            <div className="col-span-3 flex flex-col gap-4">
                <Card className="h-full">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Folders</h3>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="space-y-1">
                            <Button variant="secondary" className="w-full justify-start gap-2">
                                <Folder className="h-4 w-4" />
                                Personal
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-2">
                                <Folder className="h-4 w-4" />
                                Work
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-2">
                                <Folder className="h-4 w-4" />
                                Ideas
                            </Button>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Recent Notes</h3>
                        </div>
                        <ScrollArea className="h-[300px]">
                            <div className="space-y-1">
                                <Button variant="ghost" className="w-full justify-start gap-2 text-sm font-normal">
                                    <FileText className="h-4 w-4" />
                                    Project Ideas
                                </Button>
                                <Button variant="ghost" className="w-full justify-start gap-2 text-sm font-normal">
                                    <FileText className="h-4 w-4" />
                                    Meeting Notes
                                </Button>
                                <Button variant="ghost" className="w-full justify-start gap-2 text-sm font-normal">
                                    <FileText className="h-4 w-4" />
                                    Grocery List
                                </Button>
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
            <div className="col-span-9">
                <Card className="h-full">
                    <CardContent className="p-6 h-full flex flex-col">
                        <input
                            type="text"
                            placeholder="Note Title"
                            className="text-3xl font-bold border-none focus:outline-none mb-4 bg-transparent"
                            defaultValue="Project Ideas"
                        />
                        <textarea
                            className="flex-1 w-full resize-none border-none focus:outline-none bg-transparent text-lg leading-relaxed"
                            placeholder="Start writing..."
                            defaultValue="- Build a Life OS&#10;- Use Next.js and Shadcn&#10;- Make it look awesome"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
