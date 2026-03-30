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
import CurrencySelector from '@/components/ui/CurrencySelector'
import type { CurrencyCode, Goal } from '@/types'

const ICONS = ['🏠', '🚗', '🎓', '✈️', '💍', '🏖️', '📱', '💪', '🏥', '🌱', '🎵', '🐶', '📦', '🎮', '🍕']

const schema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  description: z.string().optional(),
  target_amount: z.number({ error: 'Ingresa un monto válido' }).positive('Monto debe ser mayor a 0'),
  current_amount: z.number().min(0).optional(),
  currency: z.string().min(1),
  target_date: z.string().optional(),
  icon: z.string().optional(),
})
type FormData = z.infer<typeof schema>

interface GoalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  familyId: string
  defaultCurrency: CurrencyCode
  goal?: Goal
  onSuccess?: () => void
}

export default function GoalModal({
  open,
  onOpenChange,
  familyId,
  defaultCurrency,
  goal,
  onSuccess,
}: GoalModalProps) {
  const supabase = createClient()
  const isEditing = !!goal

  const { register, handleSubmit, control, watch, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { currency: defaultCurrency, icon: '🎯', current_amount: 0 },
  })

  const selectedIcon = watch('icon')

  useEffect(() => {
    if (goal) {
      reset({
        name: goal.name,
        description: goal.description ?? '',
        target_amount: goal.target_amount,
        current_amount: goal.current_amount,
        currency: goal.currency,
        target_date: goal.target_date ?? '',
        icon: goal.icon ?? '🎯',
      })
    } else {
      reset({ currency: defaultCurrency, icon: '🎯', current_amount: 0 })
    }
  }, [goal, open, reset, defaultCurrency])

  async function onSubmit(data: FormData) {
    const payload = {
      family_id: familyId,
      name: data.name,
      description: data.description || null,
      target_amount: data.target_amount,
      current_amount: data.current_amount ?? 0,
      currency: data.currency,
      target_date: data.target_date || null,
      icon: data.icon || '🎯',
    }

    let error
    if (isEditing && goal) {
      ({ error } = await supabase.from('goals').update(payload).eq('id', goal.id))
    } else {
      ({ error } = await supabase.from('goals').insert(payload))
    }

    if (error) {
      toast.error('Error al guardar la meta')
      return
    }

    toast.success(isEditing ? 'Meta actualizada' : 'Meta creada')
    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar meta' : 'Nueva meta'}
      maxWidth="500px"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Icon picker */}
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">Ícono</p>
          <div className="flex flex-wrap gap-2">
            {ICONS.map(icon => (
              <button
                key={icon}
                type="button"
                onClick={() => setValue('icon', icon)}
                className={`h-9 w-9 rounded-[var(--radius-sm)] text-lg transition-colors ${
                  selectedIcon === icon
                    ? 'bg-[rgba(201,168,76,0.2)] ring-1 ring-[var(--gold)]'
                    : 'hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <Input label="Nombre" placeholder="Ej: Viaje a Europa" error={errors.name?.message} {...register('name')} />
        <Input label="Descripción (opcional)" placeholder="Detalle de la meta" {...register('description')} />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Monto objetivo"
            type="number"
            placeholder="0"
            error={errors.target_amount?.message}
            {...register('target_amount', { valueAsNumber: true })}
          />
          <Input
            label="Monto inicial"
            type="number"
            placeholder="0"
            {...register('current_amount', { valueAsNumber: true })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <CurrencySelector value={field.value as CurrencyCode} onValueChange={field.onChange} label="Moneda" />
            )}
          />
          <Input label="Fecha límite (opcional)" type="date" {...register('target_date')} />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} className="flex-1">Cancelar</Button>
          <Button type="submit" loading={isSubmitting} className="flex-1">
            {isEditing ? 'Actualizar' : 'Crear meta'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
