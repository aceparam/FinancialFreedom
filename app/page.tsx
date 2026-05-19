'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { Header } from '@/components/common/Header'
import { VerdictHero } from '@/components/dashboard/VerdictHero'
import { ProjectionChart } from '@/components/dashboard/ProjectionChart'
import { MilestoneCards } from '@/components/dashboard/MilestoneCards'
import { SIPSlider } from '@/components/dashboard/SIPSlider'
import { EmptyState } from '@/components/common/EmptyState'
import { MilestoneDrawer } from '@/components/common/MilestoneDrawer'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'

export default function Home() {
  const { milestones, onboardingComplete } = useStore()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div />
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="space-y-8">
          <VerdictHero />

          {milestones.length === 0 ? (
            <EmptyState onAddMilestone={() => setIsDrawerOpen(true)} />
          ) : (
            <>
              <ProjectionChart />
              <MilestoneCards />
            </>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
            >
              {milestones.length === 0 ? '+ Add Milestone' : '+ Add Another'}
            </button>
            <OnboardingFlow />
          </div>
        </div>
      </main>

      <SIPSlider />

      <MilestoneDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  )
}
