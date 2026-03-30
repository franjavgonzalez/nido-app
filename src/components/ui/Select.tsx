'use client'

import * as RadixSelect from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
  icon?: string
}

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  className?: string
}

export default function Select({
  value,
  onValueChange,
  options,
  placeholder = 'Seleccionar...',
  label,
  error,
  disabled,
  className,
}: SelectProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-[var(--text-secondary)]">{label}</label>
      )}
      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <RadixSelect.Trigger
          className={cn(
            'flex h-10 w-full items-center justify-between gap-2 rounded-[var(--radius-md)] border bg-[var(--bg-secondary)] px-3 text-sm text-[var(--text-primary)] outline-none transition-colors',
            error
              ? 'border-[var(--red)]'
              : 'border-[var(--border-default)] hover:border-[var(--gold)/50] focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)/30]',
            disabled && 'opacity-50 cursor-not-allowed',
            !value && 'text-[var(--text-muted)]'
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown size={14} className="text-[var(--text-muted)]" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            className="z-50 min-w-[8rem] overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-card)] shadow-lg"
            position="popper"
            sideOffset={4}
          >
            <RadixSelect.Viewport className="p-1">
              {options.map(opt => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className="relative flex cursor-pointer select-none items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition-colors hover:bg-[var(--bg-card-hover)] data-[highlighted]:bg-[var(--bg-card-hover)] data-[state=checked]:text-[var(--gold)]"
                >
                  {opt.icon && <span>{opt.icon}</span>}
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="absolute right-2">
                    <Check size={12} />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {error && <p className="text-xs text-[var(--red)]">{error}</p>}
    </div>
  )
}
