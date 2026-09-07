import { BudgetOverview } from "@/components/finance/BudgetOverview"
import { FinanceCharts } from "@/components/finance/FinanceCharts"

export default function FinancePage() {
    return (
        <div className="flex flex-col gap-6">
            <BudgetOverview />
            <FinanceCharts />
        </div>
    )
}
