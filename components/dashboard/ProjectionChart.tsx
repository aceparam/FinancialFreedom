'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from 'recharts'
import { useStore } from '@/lib/store'
import { projectPortfolio } from '@/lib/calculations'
import { formatINR } from '@/lib/currency'
import { useMemo } from 'react'

export function ProjectionChart() {
  const { portfolio, milestones, monthlyPlannedSIP } = useStore()

  const data = useMemo(() => {
    return projectPortfolio(portfolio, milestones, monthlyPlannedSIP)
  }, [portfolio, milestones, monthlyPlannedSIP])

  const milestonesWithData = useMemo(() => {
    return data.filter((point) => point.milestone)
  }, [data])

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Loading projection...
        </p>
      </div>
    )
  }

  return (
    <div className="w-full h-96 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            interval={Math.floor(data.length / 6)}
          />
          <YAxis
            tickFormatter={(value) => formatINR(value, 'short')}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => formatINR(value as number, 'full')}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="portfolioValue"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorValue)"
            name="Portfolio Value"
          />
          {milestonesWithData.map((milestone) => (
            <ReferenceLine
              key={milestone.milestone?.id}
              x={milestone.date}
              stroke="#6366f1"
              strokeDasharray="5 5"
            >
              <Label
                value={milestone.milestone?.name}
                position="top"
                fill="#6366f1"
                fontSize={12}
              />
            </ReferenceLine>
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
