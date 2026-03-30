'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { CURRENCIES } from '@/lib/currencies'
import { slugify } from '@/lib/utils'
import { useAppStore } from '@/stores/appStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import type { CurrencyCode } from '@/types'

const DEFAULT_CATEGORIES = [
  // income
  { name: 'Sueldo', type: 'income', icon: '💼' },
  { name: 'Freelance', type: 'income', icon: '💻' },
  { name: 'Arriendo recibido', type: 'income', icon: '🏠' },
  { name: 'Inversiones', type: 'income', icon: '📈' },
  { name: 'Otros ingresos', type: 'income', icon: '💰' },
  // expense
  { name: 'Vivienda', type: 'expense', icon: '🏡' },
  { name: 'Alimentación', type: 'expense', icon: '🛒' },
  { name: 'Transporte', type: 'expense', icon: '🚗' },
  { name: 'Educación', type: 'expense', icon: '📚' },
  { name: 'Salud', type: 'expense', icon: '🏥' },
  { name: 'Entretenimiento', type: 'expense', icon: '🎬' },
  { name: 'Ropa', type: 'expense', icon: '👕' },
  { name: 'Servicios', type: 'expense', icon: '💡' },
  { name: 'Tecnología', type: 'expense', icon: '📱' },
  { name: 'Otros gastos', type: 'expense', icon: '📦' },
  // savings
  { name: 'Fondo de emergencia', type: 'savings', icon: '🛡️' },
  { name: 'Ahorro libre', type: 'savings', icon: '🐷' },
  // investment
  { name: 'Acciones', type: 'investment', icon: '📊' },
  { name: 'Fondos mutuos', type: 'investment', icon: '🏦' },
  { name: 'Criptomonedas', type: 'investment', icon: '₿' },
  { name: 'Depósitos a plazo', type: 'investment', icon: '📋' },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [familyName, setFamilyName] = useState('')
  const [currency, setCurrency] = useState<CurrencyCode>('USD')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { setFamily } = useAppStore()
  const supabase = createClient()

  async function handleCreate() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      // Create family
      const { data: family, error: familyError } = await supabase
        .from('families')
        .insert({
          name: familyName,
          slug: slugify(familyName) + '-' + Date.now(),
          primary_currency: currency,
        })
        .select()
        .single()

      if (familyError) throw familyError

      // Create member (owner)
      const { error: memberError } = await supabase
        .from('family_members')
        .insert({
          family_id: family.id,
          user_id: user.id,
          role: 'owner',
          display_name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Propietario',
          avatar_url: user.user_metadata?.avatar_url ?? null,
        })

      if (memberError) throw memberError

      // Create default categories
      await supabase.from('categories').insert(
        DEFAULT_CATEGORIES.map(cat => ({
          ...cat,
          family_id: family.id,
          is_default: true,
        }))
      )

      setFamily(family.id, family.name, currency)
      toast.success(`¡Bienvenido a ${familyName}! 🏠`, { duration: 4000 })
      router.push('/dashboard')
    } catch (err) {
      toast.error('Error al crear la familia. Intenta de nuevo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const progress = (step / 3) * 100

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-4">
      <div className="w-full max-w-[480px]">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="font-display text-3xl text-[var(--gold)] mb-2">🏠 Nido</p>
          <p className="text-sm text-[var(--text-muted)]">Configura tu espacio familiar</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map(s => (
              <span key={s} className={`text-xs ${s <= step ? 'text-[var(--gold)]' : 'text-[var(--text-muted)]'}`}>
                Paso {s}
              </span>
            ))}
          </div>
          <div className="h-1.5 w-full rounded-full bg-[var(--border-default)]">
            <motion.div
              className="h-full rounded-full bg-[var(--gold)]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[var(--radius-lg)] p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display text-xl mb-1">¿Cómo se llama tu familia?</h2>
                <p className="text-sm text-[var(--text-muted)] mb-6">Este nombre aparecerá en todos tus reportes</p>
                <Input
                  label="Nombre de la familia"
                  placeholder="Ej: Familia González"
                  value={familyName}
                  onChange={e => setFamilyName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && familyName.trim() && setStep(2)}
                />
                <Button
                  className="mt-6 w-full"
                  onClick={() => setStep(2)}
                  disabled={!familyName.trim()}
                >
                  Continuar →
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display text-xl mb-1">¿Cuál es tu moneda principal?</h2>
                <p className="text-sm text-[var(--text-muted)] mb-6">Podrás registrar transacciones en otras divisas también</p>
                <div className="grid grid-cols-3 gap-2">
                  {CURRENCIES.map(c => (
                    <button
                      key={c.code}
                      onClick={() => setCurrency(c.code)}
                      className={`flex flex-col items-center gap-1 rounded-[var(--radius-md)] border p-3 text-center text-sm transition-all ${
                        currency === c.code
                          ? 'border-[var(--gold)] bg-[rgba(201,168,76,0.1)] text-[var(--gold)]'
                          : 'border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--gold)/30] hover:bg-[var(--bg-card-hover)]'
                      }`}
                    >
                      <span className="text-xl">{c.flag}</span>
                      <span className="font-medium">{c.code}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">← Volver</Button>
                  <Button onClick={() => setStep(3)} className="flex-1">Continuar →</Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display text-xl mb-1">¡Todo listo!</h2>
                <p className="text-sm text-[var(--text-muted)] mb-6">Confirma los datos de tu familia</p>
                <div className="space-y-3 bg-[var(--bg-secondary)] rounded-[var(--radius-md)] p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">Familia</span>
                    <span className="text-[var(--text-primary)] font-medium">{familyName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">Moneda</span>
                    <span className="text-[var(--text-primary)] font-medium">
                      {CURRENCIES.find(c => c.code === currency)?.flag} {currency}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">Categorías</span>
                    <span className="text-[var(--text-primary)] font-medium">{DEFAULT_CATEGORIES.length} por defecto</span>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">← Volver</Button>
                  <Button onClick={handleCreate} loading={loading} className="flex-1">
                    Crear mi espacio 🏠
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}
