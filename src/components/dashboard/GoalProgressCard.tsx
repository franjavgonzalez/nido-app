import { formatCurrency, calculateProgress, formatDate } from '@/lib/utils'
import Progress from '@/components/ui/Progress'
import Badge from '@/components/ui/Badge'
import { differenceInDays } from 'date-fns'
import type { Goal } from '@/types'

interface GoalProgressCardProps {
  goal: Goal
}

export default function GoalProgressCard({ goal }: GoalProgressCardProps) {
  const pct = calculateProgress(goal.current_amount, goal.target_amount)
  const daysLeft = goal.target_date
    ? differenceInDays(new Date(goal.target_date), new Date())
    : null

  const color = pct >= 100 ? 'green' : pct >= 60 ? 'gold' : pct >= 30 ? 'orange' : 'red'

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[var(--radius-lg)] p-5">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">{goal.icon ?? '🎯'}</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[var(--text-primary)] truncate">{goal.name}</p>
          {daysLeft !== null && (
            <Badge variant={daysLeft < 30 ? 'warning' : 'default'} className="mt-1">
              {daysLeft > 0 ? `${daysLeft} días restantes` : 'Vencido'}
            </Badge>
          )}
        </div>
        <span className="text-sm font-semibold text-[var(--gold)]">{pct}%</span>
      </div>

      <Progress value={pct} color={color} height={6} className="mb-3" />

      <div className="flex justify-between text-xs text-[var(--text-muted)]">
        <span>{formatCurrency(goal.current_amount, goal.currency)}</span>
        <span>{formatCurrency(goal.target_amount, goal.currency)}</span>
      </div>
    </div>
  )
}
