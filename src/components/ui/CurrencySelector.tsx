'use client'

import { CURRENCIES } from '@/lib/currencies'
import Select from './Select'
import type { CurrencyCode } from '@/types'

interface CurrencySelectorProps {
  value?: CurrencyCode
  onValueChange?: (value: CurrencyCode) => void
  label?: string
  error?: string
  className?: string
}

export default function CurrencySelector({
  value,
  onValueChange,
  label,
  error,
  className,
}: CurrencySelectorProps) {
  const options = CURRENCIES.map(c => ({
    value: c.code,
    label: `${c.flag} ${c.code} — ${c.name}`,
    icon: undefined,
  }))

  return (
    <Select
      value={value}
      onValueChange={v => onValueChange?.(v as CurrencyCode)}
      options={options}
      label={label}
      error={error}
      placeholder="Seleccionar divisa..."
      className={className}
    />
  )
}
