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

export function calculateRetirementCorpus(
  monthlyExpense: number,
  inflation: number,
  yearsInRetirement: number
): number {
  // Calculate total retirement corpus needed using
  // Present Value of Annuity formula adjusted for inflation
  const monthlyInflationRate = inflation / 12
  const months = yearsInRetirement * 12

  let totalCorpusNeeded = 0

  // Calculate month-by-month as expenses inflate
  for (let month = 1; month <= months; month++) {
    const inflatedMonthlyExpense =
      monthlyExpense * Math.pow(1 + monthlyInflationRate, month)
    totalCorpusNeeded += inflatedMonthlyExpense
  }

  return totalCorpusNeeded
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
    yearsInRetirement
  )

  // Account for expected retirement income
  const monthlyRetirementIncome =
    income.expectedRetirementIncome / 12
  const totalRetirementCorpusNeededAfterIncome = Math.max(
    0,
    totalRetirementCorpusNeeded -
      monthlyRetirementIncome * 12 * yearsInRetirement
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
