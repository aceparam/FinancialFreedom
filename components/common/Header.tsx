'use client'

import { useTheme } from 'next-themes'
import { useStore } from '@/lib/store'
import { FEEDBACK_FORM_URL } from '@/lib/config'
import { useState } from 'react'

export function Header() {
  const { theme, setTheme } = useTheme()
  const { portfolio, milestones } = useStore()
  const [showExportMessage, setShowExportMessage] = useState(false)

  const handleExportJSON = () => {
    const data = {
      portfolio,
      milestones,
      exportedAt: new Date().toISOString(),
    }

    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `capex-compass-scenario-${new Date().getTime()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setShowExportMessage(true)
    setTimeout(() => setShowExportMessage(false), 2000)
  }

  const handleFeedback = () => {
    if (FEEDBACK_FORM_URL && FEEDBACK_FORM_URL !== 'https://forms.gle/your-feedback-form-url') {
      window.open(FEEDBACK_FORM_URL, '_blank')
    } else {
      alert('Feedback form URL not configured yet')
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          🧭 Capex Compass
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800 transition"
          >
            Export JSON
          </button>

          <button
            onClick={handleFeedback}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            Feedback
          </button>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>

      {showExportMessage && (
        <div className="border-t border-gray-200 dark:border-gray-800 bg-green-50 dark:bg-green-900 px-4 py-2 text-sm text-green-800 dark:text-green-100">
          ✓ Scenario exported successfully!
        </div>
      )}
    </header>
  )
}
