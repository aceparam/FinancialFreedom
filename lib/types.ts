export type Category =
  | 'Education'
  | 'Healthcare'
  | 'Housing'
  | 'Vehicle'
  | 'General'
  | 'Travel'
  | 'Wedding'

export type MilestoneStatus = 'on_track' | 'stretch' | 'shortfall'

export interface Portfolio {
  currentCorpus: number
  monthlySIP: number
  expectedAnnualReturn: number
  defaultInflation: number
}

export interface Milestone {
  id: string
  name: string
  targetDate: string
  currentCost: number
  category: Category
  inflationOverride?: number
}

export interface ProjectionPoint {
  monthIndex: number
  date: string
  portfolioValue: number
  milestone?: {
    id: string
    name: string
    required: number
    status: MilestoneStatus
  }
}

export interface MilestoneWithStatus extends Milestone {
  required: number
  projectedValue: number
  gap: number
  status: MilestoneStatus
}
