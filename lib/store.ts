import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Portfolio, Milestone } from './types'
import { DEFAULT_PORTFOLIO, DEFAULT_MILESTONES } from './config'

interface AppStore {
  portfolio: Portfolio
  milestones: Milestone[]
  onboardingComplete: boolean
  monthlyPlannedSIP: number

  setPortfolio: (portfolio: Portfolio) => void
  setMilestones: (milestones: Milestone[]) => void
  addMilestone: (milestone: Milestone) => void
  updateMilestone: (id: string, milestone: Milestone) => void
  deleteMilestone: (id: string) => void
  setOnboardingComplete: (complete: boolean) => void
  setMonthlyPlannedSIP: (sip: number) => void
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      portfolio: DEFAULT_PORTFOLIO,
      milestones: DEFAULT_MILESTONES,
      onboardingComplete: false,
      monthlyPlannedSIP: DEFAULT_PORTFOLIO.monthlySIP,

      setPortfolio: (portfolio) => set({ portfolio }),

      setMilestones: (milestones) => set({ milestones }),

      addMilestone: (milestone) =>
        set((state) => ({
          milestones: [...state.milestones, milestone],
        })),

      updateMilestone: (id, milestone) =>
        set((state) => ({
          milestones: state.milestones.map((m) => (m.id === id ? milestone : m)),
        })),

      deleteMilestone: (id) =>
        set((state) => ({
          milestones: state.milestones.filter((m) => m.id !== id),
        })),

      setOnboardingComplete: (complete) =>
        set({ onboardingComplete: complete }),

      setMonthlyPlannedSIP: (sip) =>
        set({ monthlyPlannedSIP: sip }),
    }),
    {
      name: 'capex-compass-store',
    }
  )
)
