import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import type { DependencyModuleScore, LetterGrade, Likelihood } from '../api/types'
import { usePanelStore } from '../apps/discovery/store/panel-store'
import { useContractTags } from '../hooks/useContractTags'
import { updateContractTag } from '../api/api'

interface DependencyInventoryBreakdownProps {
  score: DependencyModuleScore
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
      return '#60a5fa' // blue-400
    default:
      return '#9ca3af' // gray-400 (unassigned)
  }
}

/**
 * Likelihood inline editor dropdown
 */
function LikelihoodPicker({
  currentLikelihood,
  onUpdate,
}: {
  currentLikelihood: Likelihood
  onUpdate: (likelihood: Likelihood) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLikelihood, setSelectedLikelihood] = useState<Likelihood>(currentLikelihood)
  const likelihoodOptions: Likelihood[] = ['high', 'medium', 'low', 'mitigated']

  const handleApply = () => {
    onUpdate(selectedLikelihood)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="text-xs px-2 py-0.5 rounded border border-coffee-600 bg-coffee-700 hover:bg-coffee-600 capitalize"
        style={{ color: getLikelihoodColor(currentLikelihood) }}
      >
        {currentLikelihood}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-1 flex flex-col gap-2 rounded border border-coffee-600 bg-coffee-800 p-2 shadow-xl min-w-[120px]">
            <div className="text-xs font-semibold text-coffee-300">Likelihood</div>
            {likelihoodOptions.map((lik) => (
              <button
                key={lik}
                className={`rounded border border-coffee-600 px-2 py-1 text-xs capitalize ${
                  selectedLikelihood === lik
                    ? 'bg-coffee-600'
                    : 'bg-coffee-700 hover:bg-coffee-600'
                }`}
                onClick={() => setSelectedLikelihood(lik)}
              >
                {lik}
              </button>
            ))}
            <button
              className="w-full rounded border border-coffee-600 bg-coffee-700 px-2 py-1 text-xs hover:bg-coffee-600"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </>
      )}
    </div>
  )
}

/**
 * Dependency section component - displays functions for a single external contract
 */
function DependencySection({
  dependency,
  onUpdateLikelihood,
}: {
  dependency: any
  onUpdateLikelihood: (contractAddress: string, likelihood: Likelihood) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const selectGlobal = usePanelStore((state) => state.select)

  // Calculate worst grade among all functions for this dependency
  const worstGrade = dependency.functions.length > 0
    ? dependency.functions.reduce((worst: LetterGrade, func: any) => {
        const gradeValues: Record<LetterGrade, number> = {
          'AAA': 10, 'AA': 9, 'A': 8,
          'BBB': 7, 'BB': 6, 'B': 5,
          'CCC': 4, 'CC': 3, 'C': 2, 'D': 1
        }
        return gradeValues[func.grade] < gradeValues[worst] ? func.grade : worst
      }, dependency.functions[0].grade)
    : null

  const badgeStyles = worstGrade ? getGradeBadgeStyles(worstGrade) : null

  return (
    <div className="ml-4 mb-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full text-left hover:bg-coffee-800/30 p-2 rounded transition-colors"
      >
        <span className="text-coffee-400 text-xs">
          {isExpanded ? '▼' : '▶'}
        </span>
        {badgeStyles && (
          <span
            className="inline-block px-2 py-0.5 rounded border text-xs font-mono"
            style={{
              backgroundColor: badgeStyles.backgroundColor,
              borderColor: badgeStyles.borderColor,
              color: badgeStyles.color
            }}
          >
            {worstGrade}
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            selectGlobal(dependency.dependencyAddress)
          }}
          className="font-medium text-coffee-200 hover:text-blue-400 cursor-pointer transition-colors text-sm"
        >
          {dependency.dependencyName}
        </button>
        <span className="text-coffee-500 text-xs mx-1">|</span>
        <span className="text-xs text-coffee-400">Likelihood:</span>
        <LikelihoodPicker
          currentLikelihood={dependency.likelihood}
          onUpdate={(likelihood) => onUpdateLikelihood(dependency.dependencyAddress, likelihood)}
        />
        <span className="text-coffee-400 text-xs ml-2">
          ({dependency.functions.length} function{dependency.functions.length !== 1 ? 's' : ''})
        </span>
      </button>

      {isExpanded && (
        <ul className="ml-8 mt-2 space-y-1.5">
          {dependency.functions.map((func: any, idx: number) => {
            const impactColor = getImpactColor(func.impact)
            const likelihoodColor = getLikelihoodColor(dependency.likelihood)
            const gradeBadgeStyles = getGradeBadgeStyles(func.grade)

            return (
              <li key={idx} className="text-xs text-coffee-300 flex items-center gap-2">
                <span
                  className="inline-block px-1.5 py-0.5 rounded border text-xs font-mono"
                  style={{
                    backgroundColor: gradeBadgeStyles.backgroundColor,
                    borderColor: gradeBadgeStyles.borderColor,
                    color: gradeBadgeStyles.color
                  }}
                >
                  {func.grade}
                </span>
                <button
                  onClick={() => selectGlobal(func.contractAddress)}
                  className="font-medium text-coffee-200 hover:text-blue-400 cursor-pointer transition-colors"
                >
                  {func.contractName}
                </button>
                <span className="text-coffee-500">.</span>
                <span className="text-blue-400">{func.functionName}()</span>
                <span className="text-coffee-500 ml-2">(</span>
                <span style={{ color: impactColor }}>{func.impact}</span>
                <span className="text-coffee-500"> × </span>
                <span style={{ color: likelihoodColor }}>{dependency.likelihood}</span>
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
 * Dependency Inventory Breakdown Component
 * Displays breakdown of dependencies by external contract
 */
export function DependencyInventoryBreakdown({ score }: DependencyInventoryBreakdownProps) {
  const { project } = useParams()
  const queryClient = useQueryClient()
  const { data: contractTags } = useContractTags(project!)
  const gradeColor = getGradeColor(score.grade)

  // Mutation for updating likelihood
  const updateLikelihoodMutation = useMutation({
    mutationFn: ({ contractAddress, likelihood }: { contractAddress: string; likelihood: Likelihood }) => {
      if (!project) throw new Error('Project not found')

      // Get existing tag to preserve other attributes
      const normalizedAddress = contractAddress.replace('eth:', '').toLowerCase()
      const existingTag = contractTags?.tags.find(tag =>
        tag.contractAddress.toLowerCase() === normalizedAddress
      )

      return updateContractTag(project, {
        contractAddress: normalizedAddress,
        isExternal: existingTag?.isExternal ?? true,
        centralization: existingTag?.centralization,
        likelihood: likelihood,
      })
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['contract-tags', project] })
      queryClient.invalidateQueries({ queryKey: ['v2-score', project] })
    },
  })

  const handleUpdateLikelihood = (contractAddress: string, likelihood: Likelihood) => {
    updateLikelihoodMutation.mutate({ contractAddress, likelihood })
  }

  // Count functions across all dependencies
  const totalFunctionCount = score.breakdown
    ? score.breakdown.reduce((sum, dep) => sum + dep.functions.length, 0)
    : 0

  return (
    <div className="text-coffee-300">
      {/* Main header - non-expandable, consistent with other inventory items */}
      <div className="flex items-center justify-between">
        <span className="font-medium">Dependencies:</span>
        <span>
          {score.inventory}{' '}
          <span className={`font-semibold ${gradeColor}`}>
            (Grade: {score.grade})
          </span>
        </span>
      </div>

      {/* Dependency breakdown - always shown */}
      <div className="mt-3 ml-2">
        {!score.breakdown || score.breakdown.length === 0 ? (
          <p className="text-xs text-coffee-400 ml-4">
            No functions with dependencies on external contracts
          </p>
        ) : (
          <>
            <p className="text-xs text-coffee-400 ml-4 mb-3">
              {totalFunctionCount} function{totalFunctionCount !== 1 ? 's' : ''} using {score.breakdown.length} external contract{score.breakdown.length !== 1 ? 's' : ''}
            </p>
            {score.breakdown.map((dep) => (
              <DependencySection
                key={dep.dependencyAddress}
                dependency={dep}
                onUpdateLikelihood={handleUpdateLikelihood}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
