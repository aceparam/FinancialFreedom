// ===== RETIREMENT PLANNING DATA MODEL =====

export interface PersonalInfo {
  name: string
  currentAge: number
  retirementAge: number
  lifeExpectancy: number
  dependents: number
}

export interface Assets {
  savingsAccount: number
  investments: number
  realEstate: number
  gold: number
  otherAssets: number
  totalAssets?: number
}

export interface Liabilities {
  mortgage: number
  autoLoan: number
  personalLoans: number
  creditCardDebt: number
  otherDebts: number
  totalLiabilities?: number
}

export interface Expenses {
  monthlyCurrentExpense: number
  expectedRetirementMonthlyExpense: number
  majorUpcomingExpenses: MajorExpense[]
}

export interface MajorExpense {
  id: string
  name: string
  estimatedCost: number
  yearsUntilExpense: number
  category: 'education' | 'wedding' | 'medical' | 'other'
}

export interface Income {
  monthlySalary: number
  annualBonus: number
  passiveIncomeMonthly: number
  spouseIncome: number
  expectedRetirementIncome: number
}

export interface FinancialProfile {
  id: string
  personalInfo: PersonalInfo
  assets: Assets
  liabilities: Liabilities
  expenses: Expenses
  income: Income
  investmentReturns: number // annual percentage
  inflation: number // annual percentage
  createdAt: string
  updatedAt: string
}

export interface RetirementAnalysis {
  currentNetWorth: number
  monthlyNetIncome: number
  monthlyRetirementExpense: number
  annualRetirementExpense: number
  totalRetirementCorpusNeeded: number
  yearsUntilRetirement: number
  projectedCorpusAtRetirement: number
  retirementReadiness: 'ready' | 'on_track' | 'needs_work' | 'not_ready'
  retirementGap: number
  yearsCanRetire: number
  recommendations: string[]
}
