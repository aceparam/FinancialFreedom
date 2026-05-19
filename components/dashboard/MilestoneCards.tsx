'use client'

import { useStore } from '@/lib/store'
import { getMilestonesWithStatus } from '@/lib/calculations'
import { formatINR } from '@/lib/currency'
import { useMemo } from 'react'

export function MilestoneCards() {
  const { portfolio, milestones, monthlyPlannedSIP } = useStore()

  const milestonesWithStatus = useMemo(() => {
    return getMilestonesWithStatus(portfolio, milestones, monthlyPlannedSIP)
  }, [portfolio, milestones, monthlyPlannedSIP])

  const statusConfig = {
    on_track: {
      label: 'On Track',
      color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      border: 'border-green-200 dark:border-green-800',
    },
    stretch: {
      label: 'Stretch',
      color: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200',
      border: 'border-amber-200 dark:border-amber-800',
    },
    shortfall: {
      label: 'Shortfall',
      color: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
      border: 'border-red-200 dark:border-red-800',
    },
  }

  if (milestonesWithStatus.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {milestonesWithStatus.map((milestone) => {
        const config = statusConfig[milestone.status]
        return (
          <div
            key={milestone.id}
            className={`rounded-lg border ${config.border} bg-white dark:bg-gray-900 p-4`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {milestone.name}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                {config.label}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Required:</span>
                <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                  {formatINR(milestone.required, 'short')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Projected:</span>
                <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                  {formatINR(milestone.projectedValue, 'short')}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Gap:</span>
                <span
                  className={`font-mono font-semibold ${
                    milestone.gap >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {milestone.gap >= 0 ? '+' : ''}
                  {formatINR(milestone.gap, 'short')}
                </span>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              {new Date(milestone.targetDate).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
