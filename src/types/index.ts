export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CLP' | 'ARS' | 'MXN' | 'COP' | 'BRL' | 'PEN'

export type TransactionType = 'income' | 'expense' | 'savings' | 'investment' | 'transfer'

export type FamilyPlan = 'free' | 'pro' | 'enterprise'

export type MemberRole = 'owner' | 'admin' | 'member' | 'viewer'

export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled'

export type CategoryType = 'income' | 'expense' | 'savings' | 'investment'

export interface Family {
  id: string
  name: string
  slug: string
  plan: FamilyPlan
  primary_currency: CurrencyCode
  created_at: string
}

export interface FamilyMember {
  id: string
  family_id: string
  user_id: string
  role: MemberRole
  display_name: string | null
  avatar_url: string | null
  joined_at: string
}

export interface Category {
  id: string
  family_id: string
  name: string
  type: CategoryType
  icon: string | null
  color: string | null
  is_default: boolean
  created_at: string
}

export interface Transaction {
  id: string
  family_id: string
  member_id: string | null
  category_id: string | null
  type: TransactionType
  amount: number
  currency: CurrencyCode
  amount_usd: number | null
  description: string | null
  date: string
  tags: string[] | null
  notes: string | null
  created_at: string
  updated_at: string
  category?: Category
  member?: FamilyMember
}

export interface Budget {
  id: string
  family_id: string
  category_id: string
  amount: number
  currency: CurrencyCode
  period_month: number
  period_year: number
  created_at: string
  category?: Category
}

export interface Goal {
  id: string
  family_id: string
  name: string
  description: string | null
  target_amount: number
  current_amount: number
  currency: CurrencyCode
  target_date: string | null
  icon: string | null
  color: string | null
  status: GoalStatus
  created_at: string
}

export interface GoalContribution {
  id: string
  goal_id: string
  amount: number
  note: string | null
  date: string
  created_at: string
}

export interface MonthlyStats {
  month: number
  year: number
  total_income: number
  total_expenses: number
  total_savings: number
  net: number
}

export interface BudgetWithSpent extends Budget {
  spent: number
  percentage: number
}
