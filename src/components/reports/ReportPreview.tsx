import { formatCurrency, getMonthName } from '@/lib/utils'
import Progress from '@/components/ui/Progress'
import type { CurrencyCode, Goal } from '@/types'

interface CategoryReport {
  name: string
  icon: string
  budget: number
  spent: number
}

interface ReportPreviewProps {
  familyName: string
  month: number
  year: number
  currency: CurrencyCode
  totalIncome: number
  totalExpenses: number
  totalSavings: number
  categories: CategoryReport[]
  goals: Goal[]
}

export default function ReportPreview({
  familyName,
  month,
  year,
  currency,
  totalIncome,
  totalExpenses,
  totalSavings,
  categories,
  goals,
}: ReportPreviewProps) {
  const netBalance = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 0

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[var(--radius-lg)] overflow-hidden">
      {/* Header */}
      <div className="bg-[var(--bg-secondary)] px-6 py-5 border-b border-[var(--border-default)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-xl text-[var(--gold)]">🏠 Nido</p>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              {familyName} · {getMonthName(month, year)}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Ingresos', value: totalIncome, color: 'var(--green)' },
            { label: 'Gastos', value: totalExpenses, color: 'var(--red)' },
            { label: 'Ahorros', value: totalSavings, color: 'var(--gold)' },
            { label: 'Balance', value: netBalance, color: netBalance >= 0 ? 'var(--blue)' : 'var(--red)' },
          ].map(kpi => (
            <div key={kpi.label} className="bg-[var(--bg-secondary)] rounded-[var(--radius-md)] p-3">
              <p className="text-xs text-[var(--text-muted)]">{kpi.label}</p>
              <p className="font-display text-base font-semibold mt-0.5" style={{ color: kpi.color }}>
                {formatCurrency(kpi.value, currency)}
              </p>
            </div>
          ))}
        </div>

        {/* Tasa de ahorro */}
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-[var(--text-muted)]">Tasa de ahorro</span>
            <span className="text-[var(--gold)]">{savingsRate}%</span>
          </div>
          <Progress value={savingsRate} color="gold" height={6} />
        </div>

        {/* Category table */}
        {categories.length > 0 && (
          <div>
            <h3 className="font-display text-sm text-[var(--text-primary)] mb-3">Gastos por categoría</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-default)]">
                    <th className="pb-2 text-left text-[var(--text-muted)]">Categoría</th>
                    <th className="pb-2 text-right text-[var(--text-muted)]">Presupuesto</th>
                    <th className="pb-2 text-right text-[var(--text-muted)]">Gastado</th>
                    <th className="pb-2 text-right text-[var(--text-muted)]">Diferencia</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => {
                    const diff = cat.budget - cat.spent
                    return (
                      <tr key={cat.name} className="border-b border-[var(--border-default)] last:border-0">
                        <td className="py-2 text-[var(--text-primary)]">{cat.icon} {cat.name}</td>
                        <td className="py-2 text-right text-[var(--text-muted)]">{formatCurrency(cat.budget, currency)}</td>
                        <td className="py-2 text-right text-[var(--text-secondary)]">{formatCurrency(cat.spent, currency)}</td>
                        <td className={`py-2 text-right font-medium ${diff >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                          {diff >= 0 ? '+' : ''}{formatCurrency(diff, currency)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Goals progress */}
        {goals.length > 0 && (
          <div>
            <h3 className="font-display text-sm text-[var(--text-primary)] mb-3">Metas activas</h3>
            <div className="space-y-3">
              {goals.map(g => {
                const pct = g.target_amount > 0 ? Math.round((g.current_amount / g.target_amount) * 100) : 0
                return (
                  <div key={g.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--text-secondary)]">{g.icon} {g.name}</span>
                      <span className="text-[var(--gold)]">{pct}%</span>
                    </div>
                    <Progress value={pct} color="gold" height={4} />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
