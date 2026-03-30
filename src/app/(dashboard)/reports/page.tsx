'use client'

import { useState, useEffect, useCallback } from 'react'
import { Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/stores/appStore'
import { getMonthName, calculateProgress } from '@/lib/utils'
import { generateFamilyReport } from '@/lib/pdf'
import Button from '@/components/ui/Button'
import ReportPreview from '@/components/reports/ReportPreview'
import type { CurrencyCode, Goal } from '@/types'

interface CategoryReport {
  name: string
  icon: string
  budget: number
  spent: number
}

export default function ReportsPage() {
  const supabase = createClient()
  const { familyId, primaryCurrency, currentMonth, currentYear, setCurrentPeriod } = useAppStore()

  const [familyName, setFamilyName] = useState('')
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [totalSavings, setTotalSavings] = useState(0)
  const [categories, setCategories] = useState<CategoryReport[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReport = useCallback(async () => {
    if (!familyId) return
    setLoading(true)

    const monthStr = String(currentMonth).padStart(2, '0')

    const [{ data: family }, { data: txs }, { data: buds }, { data: goalData }] = await Promise.all([
      supabase.from('families').select('name').eq('id', familyId).single(),
      supabase.from('transactions').select('type, amount, category_id, categories(name, icon)')
        .eq('family_id', familyId)
        .gte('date', `${currentYear}-${monthStr}-01`)
        .lte('date', `${currentYear}-${monthStr}-31`),
      supabase.from('budgets').select('category_id, amount, categories(name, icon)')
        .eq('family_id', familyId)
        .eq('period_month', currentMonth)
        .eq('period_year', currentYear),
      supabase.from('goals').select('*').eq('family_id', familyId).eq('status', 'active'),
    ])

    setFamilyName(family?.name ?? '')
    setGoals(goalData ?? [])

    const income = txs?.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0) ?? 0
    const expenses = txs?.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0) ?? 0
    const savings = txs?.filter(t => t.type === 'savings').reduce((s, t) => s + Number(t.amount), 0) ?? 0

    setTotalIncome(income)
    setTotalExpenses(expenses)
    setTotalSavings(savings)

    const spentMap: Record<string, number> = {}
    for (const tx of txs ?? []) {
      if (tx.type === 'expense' && tx.category_id) {
        spentMap[tx.category_id] = (spentMap[tx.category_id] ?? 0) + Number(tx.amount)
      }
    }

    const cats: CategoryReport[] = (buds ?? []).map(b => {
      const catRaw = b.categories
      const cat = (Array.isArray(catRaw) ? catRaw[0] : catRaw) as { name: string; icon: string } | null
      return {
        name: cat?.name ?? 'Categoría',
        icon: cat?.icon ?? '📦',
        budget: b.amount,
        spent: spentMap[b.category_id] ?? 0,
      }
    })
    setCategories(cats)
    setLoading(false)
  }, [familyId, currentMonth, currentYear, supabase])

  useEffect(() => { fetchReport() }, [fetchReport])

  function handleExportPDF() {
    generateFamilyReport({
      familyName,
      period: getMonthName(currentMonth, currentYear),
      totalIncome,
      totalExpenses,
      totalSavings,
      currency: primaryCurrency as CurrencyCode,
      categories,
    })
  }

  function prevMonth() {
    if (currentMonth === 1) setCurrentPeriod(12, currentYear - 1)
    else setCurrentPeriod(currentMonth - 1, currentYear)
  }
  function nextMonth() {
    if (currentMonth === 12) setCurrentPeriod(1, currentYear + 1)
    else setCurrentPeriod(currentMonth + 1, currentYear)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-[var(--text-primary)]">Reportes</h1>
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
        <Button onClick={handleExportPDF} className="gap-2" disabled={loading}>
          <Download size={16} />
          Exportar PDF
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-[var(--text-muted)]">Generando reporte...</div>
      ) : (
        <ReportPreview
          familyName={familyName}
          month={currentMonth}
          year={currentYear}
          currency={primaryCurrency as CurrencyCode}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          totalSavings={totalSavings}
          categories={categories}
          goals={goals}
        />
      )}
    </div>
  )
}
