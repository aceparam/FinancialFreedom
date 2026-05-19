'use client'

export function EmptyState({
  onAddMilestone,
}: {
  onAddMilestone: () => void
}) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-12 text-center">
      <div className="mb-4 text-4xl">🎯</div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Add your first milestone
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
        Start by creating a milestone to see your path to financial freedom
      </p>
      <button
        onClick={onAddMilestone}
        className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
      >
        Create Milestone
      </button>
    </div>
  )
}
