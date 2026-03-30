import { cn } from '@/lib/utils'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default' | 'gold'

interface BadgeProps {
  variant?: BadgeVariant
  dot?: boolean
  className?: string
  children: React.ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-[rgba(74,222,128,0.15)] text-[var(--green)] border-[rgba(74,222,128,0.3)]',
  warning: 'bg-[rgba(251,146,60,0.15)] text-[var(--orange)] border-[rgba(251,146,60,0.3)]',
  danger: 'bg-[rgba(248,113,113,0.15)] text-[var(--red)] border-[rgba(248,113,113,0.3)]',
  info: 'bg-[rgba(96,165,250,0.15)] text-[var(--blue)] border-[rgba(96,165,250,0.3)]',
  default: 'bg-[var(--bg-card-hover)] text-[var(--text-secondary)] border-[var(--border-default)]',
  gold: 'bg-[rgba(201,168,76,0.15)] text-[var(--gold)] border-[rgba(201,168,76,0.3)]',
}

const dotColors: Record<BadgeVariant, string> = {
  success: 'bg-[var(--green)]',
  warning: 'bg-[var(--orange)]',
  danger: 'bg-[var(--red)]',
  info: 'bg-[var(--blue)]',
  default: 'bg-[var(--text-muted)]',
  gold: 'bg-[var(--gold)]',
}

export default function Badge({ variant = 'default', dot = false, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  )
}
