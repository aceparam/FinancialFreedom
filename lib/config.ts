import { Category } from './types'

export const CATEGORY_DEFAULTS: Record<Category, number> = {
  Education: 0.1,
  Healthcare: 0.08,
  Housing: 0.07,
  Vehicle: 0.05,
  General: 0.06,
  Travel: 0.06,
  Wedding: 0.08,
}

export const FEEDBACK_FORM_URL = 'https://forms.gle/your-feedback-form-url'

export const DEFAULT_PORTFOLIO = {
  currentCorpus: 1000000,
  monthlySIP: 50000,
  expectedAnnualReturn: 0.12,
  defaultInflation: 0.06,
}

const defaultMilestoneDate: string =
  new Date(new Date().getFullYear() + 18, 5, 1)
    .toISOString()
    .split('T')[0] || ''

export const DEFAULT_MILESTONES = [
  {
    id: '1',
    name: "Child's College",
    targetDate: defaultMilestoneDate,
    currentCost: 2500000,
    category: 'Education' as const,
  },
]

export const MONTHS_TO_SHOW = 60
export const CHART_RESOLUTION = 3
