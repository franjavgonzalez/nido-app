'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import CurrencySelector from '@/components/ui/CurrencySelector'
import type { Category, CurrencyCode, FamilyMember, TransactionType } from '@/types'

const schema = z.object({
  type: z.enum(['income', 'expense', 'savings', 'investment', 'transfer']),
  amount: z.coerce.number().positive('El monto debe ser mayor a 0'),
  currency: z.string().min(1),
  category_id: z.string().optional(),
  description: z.string().optional(),
  date: z.string().min(1, 'Selecciona una fecha'),
  member_id: z.string().optional(),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface TransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  familyId: string
  categories: Category[]
  members: FamilyMember[]
  defaultCurrency: CurrencyCode
  onSuccess?: () => void
}

const TYPE_OPTIONS = [
  { value: 'income', label: '💰 Ingreso' },
  { value: 'expense', label: '💸 Gasto' },
  { value: 'savings', label: '🐷 Ahorro' },
  { value: 'investment', label: '📈 Inversión' },
  { value: 'transfer', label: '🔄 Transferencia' },
]

export default function TransactionModal({
  open,
  onOpenChange,
  familyId,
  categories,
  members,
  defaultCurrency,
  onSuccess,
}: TransactionModalProps) {
  const supabase = createClient()

  const { register, handleSubmit, control, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'expense',
      currency: defaultCurrency,
      date: new Date().toISOString().split('T')[0],
    },
  })

  const selectedType = watch('type') as TransactionType
  const filteredCategories = categories
    .filter(c => c.type === selectedType || (selectedType === 'transfer' && c.type === 'expense'))
    .map(c => ({ value: c.id, label: `${c.icon ?? ''} ${c.name}` }))

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  async function onSubmit(data: FormData) {
    const { error } = await supabase.from('transactions').insert({
      family_id: familyId,
      type: data.type,
      amount: data.amount,
      currency: data.currency,
      category_id: data.category_id || null,
      description: data.description || null,
      date: data.date,
      member_id: data.member_id || null,
      notes: data.notes || null,
    })

    if (error) {
      toast.error('Error al guardar la transacción')
      return
    }

    toast.success('Transacción guardada')
    onOpenChange(false)
    onSuccess?.()
  }

  const memberOptions = members.map(m => ({
    value: m.id,
    label: m.display_name ?? 'Miembro',
  }))

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Nueva transacción" maxWidth="520px">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Type tabs */}
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">Tipo</p>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {TYPE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => field.onChange(opt.value)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      field.value === opt.value
                        ? 'border-[var(--gold)] bg-[rgba(201,168,76,0.15)] text-[var(--gold)]'
                        : 'border-[var(--border-default)] text-[var(--text-muted)] hover:border-[var(--gold)/30]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        {/* Amount + currency */}
        <div className="flex gap-3">
          <Input
            label="Monto"
            type="number"
            step="any"
            placeholder="0"
            className="text-lg h-12 flex-1"
            error={errors.amount?.message}
            {...register('amount')}
          />
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <CurrencySelector
                value={field.value as CurrencyCode}
                onValueChange={field.onChange}
                label="Moneda"
                className="w-44"
              />
            )}
          />
        </div>

        {/* Category */}
        {filteredCategories.length > 0 && (
          <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
              <Select
                label="Categoría"
                value={field.value}
                onValueChange={field.onChange}
                options={filteredCategories}
                placeholder="Sin categoría"
              />
            )}
          />
        )}

        {/* Description + date */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Descripción"
            placeholder="Opcional"
            {...register('description')}
          />
          <Input
            label="Fecha"
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />
        </div>

        {/* Member */}
        {members.length > 1 && (
          <Controller
            name="member_id"
            control={control}
            render={({ field }) => (
              <Select
                label="Miembro (opcional)"
                value={field.value}
                onValueChange={field.onChange}
                options={memberOptions}
                placeholder="Cualquier miembro"
              />
            )}
          />
        )}

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Notas (opcional)</label>
          <textarea
            rows={2}
            placeholder="Notas adicionales..."
            className="w-full resize-none rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--gold)]"
            {...register('notes')}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting} className="flex-1">
            Guardar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
