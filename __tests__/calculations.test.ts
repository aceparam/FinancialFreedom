import { describe, it, expect } from 'vitest'
import { projectPortfolio, getMilestonesWithStatus } from '@/lib/calculations'
import { Portfolio, Milestone } from '@/lib/types'

describe('Calculations - Reference Case', () => {
  const portfolio: Portfolio = {
    currentCorpus: 1000000,
    monthlySIP: 50000,
    expectedAnnualReturn: 0.12,
    defaultInflation: 0.06,
  }

  const today = new Date()
  const targetDate = new Date(today)
  targetDate.setFullYear(targetDate.getFullYear() + 5)

  const milestones: Milestone[] = [
    {
      id: '1',
      name: 'Car',
      targetDate: targetDate.toISOString().split('T')[0],
      currentCost: 1500000,
      category: 'Vehicle',
    },
  ]

  it('should calculate milestone required amount correctly', () => {
    const milestonesWithStatus = getMilestonesWithStatus(portfolio, milestones)
    const carMilestone = milestonesWithStatus[0]

    const expectedRequired = 1500000 * Math.pow(1 + 0.05, 5)

    expect(carMilestone.required).toBeCloseTo(expectedRequired, 1)
    expect(carMilestone.required).toBeCloseTo(1914422, 0)
  })

  it('should calculate portfolio projection at 5 years within threshold', () => {
    const projections = projectPortfolio(portfolio, milestones)

    const monthIndex = 60
    const projection = projections.find((p) => p.monthIndex === monthIndex)

    const r = portfolio.expectedAnnualReturn / 12
    const months = 60

    const fvCorpus = portfolio.currentCorpus * Math.pow(1 + r, months)
    const fvSIP =
      portfolio.monthlySIP *
      ((Math.pow(1 + r, months) - 1) / r) *
      (1 + r)
    const totalProjectedBeforeWithdrawal = fvCorpus + fvSIP

    const milestoneCost = 1500000 * Math.pow(1 + 0.05, 5)
    const expectedProjected = totalProjectedBeforeWithdrawal - milestoneCost

    if (projection) {
      expect(projection.portfolioValue).toBeCloseTo(expectedProjected, -2)
      expect(projection.portfolioValue).toBeGreaterThan(3900000)
      expect(projection.portfolioValue).toBeLessThan(4100000)
    }
  })

  it('should mark car milestone as on_track', () => {
    const milestonesWithStatus = getMilestonesWithStatus(portfolio, milestones)
    const carMilestone = milestonesWithStatus[0]

    expect(carMilestone.status).toBe('on_track')
    expect(carMilestone.projectedValue).toBeGreaterThan(
      carMilestone.required * 1.1
    )
  })

  it('should handle multiple milestones in order', () => {
    const multipeMilestones: Milestone[] = [
      {
        id: '1',
        name: 'Car',
        targetDate: new Date(new Date().getFullYear() + 3, 0, 1)
          .toISOString()
          .split('T')[0],
        currentCost: 1500000,
        category: 'Vehicle',
      },
      {
        id: '2',
        name: "Child's College",
        targetDate: new Date(new Date().getFullYear() + 8, 0, 1)
          .toISOString()
          .split('T')[0],
        currentCost: 2500000,
        category: 'Education',
      },
    ]

    const milestonesWithStatus = getMilestonesWithStatus(
      portfolio,
      multipeMilestones
    )

    expect(milestonesWithStatus).toHaveLength(2)
    expect(milestonesWithStatus[0].name).toBe('Car')
    expect(milestonesWithStatus[1].name).toBe("Child's College")
  })
})
