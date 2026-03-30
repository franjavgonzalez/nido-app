'use client'

import { differenceInDays } from 'date-fns'
import { formatCurrency, calculateProgress, formatDate } from '@/lib/utils'
import Progress from '@/components/ui/Progress'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import type { Goal } from '@/types'

interface GoalCardProps {
  goal: Goal
  onContribute?: (goal: Goal) => void
  onEdit?: (goal: Goal) => void
}

export default function GoalCard({ goal, onContribute, onEdit }: GoalCardProps) {
  const pct = calculateProgress(goal.current_amount, goal.target_amount)
  const daysLeft = goal.target_date
    ? differenceInDays(new Date(goal.target_date), new Date())
    : null
  const color = pct >= 100 ? 'green' : pct >= 60 ? 'gold' : pct >= 30 ? 'orange' : 'red'
  const remaining = goal.target_amount - goal.current_amount

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[var(--radius-lg)] p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="text-3xl">{goal.icon ?? '🎯'}</span>
        <div className="flex-1 min-w-0">
          <p className="font-display text-base font-semibold text-[var(--text-primary)] truncate">{goal.name}</p>
          {goal.description && (
            <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{goal.description}</p>
          )}
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-[var(--text-muted)]">Progreso</span>
          <span className="font-semibold" style={{ color: `var(--${color === 'gold' ? 'gold' : color === 'green' ? 'green' : color === 'orange' ? 'orange' : 'red'})` }}>
            {pct}%
          </span>
        </div>
        <Progress value={pct} color={color} height={8} />
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] p-3">
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Acumulado</p>
          <p className="font-display text-sm font-semibold text-[var(--gold)] mt-0.5">
            {formatCurrency(goal.current_amount, goal.currency)}
          </p>
        </div>
        <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] p-3">
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Restante</p>
          <p className="font-display text-sm font-semibold text-[var(--text-secondary)] mt-0.5">
            {formatCurrency(Math.max(remaining, 0), goal.currency)}
          </p>
        </div>
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap gap-2">
        {daysLeft !== null && (
          <Badge variant={daysLeft < 30 ? 'warning' : daysLeft < 0 ? 'danger' : 'default'}>
            {daysLeft > 0 ? `${daysLeft} días` : daysLeft === 0 ? '¡Hoy!' : 'Vencido'}
          </Badge>
        )}
        {goal.target_date && (
          <Badge variant="info">{formatDate(goal.target_date)}</Badge>
        )}
        {pct >= 100 && <Badge variant="success" dot>Completado 🎉</Badge>}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => onContribute?.(goal)}
          disabled={pct >= 100}
        >
          + Aportar
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onEdit?.(goal)}>
          Editar
        </Button>
      </div>
    </div>
  )
}
