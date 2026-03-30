'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/stores/appStore'
import Button from '@/components/ui/Button'
import GoalCard from '@/components/goals/GoalCard'
import GoalModal from '@/components/goals/GoalModal'
import ContributionModal from '@/components/goals/ContributionModal'
import ProjectionCalculator from '@/components/goals/ProjectionCalculator'
import type { Goal, CurrencyCode } from '@/types'

export default function GoalsPage() {
  const supabase = createClient()
  const { familyId, primaryCurrency } = useAppStore()

  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [goalModalOpen, setGoalModalOpen] = useState(false)
  const [contribModalOpen, setContribModalOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [showCompleted, setShowCompleted] = useState(false)

  const fetchGoals = useCallback(async () => {
    if (!familyId) return
    setLoading(true)
    const { data } = await supabase
      .from('goals')
      .select('*')
      .eq('family_id', familyId)
      .order('created_at', { ascending: false })
    setGoals(data ?? [])
    setLoading(false)
  }, [familyId, supabase])

  useEffect(() => { fetchGoals() }, [fetchGoals])

  const activeGoals = goals.filter(g => g.status === 'active')
  const completedGoals = goals.filter(g => g.status === 'completed')

  function handleContribute(goal: Goal) {
    setSelectedGoal(goal)
    setContribModalOpen(true)
  }

  function handleEdit(goal: Goal) {
    setSelectedGoal(goal)
    setGoalModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-[var(--text-primary)]">Metas financieras</h1>
        <Button onClick={() => { setSelectedGoal(null); setGoalModalOpen(true) }} className="gap-2">
          <Plus size={16} /> Nueva meta
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          {/* Active goals */}
          {loading ? (
            <div className="py-20 text-center text-sm text-[var(--text-muted)]">Cargando...</div>
          ) : activeGoals.length === 0 ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[var(--radius-lg)] py-16 text-center">
              <p className="text-3xl mb-3">🎯</p>
              <p className="text-[var(--text-muted)] text-sm mb-4">Crea tu primera meta financiera</p>
              <Button onClick={() => setGoalModalOpen(true)}>Crear meta</Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {activeGoals.map(g => (
                <GoalCard key={g.id} goal={g} onContribute={handleContribute} onEdit={handleEdit} />
              ))}
            </div>
          )}

          {/* Completed goals */}
          {completedGoals.length > 0 && (
            <div>
              <button
                onClick={() => setShowCompleted(s => !s)}
                className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-3"
              >
                <ChevronDown size={14} className={showCompleted ? 'rotate-180 transition-transform' : 'transition-transform'} />
                Metas completadas ({completedGoals.length}) 🎉
              </button>
              {showCompleted && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {completedGoals.map(g => (
                    <GoalCard key={g.id} goal={g} onEdit={handleEdit} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Projection calculator */}
        <ProjectionCalculator currency={primaryCurrency as CurrencyCode} />
      </div>

      <GoalModal
        open={goalModalOpen}
        onOpenChange={setGoalModalOpen}
        familyId={familyId!}
        defaultCurrency={primaryCurrency as CurrencyCode}
        goal={selectedGoal ?? undefined}
        onSuccess={fetchGoals}
      />

      <ContributionModal
        open={contribModalOpen}
        onOpenChange={setContribModalOpen}
        goal={selectedGoal}
        onSuccess={fetchGoals}
      />
    </div>
  )
}
