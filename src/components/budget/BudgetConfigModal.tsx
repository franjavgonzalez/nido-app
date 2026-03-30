'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import type { Category, Budget, CurrencyCode } from '@/types'

interface BudgetConfigModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  familyId: string
  categories: Category[]
  existingBudgets: Budget[]
  month: number
  year: number
  currency: CurrencyCode
  onSuccess?: () => void
}

export default function BudgetConfigModal({
  open,
  onOpenChange,
  familyId,
  categories,
  existingBudgets,
  month,
  year,
  currency,
  onSuccess,
}: BudgetConfigModalProps) {
  const supabase = createClient()
  const expenseCategories = categories.filter(c => c.type === 'expense')

  const [amounts, setAmounts] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      existingBudgets.map(b => [b.category_id, String(b.amount)])
    )
  )
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const rows = expenseCategories
        .filter(c => amounts[c.id] && Number(amounts[c.id]) > 0)
        .map(c => ({
          family_id: familyId,
          category_id: c.id,
          amount: Number(amounts[c.id]),
          currency,
          period_month: month,
          period_year: year,
        }))

      const { error } = await supabase
        .from('budgets')
        .upsert(rows, { onConflict: 'family_id,category_id,period_month,period_year' })

      if (error) throw error
      toast.success('Presupuestos guardados')
      onOpenChange(false)
      onSuccess?.()
    } catch {
      toast.error('Error al guardar presupuestos')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Configurar presupuesto" maxWidth="500px">
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
        {expenseCategories.map(cat => (
          <div key={cat.id} className="flex items-center gap-3">
            <span className="w-6 text-base">{cat.icon ?? '📦'}</span>
            <span className="flex-1 text-sm text-[var(--text-primary)]">{cat.name}</span>
            <Input
              type="number"
              placeholder="0"
              value={amounts[cat.id] ?? ''}
              onChange={e => setAmounts(prev => ({ ...prev, [cat.id]: e.target.value }))}
              className="w-32 text-right"
            />
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-5">
        <Button variant="secondary" onClick={() => onOpenChange(false)} className="flex-1">Cancelar</Button>
        <Button onClick={handleSave} loading={saving} className="flex-1">Guardar</Button>
      </div>
    </Modal>
  )
}
