'use client'

import { formatCurrency, getDeltaColor, getDeltaSymbol } from '@/lib/utils'
import { SkeletonCard } from '@/components/ui/Skeleton'
import type { CurrencyCode } from '@/types'

type KPIVariant = 'gold' | 'green' | 'red' | 'blue'

interface KPICardProps {
  label: string
  value: number
  currency: CurrencyCode
  delta?: number
  variant?: KPIVariant
  loading?: boolean
}

const variantColors: Record<KPIVariant, string> = {
  gold: 'var(--gold)',
  green: 'var(--green)',
  red: 'var(--red)',
  blue: 'var(--blue)',
}

export default function KPICard({
  label,
  value,
  currency,
  delta,
  variant = 'gold',
  loading = false,
}: KPICardProps) {
  if (loading) return <SkeletonCard />

  const color = variantColors[variant]
  const deltaColor = delta !== undefined ? getDeltaColor(delta) : undefined
  const deltaSymbol = delta !== undefined ? getDeltaSymbol(delta) : undefined
  const deltaAbs = delta !== undefined ? Math.abs(Math.round(delta)) : undefined

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[var(--radius-lg)] p-5">
      <p className="text-[11px] font-medium uppercase tracking-widest text-[var(--text-muted)] mb-2">
        {label}
      </p>
      <p className="font-display text-[28px] font-semibold leading-none" style={{ color }}>
        {formatCurrency(value, currency)}
      </p>
      {delta !== undefined && (
        <p className="mt-2 text-xs font-medium" style={{ color: deltaColor }}>
          {deltaSymbol} {deltaAbs}% vs mes anterior
        </p>
      )}
    </div>
  )
}
