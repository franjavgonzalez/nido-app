import type { CurrencyCode } from '@/types'

export interface Currency {
  code: CurrencyCode
  name: string
  symbol: string
  flag: string
  locale: string
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'Dólar estadounidense', symbol: '$', flag: '🇺🇸', locale: 'en-US' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', locale: 'de-DE' },
  { code: 'GBP', name: 'Libra esterlina', symbol: '£', flag: '🇬🇧', locale: 'en-GB' },
  { code: 'CLP', name: 'Peso chileno', symbol: '$', flag: '🇨🇱', locale: 'es-CL' },
  { code: 'ARS', name: 'Peso argentino', symbol: '$', flag: '🇦🇷', locale: 'es-AR' },
  { code: 'MXN', name: 'Peso mexicano', symbol: '$', flag: '🇲🇽', locale: 'es-MX' },
  { code: 'COP', name: 'Peso colombiano', symbol: '$', flag: '🇨🇴', locale: 'es-CO' },
  { code: 'BRL', name: 'Real brasileño', symbol: 'R$', flag: '🇧🇷', locale: 'pt-BR' },
  { code: 'PEN', name: 'Sol peruano', symbol: 'S/', flag: '🇵🇪', locale: 'es-PE' },
]

export function getCurrency(code: CurrencyCode): Currency {
  return CURRENCIES.find(c => c.code === code) ?? CURRENCIES[0]
}
