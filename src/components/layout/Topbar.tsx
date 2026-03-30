'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transacciones',
  '/budget': 'Presupuesto',
  '/goals': 'Metas',
  '/reports': 'Reportes',
}

export default function Topbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const title = Object.entries(routeLabels).find(([route]) => pathname.startsWith(route))?.[1] ?? 'Nido'

  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b border-[var(--border-default)] bg-[var(--bg-secondary)] px-4 md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
        >
          <Menu size={18} />
        </button>
        <h1 className="font-display text-lg text-[var(--text-primary)]">{title}</h1>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed left-0 top-0 z-50 h-full md:hidden"
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="relative h-full">
                <button
                  onClick={() => setOpen(false)}
                  className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--bg-card)] text-[var(--text-muted)]"
                >
                  <X size={14} />
                </button>
                <Sidebar onNavigate={() => setOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
