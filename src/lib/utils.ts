import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, addMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import type { CurrencyCode } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'USD',
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount)
}

export function formatDate(date: string | Date, pattern = 'dd MMM yyyy'): string {
  return format(new Date(date), pattern, { locale: es })
}

export function formatRelativeDate(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es })
}

export function getMonthName(month: number, year?: number): string {
  const date = new Date(year ?? new Date().getFullYear(), month - 1, 1)
  return format(date, 'MMMM yyyy', { locale: es })
}

export function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0
  return Math.min(Math.round((current / target) * 100), 100)
}

export function calculateProjectedDate(
  current: number,
  target: number,
  monthlyContribution: number
): Date | null {
  if (monthlyContribution <= 0) return null
  const remaining = target - current
  if (remaining <= 0) return new Date()
  const monthsNeeded = Math.ceil(remaining / monthlyContribution)
  return addMonths(new Date(), monthsNeeded)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function getDeltaColor(value: number): string {
  if (value > 0) return 'var(--green)'
  if (value < 0) return 'var(--red)'
  return 'var(--text-muted)'
}

export function getDeltaSymbol(value: number): string {
  if (value > 0) return '↑'
  if (value < 0) return '↓'
  return '→'
}
