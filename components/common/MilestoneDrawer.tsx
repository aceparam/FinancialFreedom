'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Milestone, Category } from '@/lib/types'
import { CATEGORY_DEFAULTS } from '@/lib/config'
import { formatINR, parseINRInput } from '@/lib/currency'
import { generateId } from '@/lib/uuid'

const CATEGORIES: Category[] = [
  'Education',
  'Healthcare',
  'Housing',
  'Vehicle',
  'General',
  'Travel',
  'Wedding',
]

interface MilestoneDrawerProps {
  isOpen: boolean
  onClose: () => void
  editingMilestone?: Milestone
}

export function MilestoneDrawer({
  isOpen,
  onClose,
  editingMilestone,
}: MilestoneDrawerProps) {
  const { addMilestone, updateMilestone, deleteMilestone } = useStore()

  const defaultDate: string = new Date().toISOString().split('T')[0] || ''

  const getInitialMilestone = (): Milestone => {
    if (editingMilestone) {
      return {
        id: editingMilestone.id,
        name: editingMilestone.name,
        targetDate: editingMilestone.targetDate === undefined ? defaultDate : editingMilestone.targetDate,
        currentCost: editingMilestone.currentCost,
        category: editingMilestone.category,
        inflationOverride: editingMilestone.inflationOverride,
      } as const
    }

    return {
      id: generateId(),
      name: '',
      targetDate: defaultDate,
      currentCost: 0,
      category: 'General' as const,
    }
  }

  const [formData, setFormData] = useState<Milestone>(getInitialMilestone())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingMilestone) {
      updateMilestone(editingMilestone.id, formData)
    } else {
      addMilestone(formData)
    }
    setFormData({
      id: generateId(),
      name: '',
      targetDate: defaultDate,
      currentCost: 0,
      category: 'General',
    })
    onClose()
  }

  const handleDelete = () => {
    if (editingMilestone && confirm('Are you sure?')) {
      deleteMilestone(editingMilestone.id)
      onClose()
    }
  }

  const categoryDefault = CATEGORY_DEFAULTS[formData.category]
  const inflationRate = formData.inflationOverride ?? categoryDefault

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-t-lg sm:rounded-lg shadow-xl max-w-md w-full h-[90vh] sm:h-auto sm:max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {editingMilestone ? 'Edit Milestone' : 'Add Milestone'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Milestone Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="e.g., Car, College, Wedding"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.targetDate}
                  onChange={(e) =>
                    setFormData({ ...formData, targetDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Cost (₹)
                </label>
                <input
                  type="text"
                  required
                  value={formatINR(formData.currentCost, 'full')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentCost: parseINRInput(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as Category,
                      inflationOverride: undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} ({(CATEGORY_DEFAULTS[cat] * 100).toFixed(0)}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.inflationOverride !== undefined}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        inflationOverride: e.target.checked
                          ? categoryDefault
                          : undefined,
                      })
                    }
                    className="rounded"
                  />
                  Custom Inflation Override
                </label>
                {formData.inflationOverride !== undefined && (
                  <input
                    type="number"
                    step="0.1"
                    value={(formData.inflationOverride * 100).toFixed(1)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        inflationOverride: parseFloat(e.target.value) / 100,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                >
                  {editingMilestone ? 'Update' : 'Add'}
                </button>
                {editingMilestone && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
