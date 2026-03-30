'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type ProgressColor = 'gold' | 'green' | 'orange' | 'red' | 'blue'

interface ProgressProps {
  value: number
  color?: ProgressColor
  height?: number
  className?: string
  showLabel?: boolean
}

const colorMap: Record<ProgressColor, string> = {
  gold: 'var(--gold)',
  green: 'var(--green)',
  orange: 'var(--orange)',
  red: 'var(--red)',
  blue: 'var(--blue)',
}

export default function Progress({
  value,
  color = 'gold',
  height = 6,
  className,
  showLabel = false,
}: ProgressProps) {
  const pct = Math.min(Math.max(value, 0), 100)
  return (
    <div className={cn('w-full', className)}>
      <div
        className="w-full overflow-hidden rounded-full bg-[var(--border-default)]"
        style={{ height }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: colorMap[color] }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-right text-xs text-[var(--text-muted)]">{pct}%</p>
      )}
    </div>
  )
}
