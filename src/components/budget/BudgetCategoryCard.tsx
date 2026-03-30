import { formatCurrency, calculateProgress } from '@/lib/utils'
import Progress from '@/components/ui/Progress'
import Badge from '@/components/ui/Badge'
import type { BudgetWithSpent } from '@/types'

export default function BudgetCategoryCard({ budget }: { budget: BudgetWithSpent }) {
  const pct = budget.percentage
  const color = pct < 70 ? 'green' : pct < 90 ? 'orange' : 'red'
  const status = pct < 70 ? { label: 'Bien', variant: 'success' as const }
    : pct < 90 ? { label: 'Atención', variant: 'warning' as const }
      : { label: 'Excedido', variant: 'danger' as const }
  const remaining = budget.amount - budget.spent

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[var(--radius-lg)] p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{budget.category?.icon ?? '📦'}</span>
          <p className="font-medium text-[var(--text-primary)]">{budget.category?.name ?? 'Categoría'}</p>
        </div>
        <Badge variant={status.variant} dot>{status.label}</Badge>
      </div>

      <Progress value={pct} color={color} height={6} className="mb-3" />

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-[var(--text-muted)]">
          <span>Gastado</span>
          <span className="font-medium text-[var(--text-secondary)]">
            {formatCurrency(budget.spent, budget.currency)} / {formatCurrency(budget.amount, budget.currency)}
          </span>
        </div>
        <div className="flex justify-between text-xs text-[var(--text-muted)]">
          <span>{remaining >= 0 ? 'Disponible' : 'Sobrepasado'}</span>
          <span className={remaining >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}>
            {formatCurrency(Math.abs(remaining), budget.currency)}
          </span>
        </div>
      </div>
    </div>
  )
}
