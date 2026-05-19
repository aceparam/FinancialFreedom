'use client'

import { useStore } from '@/lib/store'
import { formatINR } from '@/lib/currency'
import { useState } from 'react'

export function SIPSlider() {
  const { monthlyPlannedSIP, setMonthlyPlannedSIP } = useStore()
  const [localValue, setLocalValue] = useState(monthlyPlannedSIP)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    setLocalValue(value)
    setMonthlyPlannedSIP(value)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
              What-if Monthly SIP
            </label>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Adjust your monthly investment to see impact on milestones
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatINR(localValue, 'short')}
            </div>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="500000"
          step="5000"
          value={localValue}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />

        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>₹0</span>
          <span>₹2.5 L</span>
          <span>₹5 L</span>
        </div>
      </div>
    </div>
  )
}
