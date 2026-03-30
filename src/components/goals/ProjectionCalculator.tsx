'use client'

import { useState, useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { addMonths, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatCurrency } from '@/lib/utils'
import type { CurrencyCode } from '@/types'

interface ProjectionCalculatorProps {
  currency: CurrencyCode
}

export default function ProjectionCalculator({ currency }: ProjectionCalculatorProps) {
  const [target, setTarget] = useState(10000)
  const [current, setCurrent] = useState(0)
  const [monthly, setMonthly] = useState(500)

  const { months, projectionData } = useMemo(() => {
    if (monthly <= 0 || current >= target) {
      return { months: 0, projectionData: [] }
    }
    const remaining = target - current
    const months = Math.ceil(remaining / monthly)
    const projectionData = Array.from({ length: Math.min(months + 1, 60) }, (_, i) => ({
      label: format(addMonths(new Date(), i), 'MMM yy', { locale: es }),
      value: Math.min(current + monthly * i, target),
    }))
    return { months, projectionData }
  }, [target, current, monthly])

  const completionDate = months > 0
    ? format(addMonths(new Date(), months), 'MMMM yyyy', { locale: es })
    : null

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[var(--radius-lg)] p-5">
      <h3 className="font-display text-base text-[var(--text-primary)] mb-4">Calculadora de proyección</h3>

      <div className="space-y-4 mb-5">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[var(--text-muted)]">Meta objetivo</span>
            <span className="text-[var(--gold)]">{formatCurrency(target, currency)}</span>
          </div>
          <input
            type="range" min={1000} max={500000} step={1000}
            value={target} onChange={e => setTarget(Number(e.target.value))}
            className="w-full accent-[var(--gold)]"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[var(--text-muted)]">Acumulado actual</span>
            <span className="text-[var(--blue)]">{formatCurrency(current, currency)}</span>
          </div>
          <input
            type="range" min={0} max={target} step={100}
            value={current} onChange={e => setCurrent(Number(e.target.value))}
            className="w-full accent-[var(--blue)]"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[var(--text-muted)]">Aporte mensual</span>
            <span className="text-[var(--green)]">{formatCurrency(monthly, currency)}</span>
          </div>
          <input
            type="range" min={100} max={50000} step={100}
            value={monthly} onChange={e => setMonthly(Number(e.target.value))}
            className="w-full accent-[var(--green)]"
          />
        </div>
      </div>

      {/* Result */}
      {completionDate && (
        <div className="bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.2)] rounded-[var(--radius-md)] p-4 mb-4">
          <p className="text-xs text-[var(--text-muted)]">Lo lograrías en</p>
          <p className="font-display text-lg text-[var(--gold)] capitalize">{completionDate}</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{months} meses de ahorro constante</p>
        </div>
      )}

      {/* Chart */}
      {projectionData.length > 1 && (
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={projectionData}>
            <defs>
              <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--gold)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 11 }}
              formatter={(v: number) => formatCurrency(v, currency)}
              labelStyle={{ color: 'var(--text-secondary)' }}
            />
            <Area
              type="monotone" dataKey="value" stroke="var(--gold)" strokeWidth={2}
              fill="url(#projGrad)" dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
