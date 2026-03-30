'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, ArrowLeftRight, PieChart, Target, FileText, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores/appStore'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transacciones', icon: ArrowLeftRight },
  { href: '/budget', label: 'Presupuesto', icon: PieChart },
  { href: '/goals', label: 'Metas', icon: Target },
  { href: '/reports', label: 'Reportes', icon: FileText },
]

interface SidebarProps {
  onNavigate?: () => void
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { familyName, clearFamily } = useAppStore()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    clearFamily()
    router.push('/login')
  }

  return (
    <div className="flex h-full w-60 shrink-0 flex-col border-r border-[var(--border-default)] bg-[var(--bg-secondary)]">
      {/* Logo */}
      <div className="border-b border-[var(--border-default)] px-5 py-5">
        <p className="font-display text-xl font-semibold text-[var(--gold)]">🏠 Nido</p>
        {familyName && (
          <p className="mt-0.5 text-xs text-[var(--text-muted)] truncate">{familyName}</p>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm transition-colors',
                active
                  ? 'border-l-[3px] border-[var(--gold)] bg-[var(--bg-card)] pl-[calc(0.75rem-3px)] text-[var(--gold)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]'
              )}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-[var(--border-default)] px-4 py-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card)] hover:text-[var(--red)]"
        >
          <LogOut size={16} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  )
}
