'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/stores/appStore'
import { getMonthName } from '@/lib/utils'
import Button from '@/components/ui/Button'
import TransactionModal from '@/components/transactions/TransactionModal'
import TransactionsTable from '@/components/transactions/TransactionsTable'
import type { Category, CurrencyCode, FamilyMember, Transaction } from '@/types'

export default function TransactionsPage() {
  const supabase = createClient()
  const { familyId, primaryCurrency, currentMonth, currentYear, setCurrentPeriod } = useAppStore()

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [members, setMembers] = useState<FamilyMember[]>([])
  const [filter, setFilter] = useState<'all' | 'income' | 'expense' | 'savings' | 'investment'>('all')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    if (!familyId) return
    setLoading(true)

    const monthStr = String(currentMonth).padStart(2, '0')
    let query = supabase
      .from('transactions')
      .select('*, categories(name, icon, type, color), family_members(display_name)')
      .eq('family_id', familyId)
      .gte('date', `${currentYear}-${monthStr}-01`)
      .lte('date', `${currentYear}-${monthStr}-31`)
      .order('date', { ascending: false })

    if (filter !== 'all') query = query.eq('type', filter)

    const { data } = await query
    setTransactions((data ?? []).map(tx => ({
      ...tx,
      category: tx.categories,
      member: tx.family_members,
    })) as Transaction[])
    setLoading(false)
  }, [familyId, currentMonth, currentYear, filter, supabase])

  useEffect(() => {
    async function loadMeta() {
      if (!familyId) return
      const [{ data: cats }, { data: mems }] = await Promise.all([
        supabase.from('categories').select('*').eq('family_id', familyId),
        supabase.from('family_members').select('*').eq('family_id', familyId),
      ])
      setCategories(cats ?? [])
      setMembers(mems ?? [])
    }
    loadMeta()
  }, [familyId, supabase])

  useEffect(() => { fetchData() }, [fetchData])

  function prevMonth() {
    if (currentMonth === 1) setCurrentPeriod(12, currentYear - 1)
    else setCurrentPeriod(currentMonth - 1, currentYear)
  }

  function nextMonth() {
    if (currentMonth === 12) setCurrentPeriod(1, currentYear + 1)
    else setCurrentPeriod(currentMonth + 1, currentYear)
  }

  const filtered = transactions.filter(tx =>
    !search || [tx.description, tx.category?.name].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  )

  const tabs = [
    { key: 'all', label: 'Todos' },
    { key: 'income', label: '💰 Ingresos' },
    { key: 'expense', label: '💸 Gastos' },
    { key: 'savings', label: '🐷 Ahorros' },
    { key: 'investment', label: '📈 Inversiones' },
  ] as const

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-[var(--text-primary)]">Transacciones</h1>
          <div className="flex items-center gap-2 mt-1">
            <button onClick={prevMonth} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-[var(--text-secondary)] capitalize">
              {getMonthName(currentMonth, currentYear)}
            </span>
            <button onClick={nextMonth} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-2">
          <Plus size={16} />
          Nueva transacción
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-full p-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-[var(--gold)] text-[#0D0F14]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar..."
          className="h-9 rounded-full border border-[var(--border-default)] bg-[var(--bg-card)] px-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--gold)] transition-colors"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[var(--radius-lg)] py-20 text-center text-sm text-[var(--text-muted)]">
          Cargando...
        </div>
      ) : (
        <TransactionsTable transactions={filtered} onRefresh={fetchData} />
      )}

      <TransactionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        familyId={familyId!}
        categories={categories}
        members={members}
        defaultCurrency={primaryCurrency as CurrencyCode}
        onSuccess={fetchData}
      />
    </div>
  )
}
