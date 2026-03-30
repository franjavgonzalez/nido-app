'use client'

import { useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [loading, setLoading] = useState<'google' | 'apple' | null>(null)
  const supabase = createClient()

  async function handleOAuth(provider: 'google' | 'apple') {
    setLoading(provider)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      toast.error('Error al iniciar sesión. Intenta de nuevo.')
      setLoading(null)
    }
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  }
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center px-4"
      style={{
        background: `
          radial-gradient(circle at 20% 50%, rgba(201,168,76,0.04) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(201,168,76,0.03) 0%, transparent 40%),
          #0D0F14
        `,
      }}
    >
      {/* Dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #C9A84C 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <motion.div
        className="relative z-10 w-full max-w-[400px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="mb-10 text-center">
          <p className="font-display text-[52px] font-bold text-[var(--gold)] leading-none mb-3">
            🏠 Nido
          </p>
          <p className="text-[var(--text-muted)] font-light text-base">
            Gestión financiera para tu familia
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div variants={itemVariants} className="space-y-3">
          {/* Google */}
          <button
            onClick={() => handleOAuth('google')}
            disabled={loading !== null}
            className="flex w-full items-center justify-center gap-3 rounded-[var(--radius-md)] border border-[rgba(201,168,76,0.2)] bg-[var(--bg-card)] px-4 py-3 text-sm font-medium text-[var(--text-primary)] transition-all hover:border-[rgba(201,168,76,0.5)] hover:bg-[var(--bg-card-hover)] disabled:opacity-60"
          >
            {loading === 'google' ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continuar con Google
          </button>

          {/* Apple */}
          <button
            onClick={() => handleOAuth('apple')}
            disabled={loading !== null}
            className="flex w-full items-center justify-center gap-3 rounded-[var(--radius-md)] border border-[rgba(201,168,76,0.2)] bg-[var(--bg-card)] px-4 py-3 text-sm font-medium text-[var(--text-primary)] transition-all hover:border-[rgba(201,168,76,0.5)] hover:bg-[var(--bg-card-hover)] disabled:opacity-60"
          >
            {loading === 'apple' ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            )}
            Continuar con Apple
          </button>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mt-8 text-center text-xs text-[var(--text-muted)]"
        >
          Al continuar, aceptas los términos de uso de Nido
        </motion.p>
      </motion.div>
    </main>
  )
}
