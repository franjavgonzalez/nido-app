'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import type { CurrencyCode } from '@/types'

const COLORS = [
  '#C9A84C', '#4ADE80', '#60A5FA', '#F87171', '#A78BFA',
  '#FB923C', '#34D399', '#F472B6', '#FBBF24', '#818CF8',
]

interface CategorySpend {
  name: string
  icon: string
  amount: number
}

interface ExpenseDonutChartProps {
  data: CategorySpend[]
  currency: CurrencyCode
}

export default function ExpenseDonutChart({ data, currency }: ExpenseDonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[var(--radius-lg)] p-5">
      <p className="text-sm font-medium text-[var(--text-secondary)] mb-4">Gastos por categoría</p>
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <ResponsiveContainer width={170} height={170}>
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                strokeWidth={0}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const item = payload[0]
                  return (
                    <div className="rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--bg-card)] px-3 py-2 text-xs">
                      <p className="font-medium text-[var(--text-primary)]">{item.name}</p>
                      <p style={{ color: item.payload.fill }}>{formatCurrency(item.value as number, currency)}</p>
                    </div>
                  )
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="font-display text-base font-semibold text-[var(--text-primary)] leading-none">
              {formatCurrency(total, currency)}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">total</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-1.5 min-w-0">
          {data.slice(0, 6).map((item, i) => {
            const pct = total > 0 ? Math.round((item.amount / total) * 100) : 0
            return (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="flex-1 truncate text-[var(--text-secondary)]">
                  {item.icon} {item.name}
                </span>
                <span className="text-[var(--text-muted)] shrink-0">{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
