'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'

export default function Home() {
  const { profile, analysis, onboardingStep } = useStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950">
      {onboardingStep >= 0 && <OnboardingFlow />}

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            🎯 Retirement Readiness Calculator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Plan your retirement with confidence. Answer a few questions about your finances.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {!profile ? (
          // Empty state - Start planning
          <div className="text-center py-16">
            <div className="text-6xl mb-6">💰</div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Let's Plan Your Retirement
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Answer detailed questions about your current situation, assets, liabilities, expenses, and goals.
              We'll analyze if you're ready for retirement and provide personalized recommendations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">Complete Picture</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Assets, liabilities, expenses, and income
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">Clear Verdict</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Are you ready to retire? When can you?
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="text-4xl mb-3">💡</div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">Recommendations</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Personalized action plan
                </p>
              </div>
            </div>

            <button
              onClick={() => useStore.setState({ onboardingStep: 0 })}
              className="px-8 py-4 text-lg font-bold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition transform hover:scale-105"
            >
              Start Your Retirement Assessment →
            </button>
          </div>
        ) : (
          // After completion - Show results
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Retirement Readiness Analysis
            </h2>

            {analysis ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Readiness Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-6">
                    <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 uppercase">
                      Retirement Readiness
                    </h3>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-300 mt-2">
                      {analysis.retirementReadiness.toUpperCase()}
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mt-4">
                      You are {analysis.retirementReadiness === 'ready'
                        ? 'well-prepared'
                        : analysis.retirementReadiness === 'on_track'
                          ? 'on track'
                          : 'working towards'}{' '}
                      your retirement goals
                    </p>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Current Net Worth</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        ₹{analysis.currentNetWorth.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Savings</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        ₹{analysis.monthlyNetIncome.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Retirement Timeline */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Retirement Timeline</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Years Until Planned Retirement</p>
                      <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-300">
                        {analysis.yearsUntilRetirement}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Corpus Needed</p>
                      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                        ₹{(analysis.totalRetirementCorpusNeeded / 10000000).toFixed(1)}Cr
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Projected Corpus</p>
                      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                        ₹{(analysis.projectedCorpusAtRetirement / 10000000).toFixed(1)}Cr
                      </p>
                    </div>
                  </div>
                </div>

                {/* Gap Analysis */}
                {analysis.retirementGap !== 0 && (
                  <div className={`rounded-lg p-6 ${analysis.retirementGap > 0 ? 'bg-red-50 dark:bg-red-900' : 'bg-green-50 dark:bg-green-900'}`}>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {analysis.retirementGap > 0 ? 'Retirement Gap' : 'Retirement Surplus'}
                    </h3>
                    <p className={`text-3xl font-bold ${analysis.retirementGap > 0 ? 'text-red-600 dark:text-red-300' : 'text-green-600 dark:text-green-300'}`}>
                      {analysis.retirementGap > 0 ? '+' : '-'}₹{Math.abs(analysis.retirementGap).toLocaleString('en-IN')}
                    </p>
                  </div>
                )}

                {/* Recommendations */}
                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Recommendations</h3>
                  <ul className="space-y-3">
                    {analysis.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-gray-700 dark:text-gray-300 flex gap-3">
                        <span className="text-blue-600 dark:text-blue-300 font-bold">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => useStore.setState({ profile: null, analysis: null })}
                  className="w-full px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Start Over
                </button>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">Loading analysis...</p>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Retirement Readiness Calculator • Data saved locally • No account required</p>
        </div>
      </footer>
    </div>
  )
}
