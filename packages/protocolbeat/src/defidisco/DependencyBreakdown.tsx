import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getFunctions, getProject, updateContractTag } from '../api/api'
import type { Impact, LetterGrade, Likelihood } from '../api/types'
import { usePanelStore } from '../apps/discovery/store/panel-store'
import { useContractTags } from '../hooks/useContractTags'

/**
 * Grade mapping: Impact × Likelihood → LetterGrade
 * Matches the SEVERITY_GRADE_MAP from v2Scoring.ts
 */
const SEVERITY_GRADE_MAP: Record<Impact, Record<Likelihood, LetterGrade>> = {
  critical: {
    mitigated: 'B',
    low: 'C',
    medium: 'D',
    high: 'D',
  },
  high: {
    mitigated: 'A',
    low: 'BB',
    medium: 'CC',
    high: 'D',
  },
  medium: {
    mitigated: 'AA',
    low: 'A',
    medium: 'BBB',
    high: 'CCC',
  },
  low: {
    mitigated: 'AA',
    low: 'AA',
    medium: 'A',
    high: 'BBB',
  },
}

/**
 * Get severity grade from impact and likelihood
 */
function getSeverityGrade(impact: Impact, likelihood: Likelihood): LetterGrade {
  return SEVERITY_GRADE_MAP[impact][likelihood]
}

/**
 * Convert letter grade to numeric value for comparison
 */
const GRADE_TO_NUMERIC: Record<LetterGrade, number> = {
  AAA: 10,
  AA: 9,
  A: 8,
  BBB: 7,
  BB: 6,
  B: 5,
  CCC: 4,
  CC: 3,
  C: 2,
  D: 1,
}

/**
 * Get the worst grade from an array of grades
 */
function getWorstGrade(grades: LetterGrade[]): LetterGrade | null {
  if (grades.length === 0) return null

  const numericGrades = grades.map((g) => GRADE_TO_NUMERIC[g])
  const worstNumeric = Math.min(...numericGrades)

  const entry = Object.entries(GRADE_TO_NUMERIC).find(
    ([_, value]) => value === worstNumeric,
  )
  return entry ? (entry[0] as LetterGrade) : null
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

interface FunctionWithDependency {
  contractAddress: string
  contractName: string
  functionName: string
  impact: Impact
  grade: LetterGrade
}

interface DependencyData {
  contractAddress: string
  contractName: string
  likelihood: Likelihood
  functions: FunctionWithDependency[]
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
  const [selectedLikelihood, setSelectedLikelihood] =
    useState<Likelihood>(currentLikelihood)
  const likelihoodOptions: Likelihood[] = ['high', 'medium', 'low', 'mitigated']

  const handleApply = () => {
    onUpdate(selectedLikelihood)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded border border-coffee-600 bg-coffee-700 px-2 py-0.5 text-xs capitalize hover:bg-coffee-600"
        style={{ color: getLikelihoodColor(currentLikelihood) }}
      >
        {currentLikelihood}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1 flex min-w-[120px] flex-col gap-2 rounded border border-coffee-600 bg-coffee-800 p-2 shadow-xl">
          <div className="font-semibold text-coffee-300 text-xs">
            Likelihood
          </div>
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
      )}
    </div>
  )
}

/**
 * External contract section - displays functions that depend on this contract
 */
function DependencySection({
  dependency,
  onUpdateLikelihood,
}: {
  dependency: DependencyData
  onUpdateLikelihood: (contractAddress: string, likelihood: Likelihood) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const selectGlobal = usePanelStore((state) => state.select)

  // Calculate worst grade among all functions
  const worstGrade = getWorstGrade(dependency.functions.map((f) => f.grade))
  const badgeStyles = worstGrade ? getGradeBadgeStyles(worstGrade) : null

  return (
    <div className="mb-2 ml-4">
      <div className="flex w-full items-center gap-2 rounded p-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 rounded px-2 py-1 transition-colors hover:bg-coffee-800/30"
        >
          <span className="text-coffee-400 text-xs">
            {isExpanded ? '▼' : '▶'}
          </span>
          {badgeStyles && (
            <span
              className="inline-block rounded border px-2 py-0.5 font-mono text-xs"
              style={{
                backgroundColor: badgeStyles.backgroundColor,
                borderColor: badgeStyles.borderColor,
                color: badgeStyles.color,
              }}
            >
              {worstGrade}
            </span>
          )}
        </button>
        <button
          onClick={() => selectGlobal(dependency.contractAddress)}
          className="cursor-pointer font-medium text-coffee-200 text-sm transition-colors hover:text-blue-400"
        >
          {dependency.contractName}
        </button>
        <span className="mx-1 text-coffee-500 text-xs">|</span>
        <span className="text-coffee-400 text-xs">Likelihood:</span>
        <LikelihoodPicker
          currentLikelihood={dependency.likelihood}
          onUpdate={(likelihood) =>
            onUpdateLikelihood(dependency.contractAddress, likelihood)
          }
        />
        <span className="ml-2 text-coffee-400 text-xs">
          ({dependency.functions.length} function
          {dependency.functions.length !== 1 ? 's' : ''})
        </span>
      </div>

      {isExpanded && (
        <ul className="mt-2 ml-8 space-y-1.5">
          {dependency.functions.map((func, idx) => {
            const impactColor = getImpactColor(func.impact)
            const likelihoodColor = getLikelihoodColor(dependency.likelihood)
            const gradeBadgeStyles = getGradeBadgeStyles(func.grade)

            return (
              <li
                key={idx}
                className="flex items-center gap-2 text-coffee-300 text-xs"
              >
                <span
                  className="inline-block rounded border px-1.5 py-0.5 font-mono text-xs"
                  style={{
                    backgroundColor: gradeBadgeStyles.backgroundColor,
                    borderColor: gradeBadgeStyles.borderColor,
                    color: gradeBadgeStyles.color,
                  }}
                >
                  {func.grade}
                </span>
                <button
                  onClick={() => selectGlobal(func.contractAddress)}
                  className="cursor-pointer font-medium text-coffee-200 transition-colors hover:text-blue-400"
                >
                  {func.contractName}
                </button>
                <span className="text-coffee-500">.</span>
                <span className="text-blue-400">{func.functionName}()</span>
                <span className="ml-2 text-coffee-500">(</span>
                <span style={{ color: impactColor }}>{func.impact}</span>
                <span className="text-coffee-500"> × </span>
                <span style={{ color: likelihoodColor }}>
                  {dependency.likelihood}
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
 * Dependencies Breakdown Component
 * Displays breakdown of functions grouped by external contract dependencies
 */
export function DependencyBreakdown() {
  const { project } = useParams()
  const queryClient = useQueryClient()

  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  // Fetch data
  const { data: projectData } = useQuery({
    queryKey: ['projects', project],
    queryFn: () => getProject(project),
  })

  const { data: functions } = useQuery({
    queryKey: ['functions', project],
    queryFn: () => (project ? getFunctions(project) : null),
    enabled: !!project,
  })

  const { data: contractTags } = useContractTags(project)

  // Mutation for updating likelihood
  const updateLikelihoodMutation = useMutation({
    mutationFn: ({
      contractAddress,
      likelihood,
    }: {
      contractAddress: string
      likelihood: Likelihood
    }) => {
      // Get existing tag to preserve other attributes
      const normalizedAddress = contractAddress
        .replace('eth:', '')
        .toLowerCase()
      const existingTag = contractTags?.tags.find(
        (tag) => tag.contractAddress.toLowerCase() === normalizedAddress,
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
    },
  })

  if (!projectData || !functions || !contractTags) {
    return (
      <div className="border-b border-b-coffee-600 pb-2">
        <h2 className="p-2 font-bold text-orange-400 text-xl">Dependencies</h2>
        <div className="mb-1 flex flex-col gap-2 border-transparent border-l-4 p-2 pl-1">
          <p className="ml-4 text-coffee-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // Build contract name lookup map
  const contractNameMap = new Map<string, string>()
  projectData.entries?.forEach((entry: any) => {
    ;[
      ...(entry.initialContracts || []),
      ...(entry.discoveredContracts || []),
    ].forEach((contract: any) => {
      contractNameMap.set(contract.address, contract.name || 'Unknown Contract')
    })
  })

  // Process dependencies data
  const dependenciesMap = new Map<string, DependencyData>()

  if (functions.contracts) {
    Object.entries(functions.contracts).forEach(
      ([contractAddress, contractData]: [string, any]) => {
        contractData.functions.forEach((func: any) => {
          // Only process functions that have dependencies and required scoring attributes
          if (
            func.dependencies &&
            func.dependencies.length > 0 &&
            func.impact
          ) {
            func.dependencies.forEach((dep: { contractAddress: string }) => {
              const depAddress = dep.contractAddress

              // Get likelihood from contract tags
              const normalizedAddress = depAddress
                .replace('eth:', '')
                .toLowerCase()
              const tag = contractTags.tags.find(
                (tag) =>
                  tag.contractAddress.toLowerCase() === normalizedAddress,
              )

              // Skip if not external or no likelihood
              if (!tag?.isExternal || !tag.likelihood) {
                return
              }

              // Calculate grade for this function
              const grade = getSeverityGrade(
                func.impact as Impact,
                tag.likelihood,
              )

              // Get or create dependency entry
              if (!dependenciesMap.has(depAddress)) {
                dependenciesMap.set(depAddress, {
                  contractAddress: depAddress,
                  contractName:
                    contractNameMap.get(depAddress) || 'Unknown Contract',
                  likelihood: tag.likelihood,
                  functions: [],
                })
              }

              // Add function to dependency
              const depData = dependenciesMap.get(depAddress)!
              depData.functions.push({
                contractAddress,
                contractName:
                  contractNameMap.get(contractAddress) || 'Unknown Contract',
                functionName: func.functionName,
                impact: func.impact as Impact,
                grade,
              })
            })
          }
        })
      },
    )
  }

  const dependencies = Array.from(dependenciesMap.values())

  // Calculate overall worst grade
  const allGrades = dependencies.flatMap((dep) =>
    dep.functions.map((f) => f.grade),
  )
  const overallGrade = getWorstGrade(allGrades)

  if (dependencies.length === 0) {
    return (
      <div className="border-b border-b-coffee-600 pb-2">
        <h2 className="p-2 font-bold text-orange-400 text-xl">Dependencies</h2>
        <div className="mb-1 flex flex-col gap-2 border-transparent border-l-4 p-2 pl-1">
          <p className="ml-4 text-coffee-400 text-sm">
            No external dependencies with scored functions
          </p>
        </div>
      </div>
    )
  }

  const overallGradeColor = overallGrade ? getGradeColor(overallGrade) : ''

  return (
    <div className="border-b border-b-coffee-600 pb-2">
      <h2 className="p-2 font-bold text-orange-400 text-xl">Dependencies</h2>
      <div className="mb-1 flex flex-col gap-2 border-transparent border-l-4 p-2 pl-1">
        {/* Overall grade */}
        <div className="mb-3 ml-4 flex items-center gap-2">
          <span className="font-medium text-coffee-300 text-sm">
            Overall Grade:
          </span>
          {overallGrade && (
            <span className={`font-semibold text-lg ${overallGradeColor}`}>
              {overallGrade}
            </span>
          )}
          <span className="ml-2 text-coffee-400 text-xs">
            ({dependencies.length} external contract
            {dependencies.length !== 1 ? 's' : ''})
          </span>
        </div>

        {/* Dependencies list */}
        <div className="ml-2">
          {dependencies.map((dep) => (
            <DependencySection
              key={dep.contractAddress}
              dependency={dep}
              onUpdateLikelihood={(contractAddress, likelihood) => {
                updateLikelihoodMutation.mutate({ contractAddress, likelihood })
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
