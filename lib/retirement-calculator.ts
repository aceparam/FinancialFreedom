import {
  FinancialProfile,
  RetirementAnalysis,
  Assets,
  Liabilities,
} from './types'

export function calculateNetWorth(
  assets: Assets,
  liabilities: Liabilities
): number {
  const totalAssets =
    (assets.savingsAccount || 0) +
    (assets.investments || 0) +
    (assets.realEstate || 0) +
    (assets.gold || 0) +
    (assets.otherAssets || 0)

  const totalLiabilities =
    (liabilities.mortgage || 0) +
    (liabilities.autoLoan || 0) +
    (liabilities.personalLoans || 0) +
    (liabilities.creditCardDebt || 0) +
    (liabilities.otherDebts || 0)

  return totalAssets - totalLiabilities
}

export function calculateMonthlyNetIncome(
  monthlySalary: number,
  annualBonus: number,
  passiveIncomeMonthly: number,
  spouseIncome: number,
  monthlyExpense: number
): number {
  const totalMonthlyIncome =
    monthlySalary +
    passiveIncomeMonthly +
    spouseIncome +
    annualBonus / 12

  return totalMonthlyIncome - monthlyExpense
}

// Present Value at retirement of a stream of monthly payments that grow
// with inflation, assuming the remaining corpus continues to earn returns.
// Uses the Present Value of a Growing Annuity formula:
//   PV = PMT × (1 - ((1+g)/(1+r))^n) / (r - g)
export function presentValueOfRetirementStream(
  firstMonthlyPaymentAtRetirement: number,
  annualInflation: number,
  annualReturn: number,
  yearsInRetirement: number
): number {
  const months = yearsInRetirement * 12
  if (months <= 0 || firstMonthlyPaymentAtRetirement <= 0) return 0

  const g = annualInflation / 12
  const r = annualReturn / 12

  if (Math.abs(r - g) < 1e-9) {
    return firstMonthlyPaymentAtRetirement * months
  }

  const ratio = (1 + g) / (1 + r)
  return (
    (firstMonthlyPaymentAtRetirement * (1 - Math.pow(ratio, months))) /
    (r - g)
  )
}

export function calculateRetirementCorpus(
  monthlyExpenseToday: number,
  inflation: number,
  postRetirementReturn: number,
  yearsUntilRetirement: number,
  yearsInRetirement: number
): number {
  // Inflate today's monthly expense to the value it will be at retirement age
  const monthlyExpenseAtRetirement =
    monthlyExpenseToday * Math.pow(1 + inflation, yearsUntilRetirement)

  // Compute corpus needed at retirement, assuming it continues to earn returns
  return presentValueOfRetirementStream(
    monthlyExpenseAtRetirement,
    inflation,
    postRetirementReturn,
    yearsInRetirement
  )
}

export function calculateProjectedCorpusAtRetirement(
  currentNetWorth: number,
  monthlyNetSavings: number,
  annualReturn: number,
  yearsUntilRetirement: number,
  majorExpenses: { cost: number; yearsUntil: number }[]
): number {
  const monthlyReturn = annualReturn / 12
  const months = yearsUntilRetirement * 12

  let corpus = currentNetWorth

  // Add monthly savings with returns
  for (let month = 1; month <= months; month++) {
    // Apply returns to current corpus
    corpus *= 1 + monthlyReturn

    // Add monthly savings
    corpus += monthlyNetSavings

    // Subtract major expenses when they occur
    majorExpenses.forEach((exp) => {
      if (month === Math.floor(exp.yearsUntil * 12)) {
        corpus -= exp.cost
      }
    })
  }

  return Math.max(0, corpus)
}

export function analyzeRetirementReadiness(
  profile: FinancialProfile
): RetirementAnalysis {
  const { personalInfo, assets, liabilities, expenses, income, investmentReturns, inflation } =
    profile

  // Calculate basic metrics
  const currentNetWorth = calculateNetWorth(assets, liabilities)
  const monthlyNetIncome = calculateMonthlyNetIncome(
    income.monthlySalary,
    income.annualBonus,
    income.passiveIncomeMonthly,
    income.spouseIncome,
    expenses.monthlyCurrentExpense
  )

  const yearsUntilRetirement = personalInfo.retirementAge - personalInfo.currentAge
  const yearsInRetirement =
    personalInfo.lifeExpectancy - personalInfo.retirementAge

  // Calculate retirement corpus needed
  const monthlyRetirementExpense =
    expenses.expectedRetirementMonthlyExpense || expenses.monthlyCurrentExpense * 0.8
  const annualRetirementExpense = monthlyRetirementExpense * 12

  const totalRetirementCorpusNeeded = calculateRetirementCorpus(
    monthlyRetirementExpense,
    inflation,
    investmentReturns,
    yearsUntilRetirement,
    yearsInRetirement
  )

  // Account for expected retirement income (pension/annuity treated as annual)
  // PV-adjust it the same way: inflate to retirement age, then compute the
  // lump sum at retirement it offsets given the corpus keeps earning returns.
  const monthlyRetirementIncomeToday = income.expectedRetirementIncome / 12
  const monthlyRetirementIncomeAtRetirement =
    monthlyRetirementIncomeToday *
    Math.pow(1 + inflation, yearsUntilRetirement)
  const corpusOffsetFromIncome = presentValueOfRetirementStream(
    monthlyRetirementIncomeAtRetirement,
    inflation,
    investmentReturns,
    yearsInRetirement
  )
  const totalRetirementCorpusNeededAfterIncome = Math.max(
    0,
    totalRetirementCorpusNeeded - corpusOffsetFromIncome
  )

  // Calculate projected corpus at retirement
  const majorExpenses = (expenses.majorUpcomingExpenses || []).map(
    (exp) => ({
      cost: exp.estimatedCost,
      yearsUntil: exp.yearsUntilExpense,
    })
  )

  const projectedCorpusAtRetirement =
    calculateProjectedCorpusAtRetirement(
      currentNetWorth,
      monthlyNetIncome,
      investmentReturns,
      yearsUntilRetirement,
      majorExpenses
    )

  const gap = totalRetirementCorpusNeededAfterIncome - projectedCorpusAtRetirement

  // Determine readiness
  let retirementReadiness: 'ready' | 'on_track' | 'needs_work' | 'not_ready'
  if (projectedCorpusAtRetirement >= totalRetirementCorpusNeededAfterIncome * 1.2) {
    retirementReadiness = 'ready'
  } else if (projectedCorpusAtRetirement >= totalRetirementCorpusNeededAfterIncome * 0.9) {
    retirementReadiness = 'on_track'
  } else if (projectedCorpusAtRetirement >= totalRetirementCorpusNeededAfterIncome * 0.7) {
    retirementReadiness = 'needs_work'
  } else {
    retirementReadiness = 'not_ready'
  }

  // Calculate when they can actually retire
  let yearsCanRetire = personalInfo.lifeExpectancy
  if (monthlyNetIncome > 0) {
    const monthsToCorpus = totalRetirementCorpusNeededAfterIncome / monthlyNetIncome / 12
    yearsCanRetire = personalInfo.currentAge + monthsToCorpus
  }

  // Generate recommendations
  const recommendations = generateRecommendations({
    readiness: retirementReadiness,
    gap,
    monthlyNetIncome,
    projectedCorpus: projectedCorpusAtRetirement,
    neededCorpus: totalRetirementCorpusNeededAfterIncome,
    yearsUntilRetirement,
    yearsCanRetire,
  })

  return {
    currentNetWorth,
    monthlyNetIncome,
    monthlyRetirementExpense,
    annualRetirementExpense,
    totalRetirementCorpusNeeded: totalRetirementCorpusNeededAfterIncome,
    yearsUntilRetirement,
    projectedCorpusAtRetirement,
    retirementReadiness,
    retirementGap: gap,
    yearsCanRetire,
    recommendations,
  }
}

function generateRecommendations(params: {
  readiness: string
  gap: number
  monthlyNetIncome: number
  projectedCorpus: number
  neededCorpus: number
  yearsUntilRetirement: number
  yearsCanRetire: number
}): string[] {
  const recommendations: string[] = []

  if (params.readiness === 'ready') {
    recommendations.push(
      '✓ You are well-prepared for retirement with a comfortable surplus'
    )
    recommendations.push(
      'Consider philanthropic goals or increasing retirement lifestyle'
    )
  } else if (params.readiness === 'on_track') {
    recommendations.push('You are on track for your retirement goals')
    recommendations.push(
      'Maintain your current savings rate and investment discipline'
    )
  } else if (params.readiness === 'needs_work') {
    recommendations.push(
      `You need to close a gap of ₹${Math.abs(params.gap).toLocaleString('en-IN')}`
    )
    if (params.monthlyNetIncome > 0) {
      recommendations.push(
        `Increase monthly savings by ₹${(Math.abs(params.gap) / (params.yearsUntilRetirement * 12)).toLocaleString('en-IN')} to stay on track`
      )
    }
    recommendations.push('Delay retirement by 2-3 years to build more corpus')
  } else {
    recommendations.push('Your current savings path may not support retirement')
    recommendations.push('Consider: (1) Increase income, (2) Reduce expenses, (3) Work longer')
    recommendations.push(
      `At your current pace, you can retire in ${Math.round(params.yearsCanRetire - new Date().getFullYear() + 2026)} years`
    )
  }

  return recommendations
}
