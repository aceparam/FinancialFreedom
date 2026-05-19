'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { FinancialProfile } from '@/lib/types'
import { analyzeRetirementReadiness } from '@/lib/retirement-calculator'
import { generateId } from '@/lib/uuid'

const STEP_TITLES = [
  'Personal Information',
  'Assets',
  'Liabilities',
  'Expenses',
  'Income',
  'Review & Analyze',
]

export function OnboardingFlow() {
  const { profile, onboardingStep, setProfile, setAnalysis, updateProfile, setOnboardingStep } = useStore()
  const [formData, setFormData] = useState<FinancialProfile | null>(null)

  useEffect(() => {
    if (profile) {
      setFormData(profile)
    } else {
      setFormData({
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
        investmentReturns: 0.12,
        inflation: 0.06,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
  }, [profile])

  const handleInputChange = (path: string, value: string | number) => {
    if (!formData) return
    const keys = path.split('.')
    const newData = { ...formData }
    let current: any = newData
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]!
      current = current[key]
    }
    const lastKey = keys[keys.length - 1]!
    current[lastKey] = value
    setFormData(newData)
  }

  const handleNext = () => {
    if (formData && onboardingStep < 5) {
      updateProfile(formData)
      setOnboardingStep(onboardingStep + 1)
    }
  }

  const handlePrev = () => {
    if (onboardingStep > 0) {
      setOnboardingStep(onboardingStep - 1)
    }
  }

  const handleSubmit = () => {
    if (formData) {
      setProfile(formData)
      const analysis = analyzeRetirementReadiness(formData)
      setAnalysis(analysis)
      setOnboardingStep(-1)
    }
  }

  if (onboardingStep < 0 || !formData) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {STEP_TITLES[onboardingStep]}
          </h2>
          <div className="flex gap-1">
            {STEP_TITLES.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full ${
                  idx <= onboardingStep ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {onboardingStep === 0 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.name}
                  onChange={(e) => handleInputChange('personalInfo.name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Age
                  </label>
                  <input
                    type="number"
                    value={formData.personalInfo.currentAge}
                    onChange={(e) => handleInputChange('personalInfo.currentAge', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Retirement Age
                  </label>
                  <input
                    type="number"
                    value={formData.personalInfo.retirementAge}
                    onChange={(e) => handleInputChange('personalInfo.retirementAge', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Life Expectancy
                  </label>
                  <input
                    type="number"
                    value={formData.personalInfo.lifeExpectancy}
                    onChange={(e) => handleInputChange('personalInfo.lifeExpectancy', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dependents
                  </label>
                  <input
                    type="number"
                    value={formData.personalInfo.dependents}
                    onChange={(e) => handleInputChange('personalInfo.dependents', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </>
          )}

          {onboardingStep === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Savings Account (₹)
                </label>
                <input
                  type="number"
                  value={formData.assets.savingsAccount}
                  onChange={(e) => handleInputChange('assets.savingsAccount', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Investments (₹)
                </label>
                <input
                  type="number"
                  value={formData.assets.investments}
                  onChange={(e) => handleInputChange('assets.investments', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Real Estate (₹)
                </label>
                <input
                  type="number"
                  value={formData.assets.realEstate}
                  onChange={(e) => handleInputChange('assets.realEstate', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gold (₹)
                </label>
                <input
                  type="number"
                  value={formData.assets.gold}
                  onChange={(e) => handleInputChange('assets.gold', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Other Assets (₹)
                </label>
                <input
                  type="number"
                  value={formData.assets.otherAssets}
                  onChange={(e) => handleInputChange('assets.otherAssets', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </>
          )}

          {onboardingStep === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mortgage (₹)
                </label>
                <input
                  type="number"
                  value={formData.liabilities.mortgage}
                  onChange={(e) => handleInputChange('liabilities.mortgage', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Auto Loan (₹)
                </label>
                <input
                  type="number"
                  value={formData.liabilities.autoLoan}
                  onChange={(e) => handleInputChange('liabilities.autoLoan', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Personal Loans (₹)
                </label>
                <input
                  type="number"
                  value={formData.liabilities.personalLoans}
                  onChange={(e) => handleInputChange('liabilities.personalLoans', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Credit Card Debt (₹)
                </label>
                <input
                  type="number"
                  value={formData.liabilities.creditCardDebt}
                  onChange={(e) => handleInputChange('liabilities.creditCardDebt', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Other Debts (₹)
                </label>
                <input
                  type="number"
                  value={formData.liabilities.otherDebts}
                  onChange={(e) => handleInputChange('liabilities.otherDebts', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </>
          )}

          {onboardingStep === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Monthly Current Expense (₹)
                </label>
                <input
                  type="number"
                  value={formData.expenses.monthlyCurrentExpense}
                  onChange={(e) => handleInputChange('expenses.monthlyCurrentExpense', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expected Retirement Monthly Expense (₹)
                </label>
                <input
                  type="number"
                  value={formData.expenses.expectedRetirementMonthlyExpense}
                  onChange={(e) => handleInputChange('expenses.expectedRetirementMonthlyExpense', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Leave blank to use 80% of current expense</p>
              </div>
            </>
          )}

          {onboardingStep === 4 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Monthly Salary (₹)
                </label>
                <input
                  type="number"
                  value={formData.income.monthlySalary}
                  onChange={(e) => handleInputChange('income.monthlySalary', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Annual Bonus (₹)
                </label>
                <input
                  type="number"
                  value={formData.income.annualBonus}
                  onChange={(e) => handleInputChange('income.annualBonus', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Passive Income Monthly (₹)
                </label>
                <input
                  type="number"
                  value={formData.income.passiveIncomeMonthly}
                  onChange={(e) => handleInputChange('income.passiveIncomeMonthly', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Spouse Income (₹)
                </label>
                <input
                  type="number"
                  value={formData.income.spouseIncome}
                  onChange={(e) => handleInputChange('income.spouseIncome', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expected Retirement Income (₹)
                </label>
                <input
                  type="number"
                  value={formData.income.expectedRetirementIncome}
                  onChange={(e) => handleInputChange('income.expectedRetirementIncome', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pension, annuity, etc.</p>
              </div>
            </>
          )}

          {onboardingStep === 5 && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Review Your Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Name</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formData.personalInfo.name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Current Age</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formData.personalInfo.currentAge}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Retirement Age</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formData.personalInfo.retirementAge}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Total Assets</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      ₹{(formData.assets.savingsAccount + formData.assets.investments + formData.assets.realEstate + formData.assets.gold + formData.assets.otherAssets).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Total Liabilities</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      ₹{(formData.liabilities.mortgage + formData.liabilities.autoLoan + formData.liabilities.personalLoans + formData.liabilities.creditCardDebt + formData.liabilities.otherDebts).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Monthly Expenses</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">₹{formData.expenses.monthlyCurrentExpense.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click "Analyze" to get your retirement readiness assessment.
              </p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex gap-3">
          <button
            onClick={handlePrev}
            disabled={onboardingStep === 0}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Back
          </button>
          {onboardingStep < 5 ? (
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition"
            >
              Analyze My Retirement
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
