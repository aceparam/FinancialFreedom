import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FinancialProfile, RetirementAnalysis } from './types'
import { generateId } from './uuid'

interface AppStore {
  profile: FinancialProfile | null
  analysis: RetirementAnalysis | null
  onboardingStep: number // 0 = personal info, 1 = assets, 2 = liabilities, 3 = expenses, 4 = income, 5 = summary

  setProfile: (profile: FinancialProfile) => void
  updateProfile: (partial: Partial<FinancialProfile>) => void
  setAnalysis: (analysis: RetirementAnalysis) => void
  setOnboardingStep: (step: number) => void
  reset: () => void
}

const DEFAULT_PROFILE: FinancialProfile = {
  id: generateId(),
  personalInfo: {
    name: '',
    currentAge: 35,
    retirementAge: 60,
    lifeExpectancy: 85,
    dependents: 0,
  },
  assets: {
    savingsAccount: 0,
    investments: 0,
    realEstate: 0,
    gold: 0,
    otherAssets: 0,
  },
  liabilities: {
    mortgage: 0,
    autoLoan: 0,
    personalLoans: 0,
    creditCardDebt: 0,
    otherDebts: 0,
  },
  expenses: {
    monthlyCurrentExpense: 0,
    expectedRetirementMonthlyExpense: 0,
    majorUpcomingExpenses: [],
  },
  income: {
    monthlySalary: 0,
    annualBonus: 0,
    passiveIncomeMonthly: 0,
    spouseIncome: 0,
    expectedRetirementIncome: 0,
  },
  investmentReturns: 0.12, // 12% annual
  inflation: 0.06, // 6% annual
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      profile: null,
      analysis: null,
      onboardingStep: 0,

      setProfile: (profile) =>
        set({
          profile: {
            ...profile,
            updatedAt: new Date().toISOString(),
          },
        }),

      updateProfile: (partial) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                ...partial,
                updatedAt: new Date().toISOString(),
              }
            : { ...DEFAULT_PROFILE, ...partial },
        })),

      setAnalysis: (analysis) => set({ analysis }),

      setOnboardingStep: (step) => set({ onboardingStep: step }),

      reset: () => set({ profile: null, analysis: null, onboardingStep: 0 }),
    }),
    {
      name: 'retirement-planner-store',
    }
  )
)
