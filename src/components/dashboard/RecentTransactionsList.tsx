import { formatCurrency, formatRelativeDate } from '@/lib/utils'
import { SkeletonText } from '@/components/ui/Skeleton'
import type { Transaction } from '@/types'

interface RecentTransactionsListProps {
  transactions: Transaction[]
  loading?: boolean
}

export default function RecentTransactionsList({ transactions, loading }: RecentTransactionsListProps) {
  if (loading) {
    return (
      <div className="space-y-4 p-2">
        {Array.from({ length: 5 }).map((_, i) => <SkeletonText key={i} lines={2} />)}
      </div>
    )
  }

  if (!transactions.length) {
    return (
      <div className="py-10 text-center text-sm text-[var(--text-muted)]">
        Sin transacciones aún
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {transactions.map(tx => {
        const isPositive = tx.type === 'income'
        const isNegative = tx.type === 'expense'
        const color = isPositive ? 'var(--green)' : isNegative ? 'var(--red)' : 'var(--gold)'
        const sign = isPositive ? '+' : isNegative ? '-' : ''

        return (
          <div
            key={tx.id}
            className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 transition-colors hover:bg-[var(--bg-card-hover)]"
          >
            <span className="text-lg shrink-0">{tx.category?.icon ?? '💸'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                {tx.description ?? tx.category?.name ?? 'Transacción'}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {formatRelativeDate(tx.date)}
              </p>
            </div>
            <p className="text-sm font-semibold shrink-0" style={{ color }}>
              {sign}{formatCurrency(tx.amount, tx.currency)}
            </p>
          </div>
        )
      })}
    </div>
  )
}
