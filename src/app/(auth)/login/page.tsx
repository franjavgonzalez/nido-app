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

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleMagicLink = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    const supabase = createClient()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) {
      toast.error('Error al enviar el enlace. Intenta de nuevo.')
    } else {
      setSent(true)
    }
  }, [email])

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

          {sent ? (
            <div
              className="rounded-[var(--radius-md)] p-5 text-center"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
            >
              <p className="text-2xl mb-3">📬</p>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                Revisa tu correo
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Te enviamos un enlace a <span style={{ color: 'var(--text-secondary)' }}>{email}</span>.<br />
                Haz clic en él para ingresar a Nido.
              </p>
              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="mt-4 text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                Usar otro correo
              </button>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-3">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full px-3 py-2.5 text-sm outline-none transition-all"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{
                  background: 'var(--gold)',
                  borderRadius: 'var(--radius-md)',
                  color: '#0D0F14',
                }}
                onMouseEnter={e => !loading && ((e.currentTarget as HTMLButtonElement).style.background = 'var(--gold-light)')}
                onMouseLeave={e => !loading && ((e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)')}
              >
                {loading ? <Spinner /> : null}
                Enviar enlace de acceso
              </button>
            </form>
          )}

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
