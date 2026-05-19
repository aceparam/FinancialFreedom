'use client'

import { useStore } from '@/lib/store'
import { getVerdictStatus } from '@/lib/calculations'

export function VerdictHero() {
  const { portfolio, milestones, monthlyPlannedSIP } = useStore()

  const verdict = getVerdictStatus(milestones, portfolio, monthlyPlannedSIP)

  const verdictConfig = {
    on_track: {
      text: 'You are On Track',
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-950',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    stretch: {
      text: 'You are on a Stretch',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950',
      borderColor: 'border-amber-200 dark:border-amber-800',
    },
    shortfall: {
      text: 'You have a Shortfall',
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-950',
      borderColor: 'border-red-200 dark:border-red-800',
    },
  }

  const config = verdictConfig[verdict]

  return (
    <div
      className={`rounded-lg border ${config.borderColor} ${config.bg} p-8 text-center`}
    >
      <h1 className={`text-4xl font-bold ${config.color}`}>{config.text}</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {milestones.length === 0
          ? 'Add your first milestone to get started'
          : `Based on ${milestones.length} milestone${milestones.length !== 1 ? 's' : ''}`}
      </p>
    </div>
  )
}
