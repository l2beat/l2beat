import { useState } from 'react'
import type { FunctionModuleScore, LetterGrade, FunctionDetail } from '../api/types'
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
  }
}

/**
 * Get inline styles for grade badge
 */
function getGradeBadgeStyles(grade: LetterGrade): { backgroundColor: string; borderColor: string; color: string } {
  switch (grade) {
    case 'AAA':
    case 'AA':
    case 'A':
      return {
        backgroundColor: 'rgba(20, 83, 45, 0.5)', // green-900/50
        borderColor: 'rgba(34, 197, 94, 0.3)', // green-500/30
        color: '#4ade80' // green-400
      }
    case 'BBB':
    case 'BB':
    case 'B':
      return {
        backgroundColor: 'rgba(113, 63, 18, 0.5)', // yellow-900/50
        borderColor: 'rgba(234, 179, 8, 0.3)', // yellow-500/30
        color: '#facc15' // yellow-400
      }
    case 'CCC':
    case 'CC':
    case 'C':
      return {
        backgroundColor: 'rgba(124, 45, 18, 0.5)', // orange-900/50
        borderColor: 'rgba(249, 115, 22, 0.3)', // orange-500/30
        color: '#fb923c' // orange-400
      }
    case 'D':
      return {
        backgroundColor: 'rgba(127, 29, 29, 0.5)', // red-900/50
        borderColor: 'rgba(239, 68, 68, 0.3)', // red-500/30
        color: '#f87171' // red-400
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
      return '#9ca3af' // gray-400
    default:
      return '#9ca3af' // gray-400
  }
}

/**
 * Grade section component - displays functions for a single grade
 */
function GradeSection({
  grade,
  functions,
}: {
  grade: LetterGrade
  functions: FunctionDetail[]
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const badgeStyles = getGradeBadgeStyles(grade)

  if (functions.length === 0) return null

  return (
    <div className="ml-4 mb-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full text-left hover:bg-coffee-800/30 p-2 rounded transition-colors"
      >
        <span className="text-coffee-400 text-xs">
          {isExpanded ? '▼' : '▶'}
        </span>
        <span
          className="inline-block px-2 py-0.5 rounded border text-xs font-mono"
          style={{
            backgroundColor: badgeStyles.backgroundColor,
            borderColor: badgeStyles.borderColor,
            color: badgeStyles.color
          }}
        >
          {grade}
        </span>
        <span className="text-coffee-300 text-sm">
          {functions.length} function{functions.length !== 1 ? 's' : ''}
        </span>
      </button>

      {isExpanded && (
        <ul className="ml-8 mt-2 space-y-1.5">
          {functions.map((func, idx) => {
            const impactColor = getImpactColor(func.impact)
            const likelihoodColor = getLikelihoodColor(func.likelihood)

            return (
              <li key={idx} className="text-xs text-coffee-300">
                <button
                  onClick={() => usePanelStore.getState().select(func.contractAddress)}
                  className="font-medium text-coffee-200 hover:text-blue-400 cursor-pointer transition-colors"
                >
                  {func.contractName}
                </button>
                <span className="text-coffee-500 mx-1">.</span>
                <span className="text-blue-400">{func.functionName}()</span>
                <span className="text-coffee-500 ml-2">(</span>
                <span style={{ color: impactColor }}>{func.impact}</span>
                <span className="text-coffee-500"> × </span>
                <span style={{ color: likelihoodColor }}>{func.likelihood}</span>
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
  const gradeColor = getGradeColor(score.grade)

  // Get grade order from worst to best
  const gradeOrder: LetterGrade[] = ['D', 'C', 'CC', 'CCC', 'B', 'BB', 'BBB', 'A', 'AA', 'AAA']

  // Count scored functions
  const scoredFunctionCount = score.breakdown
    ? Object.values(score.breakdown).flat().length
    : 0

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
        {scoredFunctionCount === 0 ? (
          <p className="text-xs text-coffee-400 ml-4">
            No functions with both impact and likelihood scores
          </p>
        ) : (
          <>
            <p className="text-xs text-coffee-400 ml-4 mb-3">
              {scoredFunctionCount} scored function{scoredFunctionCount !== 1 ? 's' : ''}
            </p>
            {gradeOrder.map((grade) => (
              <GradeSection
                key={grade}
                grade={grade}
                functions={score.breakdown?.[grade] || []}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
