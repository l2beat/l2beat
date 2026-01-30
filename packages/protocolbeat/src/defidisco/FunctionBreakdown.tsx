import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { updateFunction } from '../api/api'
import type {
  FunctionDetail,
  FunctionModuleScore,
  Impact,
  LetterGrade,
} from '../api/types'
import { usePanelStore } from '../apps/discovery/store/panel-store'

interface FunctionBreakdownProps {
  score: FunctionModuleScore
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
 * Get inline styles for grade badge
 */
function getGradeBadgeStyles(grade: LetterGrade): {
  backgroundColor: string
  borderColor: string
  color: string
} {
  switch (grade) {
    case 'AAA':
    case 'AA':
    case 'A':
      return {
        backgroundColor: 'rgba(20, 83, 45, 0.5)', // green-900/50
        borderColor: 'rgba(34, 197, 94, 0.3)', // green-500/30
        color: '#4ade80', // green-400
      }
    case 'BBB':
    case 'BB':
    case 'B':
      return {
        backgroundColor: 'rgba(113, 63, 18, 0.5)', // yellow-900/50
        borderColor: 'rgba(234, 179, 8, 0.3)', // yellow-500/30
        color: '#facc15', // yellow-400
      }
    case 'CCC':
    case 'CC':
    case 'C':
      return {
        backgroundColor: 'rgba(124, 45, 18, 0.5)', // orange-900/50
        borderColor: 'rgba(249, 115, 22, 0.3)', // orange-500/30
        color: '#fb923c', // orange-400
      }
    case 'D':
      return {
        backgroundColor: 'rgba(127, 29, 29, 0.5)', // red-900/50
        borderColor: 'rgba(239, 68, 68, 0.3)', // red-500/30
        color: '#f87171', // red-400
      }
    case 'Unscored':
      return {
        backgroundColor: 'rgba(55, 65, 81, 0.5)', // gray-700/50
        borderColor: 'rgba(156, 163, 175, 0.3)', // gray-400/30
        color: '#9ca3af', // gray-400
      }
  }
}

/**
 * Get color value for impact level (inline style)
 */
function getImpactColor(impact: string): string {
  switch (impact) {
    case 'critical':
      return '#c084fc' // purple-400
    case 'high':
      return '#f87171' // red-400
    case 'medium':
      return '#fbbf24' // yellow-400
    case 'low':
      return '#10b981' // green-500
    default:
      return '#9ca3af' // gray-400
  }
}

/**
 * Get color value for likelihood level (inline style)
 */
function getLikelihoodColor(likelihood: string): string {
  switch (likelihood) {
    case 'high':
      return '#f87171' // red-400
    case 'medium':
      return '#fb923c' // orange-400
    case 'low':
      return '#10b981' // green-500
    case 'mitigated':
      return '#60a5fa' // blue-400
    default:
      return '#9ca3af' // gray-400 (unassigned)
  }
}

/**
 * Convert Impact to score string for API
 */
function impactToScore(
  impact: Impact,
): 'low-risk' | 'medium-risk' | 'high-risk' | 'critical' {
  switch (impact) {
    case 'low':
      return 'low-risk'
    case 'medium':
      return 'medium-risk'
    case 'high':
      return 'high-risk'
    case 'critical':
      return 'critical'
  }
}

/**
 * Impact inline editor dropdown
 */
function ImpactPicker({
  currentImpact,
  onUpdate,
}: {
  currentImpact: Impact
  onUpdate: (impact: Impact) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const impactOptions: Impact[] = ['low', 'medium', 'high', 'critical']

  const handleSelect = (impact: Impact) => {
    onUpdate(impact)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="rounded border border-coffee-600 bg-coffee-700 px-2 py-0.5 text-xs capitalize hover:bg-coffee-600"
        style={{ color: getImpactColor(currentImpact) }}
      >
        {currentImpact}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-1 flex min-w-[120px] flex-col gap-2 rounded border border-coffee-600 bg-coffee-800 p-2 shadow-xl">
            <div className="font-semibold text-coffee-300 text-xs">Impact</div>
            {impactOptions.map((imp) => (
              <button
                key={imp}
                className={`rounded border border-coffee-600 px-2 py-1 text-xs capitalize ${
                  currentImpact === imp
                    ? 'bg-coffee-600'
                    : 'bg-coffee-700 hover:bg-coffee-600'
                }`}
                onClick={() => handleSelect(imp)}
              >
                {imp}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/**
 * Grade section component - displays functions for a single grade
 */
function GradeSection({
  grade,
  functions,
  onUpdateImpact,
}: {
  grade: LetterGrade
  functions: FunctionDetail[]
  onUpdateImpact: (
    contractAddress: string,
    functionName: string,
    impact: Impact,
  ) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const badgeStyles = getGradeBadgeStyles(grade)

  if (functions.length === 0) return null

  return (
    <div className="mb-2 ml-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-2 rounded p-2 text-left transition-colors hover:bg-coffee-800/30"
      >
        <span className="text-coffee-400 text-xs">
          {isExpanded ? '▼' : '▶'}
        </span>
        <span
          className="inline-block rounded border px-2 py-0.5 font-mono text-xs"
          style={{
            backgroundColor: badgeStyles.backgroundColor,
            borderColor: badgeStyles.borderColor,
            color: badgeStyles.color,
          }}
        >
          {grade}
        </span>
        <span className="text-coffee-300 text-sm">
          {functions.length} function{functions.length !== 1 ? 's' : ''}
        </span>
      </button>

      {isExpanded && (
        <ul className="mt-2 ml-8 space-y-1.5">
          {functions.map((func, idx) => {
            const likelihoodColor = getLikelihoodColor(func.likelihood)

            return (
              <li key={idx} className="text-coffee-300 text-xs">
                <button
                  onClick={() =>
                    usePanelStore.getState().select(func.contractAddress)
                  }
                  className="cursor-pointer font-medium text-coffee-200 transition-colors hover:text-blue-400"
                >
                  {func.contractName}
                </button>
                <span className="mx-1 text-coffee-500">.</span>
                <span className="text-blue-400">{func.functionName}()</span>
                <span className="ml-2 text-coffee-500">(Impact: </span>
                <ImpactPicker
                  currentImpact={func.impact}
                  onUpdate={(impact) =>
                    onUpdateImpact(
                      func.contractAddress,
                      func.functionName,
                      impact,
                    )
                  }
                />
                <span className="text-coffee-500">, Likelihood: </span>
                <span style={{ color: likelihoodColor }}>
                  {func.likelihood}
                </span>
                <span className="text-coffee-500">)</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

/**
 * Function Breakdown Component
 * Displays breakdown of functions by grade
 */
export function FunctionBreakdown({ score }: FunctionBreakdownProps) {
  const { project } = useParams()
  const queryClient = useQueryClient()
  const gradeColor = getGradeColor(score.grade)

  // Get grade order from worst to best (excluding Unscored)
  const gradeOrder: LetterGrade[] = [
    'D',
    'C',
    'CC',
    'CCC',
    'B',
    'BB',
    'BBB',
    'A',
    'AA',
    'AAA',
  ]

  // Count scored functions (excluding Unscored)
  const scoredFunctionCount = score.breakdown
    ? Object.entries(score.breakdown)
        .filter(([grade]) => grade !== 'Unscored')
        .flatMap(([_, functions]) => functions).length
    : 0

  // Get unscored functions
  const unscoredFunctions = score.breakdown?.['Unscored'] || []
  const unscoredCount = unscoredFunctions.length

  // Mutation for updating impact
  const updateImpactMutation = useMutation({
    mutationFn: ({
      contractAddress,
      functionName,
      impact,
    }: {
      contractAddress: string
      functionName: string
      impact: Impact
    }) => {
      if (!project) throw new Error('Project not found')

      return updateFunction(project, {
        contractAddress,
        functionName,
        score: impactToScore(impact),
      })
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['functions', project] })
      queryClient.invalidateQueries({ queryKey: ['v2-score', project] })
    },
  })

  const handleUpdateImpact = (
    contractAddress: string,
    functionName: string,
    impact: Impact,
  ) => {
    updateImpactMutation.mutate({ contractAddress, functionName, impact })
  }

  return (
    <div className="text-coffee-300">
      {/* Main header - non-expandable, consistent with other inventory items */}
      <div className="flex items-center justify-between">
        <span className="font-medium">Functions:</span>
        <span>
          {score.inventory}{' '}
          <span className={`font-semibold ${gradeColor}`}>
            (Grade: {score.grade})
          </span>
        </span>
      </div>

      {/* Grade breakdown - always shown */}
      <div className="mt-3 ml-2">
        {scoredFunctionCount === 0 && unscoredCount === 0 ? (
          <p className="ml-4 text-coffee-400 text-xs">
            No functions with impact scores
          </p>
        ) : (
          <>
            {scoredFunctionCount > 0 && (
              <p className="mb-3 ml-4 text-coffee-400 text-xs">
                {scoredFunctionCount} scored function
                {scoredFunctionCount !== 1 ? 's' : ''}
                {unscoredCount > 0 && ` + ${unscoredCount} unscored`}
              </p>
            )}
            {scoredFunctionCount === 0 && unscoredCount > 0 && (
              <p className="mb-3 ml-4 text-coffee-400 text-xs">
                {unscoredCount} unscored function
                {unscoredCount !== 1 ? 's' : ''} (missing likelihood)
              </p>
            )}
            {gradeOrder.map((grade) => (
              <GradeSection
                key={grade}
                grade={grade}
                functions={score.breakdown?.[grade] || []}
                onUpdateImpact={handleUpdateImpact}
              />
            ))}
            {/* Unscored section */}
            {unscoredCount > 0 && (
              <GradeSection
                key="Unscored"
                grade="Unscored"
                functions={unscoredFunctions}
                onUpdateImpact={handleUpdateImpact}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
