import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CurrencyCode } from '@/types'

interface AppState {
  familyId: string | null
  familyName: string | null
  primaryCurrency: CurrencyCode
  currentMonth: number
  currentYear: number
  setFamily: (id: string, name: string, currency: CurrencyCode) => void
  setCurrentPeriod: (month: number, year: number) => void
  clearFamily: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      familyId: null,
      familyName: null,
      primaryCurrency: 'USD',
      currentMonth: new Date().getMonth() + 1,
      currentYear: new Date().getFullYear(),
      setFamily: (id, name, currency) =>
        set({ familyId: id, familyName: name, primaryCurrency: currency }),
      setCurrentPeriod: (month, year) =>
        set({ currentMonth: month, currentYear: year }),
      clearFamily: () =>
        set({ familyId: null, familyName: null, primaryCurrency: 'USD' }),
    }),
    { name: 'nido-app-store' }
  )
)
