"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react"

export function BudgetOverview() {
    // Mock data
    const budgets = [
        { category: "Food & Dining", spent: 450, limit: 600, color: "bg-orange-500" },
        { category: "Transportation", spent: 120, limit: 200, color: "bg-blue-500" },
        { category: "Entertainment", spent: 280, limit: 300, color: "bg-purple-500" },
        { category: "Shopping", spent: 550, limit: 500, color: "bg-red-500" }, // Over budget
    ]

    const totalBalance = 5240.50
    const monthlyIncome = 3200.00
    const monthlyExpenses = 1400.00

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                    <ArrowUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">+${monthlyIncome.toFixed(2)}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                    <ArrowDown className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">-${monthlyExpenses.toFixed(2)}</div>
                </CardContent>
            </Card>

            <Card className="md:col-span-3">
                <CardHeader>
                    <CardTitle>Budget Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {budgets.map((budget) => {
                        const percentage = Math.min((budget.spent / budget.limit) * 100, 100)
                        const isOverBudget = budget.spent > budget.limit

                        return (
                            <div key={budget.category} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{budget.category}</span>
                                    <span className={isOverBudget ? "text-red-500 font-bold" : "text-muted-foreground"}>
                                        ${budget.spent} / ${budget.limit}
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all ${isOverBudget ? "bg-red-500" : budget.color}`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
        </div>
    )
}
