import { useQuery } from '@tanstack/react-query'
import { getV2Score } from '../api/api'
import type { LetterGrade, ModuleScore } from '../api/types'
import { AdminsInventoryBreakdown } from './AdminsInventoryBreakdown'
import { DependencyInventoryBreakdown } from './DependencyInventoryBreakdown'
import { FunctionBreakdown } from './FunctionBreakdown'

interface V2ScoringSectionProps {
  project: string
}

/**
 * Get semantic color class for a letter grade
 */
function getGradeColor(grade: LetterGrade): string {
  switch (grade) {
    case 'AAA':
    case 'AA':
    case 'A':
      return 'text-green-400'
    case 'BBB':
    case 'BB':
    case 'B':
      return 'text-yellow-400'
    case 'CCC':
    case 'CC':
    case 'C':
      return 'text-orange-400'
    case 'D':
      return 'text-red-400'
    case 'Unscored':
      return 'text-gray-400'
  }
}

/**
 * Inventory item display component
 */
function InventoryItem({
  label,
  score,
}: {
  label: string
  score: ModuleScore
}) {
  const gradeColor = getGradeColor(score.grade)

  return (
    <div className="flex items-center justify-between text-coffee-300">
      <span className="font-medium">{label}:</span>
      <span>
        {score.inventory}{' '}
        <span className={`font-semibold ${gradeColor}`}>
          (Grade: {score.grade})
        </span>
      </span>
    </div>
  )
}

/**
 * V2 Scoring Section Component
 * Displays V2 framework scoring with inventory counts and letter grades
 */
export function V2ScoringSection({ project }: V2ScoringSectionProps) {
  const {
    data: scoreData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['v2-score', project],
    queryFn: () => getV2Score(project),
  })

  if (isLoading) {
    return (
      <div className="border-b border-b-coffee-600 pb-2">
        <h2 className="p-2 font-bold text-2xl text-blue-600">V2 Scoring:</h2>
        <div className="mb-1 flex flex-col gap-2 border-transparent border-l-4 p-2 pl-1">
          <p className="text-coffee-400">Loading V2 scores...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border-b border-b-coffee-600 pb-2">
        <h2 className="p-2 font-bold text-2xl text-blue-600">V2 Scoring:</h2>
        <div className="mb-1 flex flex-col gap-2 border-transparent border-l-4 p-2 pl-1">
          <p className="text-red-400">
            Error loading V2 scores: {String(error)}
          </p>
        </div>
      </div>
    )
  }

  if (!scoreData) {
    return null
  }

  const finalGradeColor = getGradeColor(scoreData.finalScore)

  return (
    <div className="border-b border-b-coffee-600 pb-2">
      <h2 className="p-2 font-bold text-2xl text-blue-600">V2 Scoring:</h2>
      <div className="mb-1 flex flex-col gap-4 border-transparent border-l-4 p-2 pl-1">
        {/* Inventory Subsection */}
        <div>
          <h3 className="mb-2 font-semibold text-lg text-orange-400">
            Inventory
          </h3>
          <div className="ml-4 flex flex-col gap-3 text-sm">
            <InventoryItem
              label="Contracts"
              score={scoreData.inventory.contracts}
            />
            <FunctionBreakdown score={scoreData.inventory.functions} />
            <DependencyInventoryBreakdown
              score={scoreData.inventory.dependencies}
              adminScore={scoreData.inventory.admins}
            />
            <AdminsInventoryBreakdown score={scoreData.inventory.admins} />
          </div>
        </div>

        {/* Score Subsection */}
        <div>
          <h3 className="mb-2 font-semibold text-lg text-orange-400">Score</h3>
          <div className="ml-4 text-sm">
            <p className="text-coffee-300">
              Final score:{' '}
              <span className={`font-bold text-xl ${finalGradeColor}`}>
                {scoreData.finalScore}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
