import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import KPICard from '@/components/dashboard/KPICard'
import IncomeExpenseChart from '@/components/dashboard/IncomeExpenseChart'
import ExpenseDonutChart from '@/components/dashboard/ExpenseDonutChart'
import GoalProgressCard from '@/components/dashboard/GoalProgressCard'
import RecentTransactionsList from '@/components/dashboard/RecentTransactionsList'
import type { CurrencyCode } from '@/types'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get family
  const { data: member } = await supabase
    .from('family_members')
    .select('family_id, families(id, name, primary_currency)')
    .eq('user_id', user.id)
    .single()

  if (!member) redirect('/onboarding')

  const family = (Array.isArray(member.families) ? member.families[0] : member.families) as { id: string; name: string; primary_currency: string } | null
  if (!family) redirect('/onboarding')

  const familyId = family.id
  const currency = family.primary_currency as CurrencyCode

  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  // KPIs current month
  const { data: currentTxs } = await supabase
    .from('transactions')
    .select('type, amount, currency, date')
    .eq('family_id', familyId)
    .gte('date', `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`)
    .lte('date', `${currentYear}-${String(currentMonth).padStart(2, '0')}-31`)

  const totalIncome = currentTxs?.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0) ?? 0
  const totalExpenses = currentTxs?.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0) ?? 0
  const totalSavings = currentTxs?.filter(t => t.type === 'savings').reduce((s, t) => s + Number(t.amount), 0) ?? 0
  const netBalance = totalIncome - totalExpenses

  // Last 6 months chart data
  const months6Data = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(currentYear, currentMonth - 1 - i, 1)
    return { month: d.getMonth() + 1, year: d.getFullYear(), income: 0, expenses: 0 }
  }).reverse()

  for (const m of months6Data) {
    const { data: txs } = await supabase
      .from('transactions')
      .select('type, amount')
      .eq('family_id', familyId)
      .gte('date', `${m.year}-${String(m.month).padStart(2, '0')}-01`)
      .lte('date', `${m.year}-${String(m.month).padStart(2, '0')}-31`)

    m.income = txs?.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0) ?? 0
    m.expenses = txs?.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0) ?? 0
  }

  // Expense by category
  const { data: categoryTxs } = await supabase
    .from('transactions')
    .select('amount, categories(name, icon)')
    .eq('family_id', familyId)
    .eq('type', 'expense')
    .gte('date', `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`)
    .lte('date', `${currentYear}-${String(currentMonth).padStart(2, '0')}-31`)

  const categoryMap = new Map<string, { name: string; icon: string; amount: number }>()
  for (const tx of categoryTxs ?? []) {
    const catRaw = tx.categories
    const cat = (Array.isArray(catRaw) ? catRaw[0] : catRaw) as { name: string; icon: string } | null
    const key = cat?.name ?? 'Sin categoría'
    const existing = categoryMap.get(key) ?? { name: key, icon: cat?.icon ?? '📦', amount: 0 }
    existing.amount += Number(tx.amount)
    categoryMap.set(key, existing)
  }
  const categorySpend = Array.from(categoryMap.values()).sort((a, b) => b.amount - a.amount).slice(0, 8)

  // Active goals
  const { data: goals } = await supabase
    .from('goals')
    .select('*')
    .eq('family_id', familyId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(3)

  // Recent transactions
  const { data: recentTxs } = await supabase
    .from('transactions')
    .select('*, categories(name, icon)')
    .eq('family_id', familyId)
    .order('date', { ascending: false })
    .limit(5)

  const transactions = (recentTxs ?? []).map(tx => ({
    ...tx,
    category: tx.categories as { name: string; icon: string } | null,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-[var(--text-primary)]">{family.name}</h1>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">
          Resumen de {new Date(currentYear, currentMonth - 1).toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard label="Ingresos" value={totalIncome} currency={currency} variant="green" />
        <KPICard label="Gastos" value={totalExpenses} currency={currency} variant="red" />
        <KPICard label="Ahorros" value={totalSavings} currency={currency} variant="gold" />
        <KPICard label="Balance neto" value={netBalance} currency={currency} variant={netBalance >= 0 ? 'blue' : 'red'} />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <IncomeExpenseChart data={months6Data} currency={currency} />
        {categorySpend.length > 0
          ? <ExpenseDonutChart data={categorySpend} currency={currency} />
          : (
            <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[var(--radius-lg)] p-5 flex items-center justify-center text-sm text-[var(--text-muted)]">
              Sin gastos este mes
            </div>
          )}
      </div>

      {/* Goals */}
      {goals && goals.length > 0 && (
        <div>
          <h2 className="font-display text-lg text-[var(--text-primary)] mb-3">Metas activas</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {goals.map(goal => <GoalProgressCard key={goal.id} goal={goal} />)}
          </div>
        </div>
      )}

      {/* Recent transactions */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[var(--radius-lg)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-[var(--text-primary)]">Movimientos recientes</h2>
          <a href="/transactions" className="text-xs text-[var(--gold)] hover:underline">Ver todos</a>
        </div>
        <RecentTransactionsList transactions={transactions as Parameters<typeof RecentTransactionsList>[0]['transactions']} />
      </div>
    </div>
  )
}
