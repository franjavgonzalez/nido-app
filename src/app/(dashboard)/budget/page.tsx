'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/stores/appStore'
import { getMonthName, formatCurrency, calculateProgress } from '@/lib/utils'
import Button from '@/components/ui/Button'
import BudgetCategoryCard from '@/components/budget/BudgetCategoryCard'
import BudgetConfigModal from '@/components/budget/BudgetConfigModal'
import Progress from '@/components/ui/Progress'
import type { BudgetWithSpent, Category, Budget, CurrencyCode } from '@/types'

export default function BudgetPage() {
  const supabase = createClient()
  const { familyId, primaryCurrency, currentMonth, currentYear, setCurrentPeriod } = useAppStore()

  const [budgets, setBudgets] = useState<BudgetWithSpent[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [rawBudgets, setRawBudgets] = useState<Budget[]>([])
  const [configOpen, setConfigOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchBudgets = useCallback(async () => {
    if (!familyId) return
    setLoading(true)

    const monthStr = String(currentMonth).padStart(2, '0')

    const [{ data: cats }, { data: buds }, { data: txs }] = await Promise.all([
      supabase.from('categories').select('*').eq('family_id', familyId).eq('type', 'expense'),
      supabase.from('budgets').select('*, categories(name, icon, type)').eq('family_id', familyId)
        .eq('period_month', currentMonth).eq('period_year', currentYear),
      supabase.from('transactions').select('amount, category_id').eq('family_id', familyId)
        .eq('type', 'expense')
        .gte('date', `${currentYear}-${monthStr}-01`)
        .lte('date', `${currentYear}-${monthStr}-31`),
    ])

    setCategories(cats ?? [])
    setRawBudgets((buds ?? []) as Budget[])

    const spentByCategory: Record<string, number> = {}
    for (const tx of txs ?? []) {
      if (tx.category_id) {
        spentByCategory[tx.category_id] = (spentByCategory[tx.category_id] ?? 0) + Number(tx.amount)
      }
    }

    const enriched = (buds ?? []).map(b => ({
      ...b,
      category: b.categories as { name: string; icon: string; type: string } | null,
      spent: spentByCategory[b.category_id] ?? 0,
      percentage: calculateProgress(spentByCategory[b.category_id] ?? 0, b.amount),
    })) as BudgetWithSpent[]

    setBudgets(enriched)
    setLoading(false)
  }, [familyId, currentMonth, currentYear, supabase])

  useEffect(() => { fetchBudgets() }, [fetchBudgets])

  function prevMonth() {
    if (currentMonth === 1) setCurrentPeriod(12, currentYear - 1)
    else setCurrentPeriod(currentMonth - 1, currentYear)
  }
  function nextMonth() {
    if (currentMonth === 12) setCurrentPeriod(1, currentYear + 1)
    else setCurrentPeriod(currentMonth + 1, currentYear)
  }

  const totalBudgeted = budgets.reduce((s, b) => s + b.amount, 0)
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0)
  const totalPct = calculateProgress(totalSpent, totalBudgeted)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-[var(--text-primary)]">Presupuesto</h1>
          <div className="flex items-center gap-2 mt-1">
            <button onClick={prevMonth} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-[var(--text-secondary)] capitalize">
              {getMonthName(currentMonth, currentYear)}
            </span>
            <button onClick={nextMonth} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <Button variant="secondary" onClick={() => setConfigOpen(true)} className="gap-2">
          <Settings size={15} /> Configurar
        </Button>
      </div>

      {/* Summary */}
      {totalBudgeted > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[var(--radius-lg)] p-5">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-1">Presupuestado</p>
              <p className="font-display text-lg text-[var(--text-primary)]">
                {formatCurrency(totalBudgeted, primaryCurrency as CurrencyCode)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-1">Gastado</p>
              <p className="font-display text-lg text-[var(--red)]">
                {formatCurrency(totalSpent, primaryCurrency as CurrencyCode)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-1">Utilizado</p>
              <p className="font-display text-lg" style={{ color: totalPct < 70 ? 'var(--green)' : totalPct < 90 ? 'var(--orange)' : 'var(--red)' }}>
                {totalPct}%
              </p>
            </div>
          </div>
          <Progress
            value={totalPct}
            color={totalPct < 70 ? 'green' : totalPct < 90 ? 'orange' : 'red'}
            height={10}
          />
        </div>
      )}

      {/* Budget cards */}
      {loading ? (
        <div className="py-20 text-center text-sm text-[var(--text-muted)]">Cargando...</div>
      ) : budgets.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[var(--radius-lg)] py-16 text-center">
          <p className="text-3xl mb-3">📊</p>
          <p className="text-[var(--text-muted)] text-sm mb-4">Aún no has configurado presupuestos para este mes</p>
          <Button onClick={() => setConfigOpen(true)}>Configurar presupuesto</Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.map(b => <BudgetCategoryCard key={b.id} budget={b} />)}
        </div>
      )}

      <BudgetConfigModal
        open={configOpen}
        onOpenChange={setConfigOpen}
        familyId={familyId!}
        categories={categories}
        existingBudgets={rawBudgets}
        month={currentMonth}
        year={currentYear}
        currency={primaryCurrency as CurrencyCode}
        onSuccess={fetchBudgets}
      />
    </div>
  )
}
