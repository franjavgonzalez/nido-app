'use client'

import { useState } from 'react'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { formatCurrency, formatDate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import type { Transaction } from '@/types'

interface TransactionsTableProps {
  transactions: Transaction[]
  onRefresh?: () => void
}

const PAGE_SIZE = 25

export default function TransactionsTable({ transactions, onRefresh }: TransactionsTableProps) {
  const [page, setPage] = useState(1)
  const supabase = createClient()

  const totalPages = Math.ceil(transactions.length / PAGE_SIZE)
  const paged = transactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta transacción?')) return
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) {
      toast.error('Error al eliminar')
    } else {
      toast.success('Transacción eliminada')
      onRefresh?.()
    }
  }

  if (!transactions.length) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[var(--radius-lg)] py-16 text-center">
        <p className="text-3xl mb-3">💸</p>
        <p className="text-[var(--text-muted)] text-sm">No hay transacciones en este período</p>
      </div>
    )
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[var(--radius-lg)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-default)]">
              {['Fecha', 'Descripción', 'Categoría', 'Tipo', 'Monto', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map(tx => {
              const isIncome = tx.type === 'income'
              const isExpense = tx.type === 'expense'
              const amountColor = isIncome ? 'var(--green)' : isExpense ? 'var(--red)' : 'var(--gold)'
              const sign = isIncome ? '+' : isExpense ? '-' : ''

              return (
                <tr key={tx.id} className="border-b border-[var(--border-default)] last:border-0 hover:bg-[var(--bg-card-hover)] transition-colors">
                  <td className="px-4 py-3 text-[var(--text-muted)] whitespace-nowrap">
                    {formatDate(tx.date, 'dd/MM/yy')}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-primary)] max-w-[200px] truncate">
                    {tx.description ?? tx.category?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    {tx.category ? (
                      <Badge variant="default">
                        {tx.category.icon} {tx.category.name}
                      </Badge>
                    ) : (
                      <span className="text-[var(--text-muted)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        tx.type === 'income' ? 'success'
                          : tx.type === 'expense' ? 'danger'
                            : tx.type === 'savings' ? 'gold'
                              : 'info'
                      }
                    >
                      {tx.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: amountColor }}>
                    {sign}{formatCurrency(tx.amount, tx.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:bg-[var(--border-default)] hover:text-[var(--text-primary)]">
                          <MoreHorizontal size={14} />
                        </button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="z-50 min-w-[140px] rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-card)] p-1 shadow-lg"
                          align="end"
                          sideOffset={4}
                        >
                          <DropdownMenu.Item
                            className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-xs text-[var(--text-secondary)] outline-none hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
                            onSelect={() => toast('Edición próximamente')}
                          >
                            <Pencil size={12} /> Editar
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-xs text-[var(--red)] outline-none hover:bg-[rgba(248,113,113,0.1)]"
                            onSelect={() => handleDelete(tx.id)}
                          >
                            <Trash2 size={12} /> Eliminar
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[var(--border-default)] px-4 py-3">
          <p className="text-xs text-[var(--text-muted)]">
            {transactions.length} transacciones
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="rounded-[var(--radius-sm)] border border-[var(--border-default)] px-3 py-1 text-xs text-[var(--text-secondary)] disabled:opacity-40 hover:bg-[var(--bg-card-hover)]"
            >
              ←
            </button>
            <span className="flex items-center px-2 text-xs text-[var(--text-muted)]">
              {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="rounded-[var(--radius-sm)] border border-[var(--border-default)] px-3 py-1 text-xs text-[var(--text-secondary)] disabled:opacity-40 hover:bg-[var(--bg-card-hover)]"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
