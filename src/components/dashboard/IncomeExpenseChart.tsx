'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { formatCurrency, getMonthName } from '@/lib/utils'
import type { CurrencyCode } from '@/types'

interface MonthData {
  month: number
  year: number
  income: number
  expenses: number
}

interface IncomeExpenseChartProps {
  data: MonthData[]
  currency: CurrencyCode
}

function CustomTooltip({ active, payload, label, currency }: {
  active?: boolean
  payload?: { value: number; name: string; color: string }[]
  label?: string
  currency: CurrencyCode
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-card)] p-3 text-xs shadow-lg">
      <p className="mb-2 font-medium text-[var(--text-secondary)]">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name === 'income' ? 'Ingresos' : 'Gastos'}: {formatCurrency(p.value, currency)}
        </p>
      ))}
    </div>
  )
}

export default function IncomeExpenseChart({ data, currency }: IncomeExpenseChartProps) {
  const chartData = data.map(d => ({
    name: getMonthName(d.month).split(' ')[0].slice(0, 3),
    income: d.income,
    expenses: d.expenses,
  }))

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[var(--radius-lg)] p-5">
      <p className="text-sm font-medium text-[var(--text-secondary)] mb-4">Ingresos vs Gastos</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} barGap={4} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="var(--border-default)" strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${Math.round(v / 1000)}k`}
            width={36}
          />
          <Tooltip content={<CustomTooltip currency={currency} />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="income" fill="var(--green)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" fill="var(--red)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
