'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { DEFAULT_PORTFOLIO, DEFAULT_MILESTONES } from '@/lib/config'
import { Portfolio } from '@/lib/types'
import { formatINR, parseINRInput } from '@/lib/currency'

export function OnboardingFlow() {
  const { portfolio, setPortfolio, setMilestones, setOnboardingComplete } =
    useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<Portfolio>(DEFAULT_PORTFOLIO)

  useEffect(() => {
    setFormData(portfolio)
  }, [portfolio])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPortfolio(formData)
    setMilestones(DEFAULT_MILESTONES)
    setOnboardingComplete(true)
    setIsOpen(false)
  }

  const handleInputChange = (
    field: keyof Portfolio,
    value: string | number
  ) => {
    const parsed = typeof value === 'string' ? parseINRInput(value) : value
    setFormData((prev) => ({
      ...prev,
      [field]: parsed,
    }))
  }

  const handlePercentChange = (
    field: 'expectedAnnualReturn' | 'defaultInflation',
    value: string
  ) => {
    const percent = parseFloat(value) || 0
    setFormData((prev) => ({
      ...prev,
      [field]: percent / 100,
    }))
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition"
      >
        Edit Portfolio
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Your Portfolio
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Corpus (₹)
                </label>
                <input
                  type="text"
                  value={formatINR(formData.currentCorpus, 'full')}
                  onChange={(e) =>
                    handleInputChange('currentCorpus', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Monthly SIP (₹)
                </label>
                <input
                  type="text"
                  value={formatINR(formData.monthlySIP, 'full')}
                  onChange={(e) => handleInputChange('monthlySIP', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expected Annual Return (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={(formData.expectedAnnualReturn * 100).toFixed(1)}
                  onChange={(e) =>
                    handlePercentChange('expectedAnnualReturn', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Default Inflation Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={(formData.defaultInflation * 100).toFixed(1)}
                  onChange={(e) =>
                    handlePercentChange('defaultInflation', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                >
                  Save & Continue
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
