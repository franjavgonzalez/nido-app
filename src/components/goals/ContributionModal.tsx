'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import type { Goal } from '@/types'

const schema = z.object({
  amount: z.coerce.number().positive('Monto debe ser mayor a 0'),
  note: z.string().optional(),
  date: z.string().min(1),
})
type FormData = z.infer<typeof schema>

interface ContributionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal: Goal | null
  onSuccess?: () => void
}

export default function ContributionModal({ open, onOpenChange, goal, onSuccess }: ContributionModalProps) {
  const supabase = createClient()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { date: new Date().toISOString().split('T')[0] },
  })

  async function onSubmit(data: FormData) {
    if (!goal) return

    const newAmount = goal.current_amount + data.amount
    const newStatus = newAmount >= goal.target_amount ? 'completed' : 'active'

    const [contrib, update] = await Promise.all([
      supabase.from('goal_contributions').insert({
        goal_id: goal.id,
        amount: data.amount,
        note: data.note || null,
        date: data.date,
      }),
      supabase.from('goals').update({
        current_amount: newAmount,
        status: newStatus,
      }).eq('id', goal.id),
    ])

    if (contrib.error || update.error) {
      toast.error('Error al registrar el aporte')
      return
    }

    if (newStatus === 'completed') {
      toast.success('🎉 ¡Meta completada!', { duration: 5000 })
    } else {
      toast.success('Aporte registrado')
    }

    reset()
    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={`Aportar a: ${goal?.name}`} maxWidth="400px">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Monto a aportar"
          type="number"
          placeholder="0"
          className="text-lg h-12"
          error={errors.amount?.message}
          {...register('amount')}
        />
        <Input label="Nota (opcional)" placeholder="Ej: ahorro mensual" {...register('note')} />
        <Input label="Fecha" type="date" error={errors.date?.message} {...register('date')} />
        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} className="flex-1">Cancelar</Button>
          <Button type="submit" loading={isSubmitting} className="flex-1">Confirmar aporte</Button>
        </div>
      </form>
    </Modal>
  )
}
