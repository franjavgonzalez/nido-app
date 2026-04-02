'use client'

import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

export default function LoginPage() {
  const [loading, setLoading] = useState<'google' | 'apple' | null>(null)

  const handleOAuth = useCallback(async (provider: 'google' | 'apple') => {
    const supabase = createClient()
    setLoading(provider)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      toast.error('Error al iniciar sesión. Verifica que OAuth esté configurado en Supabase.')
      setLoading(null)
    }
  }, [])

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* ── Left panel — decorative ───────────────── */}
      <div
        className="hidden lg:flex lg:w-[52%] relative overflow-hidden items-end"
        style={{
          background: 'linear-gradient(135deg, #0D0F14 0%, #161921 50%, #1a1f2e 100%)',
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 30% 60%, rgba(201,168,76,0.07) 0%, transparent 70%)',
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(201,168,76,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(201,168,76,0.8) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-12 pb-16 max-w-md">
          {/* Logo */}
          <div className="mb-16">
            <p
              className="font-display text-3xl font-semibold"
              style={{ color: 'var(--gold)' }}
            >
              🏠 Nido
            </p>
          </div>

          {/* Headline */}
          <h1
            className="font-display text-[2.6rem] leading-[1.15] font-semibold mb-5"
            style={{ color: 'var(--text-primary)' }}
          >
            Las finanzas de<br />
            tu familia,<br />
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>sin complicaciones.</em>
          </h1>

          <p
            className="text-base font-light leading-relaxed mb-12"
            style={{ color: 'var(--text-muted)' }}
          >
            Dashboard, presupuesto, metas de ahorro y reportes PDF — todo en un solo lugar diseñado para familias.
          </p>

          {/* Features list */}
          <div className="space-y-3">
            {[
              ['📊', 'Dashboard con KPIs en tiempo real'],
              ['🎯', 'Metas de ahorro con proyección'],
              ['📄', 'Reportes PDF exportables'],
              ['🌍', 'Soporte para 9 divisas'],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-base">{icon}</span>
                <span
                  className="text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — login form ──────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden mb-10 text-center">
          <p
            className="font-display text-4xl font-semibold mb-2"
            style={{ color: 'var(--gold)' }}
          >
            🏠 Nido
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Gestión financiera familiar
          </p>
        </div>

        <div className="w-full max-w-[360px]">
          {/* Heading */}
          <div className="mb-8">
            <h2
              className="font-display text-2xl font-semibold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Iniciar sesión
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Accede con tu cuenta para continuar
            </p>
          </div>

          {/* Divider */}
          <div
            className="h-px w-full mb-6"
            style={{ background: 'var(--border-default)' }}
          />

          {/* OAuth buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleOAuth('google')}
              disabled={loading !== null}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)'
                ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-card-hover)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-default)'
                ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-card)'
              }}
              className="flex w-full items-center justify-center gap-3 px-4 py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'google' ? <Spinner /> : <GoogleIcon />}
              <span>Continuar con Google</span>
            </button>

            <button
              onClick={() => handleOAuth('apple')}
              disabled={loading !== null}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)'
                ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-card-hover)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-default)'
                ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-card)'
              }}
              className="flex w-full items-center justify-center gap-3 px-4 py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'apple' ? <Spinner /> : <AppleIcon />}
              <span>Continuar con Apple</span>
            </button>
          </div>

          {/* Footer note */}
          <p
            className="mt-8 text-center text-xs leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            Al continuar aceptas los{' '}
            <span style={{ color: 'var(--text-secondary)' }}>términos de uso</span>{' '}
            de Nido
          </p>
        </div>
      </div>
    </div>
  )
}
