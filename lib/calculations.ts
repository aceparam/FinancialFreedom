import {
  Portfolio,
  Milestone,
  ProjectionPoint,
  MilestoneStatus,
  MilestoneWithStatus,
} from './types'
import { CATEGORY_DEFAULTS, MONTHS_TO_SHOW, CHART_RESOLUTION } from './config'

function getInflationRate(milestone: Milestone): number {
  if (milestone.inflationOverride !== undefined) {
    return milestone.inflationOverride
  }
  return CATEGORY_DEFAULTS[milestone.category]
}

function getMilestoneYears(targetDate: string): number {
  const today = new Date()
  const target = new Date(targetDate)

  const yearDiff = target.getFullYear() - today.getFullYear()
  const monthDiff = target.getMonth() - today.getMonth()
  const dayDiff = target.getDate() - today.getDate()

  let totalMonths = yearDiff * 12 + monthDiff

  if (dayDiff < 0) {
    totalMonths -= 1
  }

  return Math.max(0, totalMonths / 12)
}

function getMilestoneMonths(targetDate: string): number {
  const today = new Date()
  const target = new Date(targetDate)

  const yearDiff = target.getFullYear() - today.getFullYear()
  const monthDiff = target.getMonth() - today.getMonth()
  const dayDiff = target.getDate() - today.getDate()

  let totalMonths = yearDiff * 12 + monthDiff

  if (dayDiff < 0) {
    totalMonths -= 1
  }

  return Math.max(0, totalMonths)
}

export function projectPortfolio(
  portfolio: Portfolio,
  milestones: Milestone[],
  monthlyPlannedSIP?: number
): ProjectionPoint[] {
  const effectiveSIP = monthlyPlannedSIP ?? portfolio.monthlySIP
  const r = portfolio.expectedAnnualReturn
  const monthlyRate = r / 12

  const results: ProjectionPoint[] = []
  let corpusAtMonth = portfolio.currentCorpus

  const sortedMilestones = [...milestones].sort(
    (a, b) =>
      getMilestoneMonths(a.targetDate) - getMilestoneMonths(b.targetDate)
  )

  const milestonesByMonth = new Map<number, Milestone[]>()
  sortedMilestones.forEach((m) => {
    const month = Math.max(0, getMilestoneMonths(m.targetDate))
    if (!milestonesByMonth.has(month)) {
      milestonesByMonth.set(month, [])
    }
    milestonesByMonth.get(month)!.push(m)
  })

  for (let month = 0; month <= MONTHS_TO_SHOW; month++) {
    const years = month / 12

    const fvCorpus = portfolio.currentCorpus * Math.pow(1 + monthlyRate, month)
    const fvSIP =
      effectiveSIP *
      ((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate) *
      (1 + monthlyRate)

    corpusAtMonth = fvCorpus + fvSIP

    const milestonesThisMonth = milestonesByMonth.get(month) || []
    let pointMilestone: ProjectionPoint['milestone'] | undefined

    if (milestonesThisMonth.length > 0) {
      const m = milestonesThisMonth[0]
      const inflationRate = getInflationRate(m)
      const required = m.currentCost * Math.pow(1 + inflationRate, years)

      const status = getMilestoneStatus(corpusAtMonth, required)
      pointMilestone = {
        id: m.id,
        name: m.name,
        required,
        status,
      }

      corpusAtMonth -= required
      corpusAtMonth = Math.max(0, corpusAtMonth)
    }

    if (month % CHART_RESOLUTION === 0) {
      const date = new Date()
      date.setMonth(date.getMonth() + month)

      results.push({
        monthIndex: month,
        date: date.toISOString().split('T')[0],
        portfolioValue: corpusAtMonth,
        milestone: pointMilestone,
      })
    }
  }

  return results
}

export function getMilestoneStatus(
  projected: number,
  required: number
): MilestoneStatus {
  if (projected >= required * 1.1) {
    return 'on_track'
  } else if (projected >= required * 0.95) {
    return 'stretch'
  }
  return 'shortfall'
}

export function getMilestonesWithStatus(
  portfolio: Portfolio,
  milestones: Milestone[],
  monthlyPlannedSIP?: number
): MilestoneWithStatus[] {
  const effectiveSIP = monthlyPlannedSIP ?? portfolio.monthlySIP
  const r = portfolio.expectedAnnualReturn
  const monthlyRate = r / 12

  const results: MilestoneWithStatus[] = []
  let corpusAtMonth = portfolio.currentCorpus

  const sortedMilestones = [...milestones].sort(
    (a, b) =>
      getMilestoneMonths(a.targetDate) - getMilestoneMonths(b.targetDate)
  )

  for (const milestone of sortedMilestones) {
    const months = Math.max(0, getMilestoneMonths(milestone.targetDate))
    const years = months / 12

    const fvCorpus = portfolio.currentCorpus * Math.pow(1 + monthlyRate, months)
    const fvSIP =
      effectiveSIP *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate)

    const projectedValue = fvCorpus + fvSIP
    const inflationRate = getInflationRate(milestone)
    const required = milestone.currentCost * Math.pow(1 + inflationRate, years)

    const gap = projectedValue - required
    const status = getMilestoneStatus(projectedValue, required)

    results.push({
      ...milestone,
      required,
      projectedValue,
      gap,
      status,
    })

    corpusAtMonth = Math.max(0, projectedValue - required)
  }

  return results
}

export function getVerdictStatus(
  milestones: Milestone[],
  portfolio: Portfolio,
  monthlyPlannedSIP?: number
): 'on_track' | 'stretch' | 'shortfall' {
  if (milestones.length === 0) {
    return 'on_track'
  }

  const milestonesWithStatus = getMilestonesWithStatus(
    portfolio,
    milestones,
    monthlyPlannedSIP
  )

  const hasShortfall = milestonesWithStatus.some((m) => m.status === 'shortfall')
  const hasStretch = milestonesWithStatus.some((m) => m.status === 'stretch')

  if (hasShortfall) {
    return 'shortfall'
  } else if (hasStretch) {
    return 'stretch'
  }

  return 'on_track'
}
