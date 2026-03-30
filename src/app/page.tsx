'use client'

import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'

const features = [
  { icon: '📊', title: 'Dashboard en tiempo real', desc: 'Visualiza ingresos, gastos y ahorros del mes en un solo lugar.' },
  { icon: '📳', title: 'Multidivisa', desc: '9 monedas disponibles: USD, EUR, CLP, ARS, MXN, COP, BRL, PEN, GBP.' },
  { icon: '🎯', title: 'Metas financieras', desc: 'Define objetivos, aporta y proyecta cuándo los alcanzarás.' },
  { icon: '📄', title: 'Reportes PDF', desc: 'Genera informes mensuales con análisis detallado por categoría.' },
]

const steps = [
  { n: '01', title: 'Crea tu familia', desc: 'Elige nombre y moneda principal. Listo en 30 segundos.' },
  { n: '02', title: 'Registra movimientos', desc: 'Ingresa tus transacciones con categorías personalizadas.' },
  { n: '03', title: 'Toma decisiones', desc: 'Los reportes te dicen dónde ahorrar y cómo avanzar.' },
]

const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export default function LandingPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, #C9A84C 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <p className="font-display text-xl text-[var(--gold)]">🏠 Nido</p>
        <Link
          href="/login"
          className="rounded-[var(--radius-md)] border border-[rgba(201,168,76,0.3)] px-4 py-2 text-sm text-[var(--text-primary)] hover:border-[var(--gold)] hover:bg-[var(--bg-card)] transition-all"
        >
          Iniciar sesión
        </Link>
      </nav>

      <motion.section
        className="relative z-10 flex flex-col items-center px-6 pt-20 pb-24 text-center max-w-3xl mx-auto"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.p variants={item} className="font-display text-[clamp(2.5rem,8vw,5rem)] leading-none text-[var(--gold)] mb-6">
          🏠 Nido
        </motion.p>
        <motion.h1 variants={item} className="font-display text-[clamp(1.4rem,3vw,2.2rem)] text-[var(--text-primary)] mb-4">
          Las finanzas de tu familia,<br />sin complicaciones
        </motion.h1>
        <motion.p variants={item} className="text-[var(--text-secondary)] text-base max-w-md mb-10 font-light">
          Dashboard, transacciones, presupuesto, metas y reportes PDF. Todo en un solo lugar diseñado para familias.
        </motion.p>
        <motion.div variants={item} className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/login"
            className="rounded-[var(--radius-md)] bg-[var(--gold)] px-6 py-3 text-sm font-semibold text-[#0D0F14] hover:bg-[var(--gold-light)] transition-colors"
          >
            Empezar gratis →
          </Link>
          <a
            href="#como-funciona"
            className="rounded-[var(--radius-md)] border border-[var(--border-default)] px-6 py-3 text-sm text-[var(--text-secondary)] hover:border-[rgba(201,168,76,0.3)] hover:bg-[var(--bg-card)] transition-all"
          >
            Ver cómo funciona
          </a>
        </motion.div>
      </motion.section>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-5"
            >
              <p className="text-3xl mb-3">{f.icon}</p>
              <p className="font-display text-base text-[var(--text-primary)] mb-1">{f.title}</p>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="como-funciona" className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <h2 className="font-display text-2xl text-[var(--text-primary)] text-center mb-10">
          Cómo funciona
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              className="text-center"
            >
              <p className="font-display text-4xl text-[rgba(201,168,76,0.2)] mb-3">{s.n}</p>
              <p className="font-display text-lg text-[var(--text-primary)] mb-2">{s.title}</p>
              <p className="text-sm text-[var(--text-muted)]">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-[var(--border-default)] px-6 py-6 text-center">
        <p className="text-xs text-[var(--text-muted)]">Nido © 2026 · Gestión financiera familiar</p>
      </footer>
    </main>
  )
}
