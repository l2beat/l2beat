import { useState, useEffect, useMemo } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import type { AdminModuleScore, LetterGrade, Likelihood, Impact, ApiAddressType } from '../api/types'
import { usePanelStore } from '../apps/discovery/store/panel-store'
import { useContractTags } from '../hooks/useContractTags'
import { updateContractTag, updateFunction, getProject } from '../api/api'
import { ProxyTypeTag } from '../apps/discovery/defidisco/ProxyTypeTag'
import { buildProxyTypeMap } from '../apps/discovery/defidisco/proxyTypeUtils'

interface AdminsInventoryBreakdownProps {
  score: AdminModuleScore
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
 * Get color value for admin type (inline style)
 */
function getAdminTypeColor(type: ApiAddressType): string {
  switch (type) {
    case 'EOA':
    case 'EOAPermissioned':
      return '#f87171' // red-400 (high risk)
    case 'Multisig':
      return '#fbbf24' // yellow-400 (medium risk)
    case 'Timelock':
      return '#10b981' // green-500 (lower risk)
    case 'Contract':
    case 'Diamond':
      return '#60a5fa' // blue-400 (depends on implementation)
    default:
      return '#9ca3af' // gray-400
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
function impactToScore(impact: Impact): 'low-risk' | 'medium-risk' | 'high-risk' | 'critical' {
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
        className="text-xs px-2 py-0.5 rounded border border-coffee-600 bg-coffee-700 hover:bg-coffee-600 capitalize"
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
          <div className="absolute right-0 z-50 mt-1 flex flex-col gap-2 rounded border border-coffee-600 bg-coffee-800 p-2 shadow-xl min-w-[120px]">
            <div className="text-xs font-semibold text-coffee-300">Impact</div>
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
 * Likelihood inline editor dropdown (with optional unscored state)
 */
function LikelihoodPicker({
  currentLikelihood,
  onUpdate,
  allowUnscored = false,
}: {
  currentLikelihood?: Likelihood
  onUpdate: (likelihood: Likelihood) => void
  allowUnscored?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLikelihood, setSelectedLikelihood] = useState<Likelihood>(currentLikelihood || 'high')
  const likelihoodOptions: Likelihood[] = ['high', 'medium', 'low', 'mitigated']

  // Sync internal state when prop changes
  useEffect(() => {
    if (currentLikelihood) {
      setSelectedLikelihood(currentLikelihood)
    }
  }, [currentLikelihood])

  const handleApply = () => {
    onUpdate(selectedLikelihood)
    setIsOpen(false)
  }

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  const displayText = allowUnscored && !currentLikelihood ? 'unscored' : currentLikelihood
  const displayColor = allowUnscored && !currentLikelihood ? '#9ca3af' : getLikelihoodColor(currentLikelihood || 'high')

  return (
    <div className="relative inline-block">
      <button
        onClick={handleOpen}
        className="text-xs px-2 py-0.5 rounded border border-coffee-600 bg-coffee-700 hover:bg-coffee-600 capitalize"
        style={{ color: displayColor }}
      >
        {displayText}
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
 * Admin section component - displays functions for a single admin address
 */
function AdminSection({
  admin,
  proxyType,
  onUpdateLikelihood,
  onUpdateImpact,
}: {
  admin: any
  proxyType?: string
  onUpdateLikelihood: (adminAddress: string, likelihood: Likelihood) => void
  onUpdateImpact: (contractAddress: string, functionName: string, impact: Impact) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const selectGlobal = usePanelStore((state) => state.select)

  // Calculate worst grade among all functions for this admin
  const worstGrade = admin.functions.length > 0 && admin.likelihood
    ? admin.functions
        .filter((func: any) => func.grade) // Only consider functions with grades
        .reduce((worst: LetterGrade | null, func: any) => {
          if (!worst) return func.grade
          const gradeValues: Record<LetterGrade, number> = {
            'AAA': 10, 'AA': 9, 'A': 8,
            'BBB': 7, 'BB': 6, 'B': 5,
            'CCC': 4, 'CC': 3, 'C': 2, 'D': 1
          }
          return gradeValues[func.grade] < gradeValues[worst] ? func.grade : worst
        }, null as LetterGrade | null)
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
        <span
          className="inline-block px-1.5 py-0.5 rounded border text-xs capitalize"
          style={{
            color: getAdminTypeColor(admin.adminType),
            borderColor: getAdminTypeColor(admin.adminType) + '40'
          }}
        >
          {admin.adminType}
        </span>
        <ProxyTypeTag proxyType={proxyType} />
        <button
          onClick={(e) => {
            e.stopPropagation()
            selectGlobal(admin.adminAddress)
          }}
          className="font-medium text-coffee-200 hover:text-blue-400 cursor-pointer transition-colors text-sm"
        >
          {admin.adminName}
        </button>
        <span className="text-coffee-500 text-xs mx-1">|</span>
        <span className="text-xs text-coffee-400">Likelihood:</span>
        <LikelihoodPicker
          currentLikelihood={admin.likelihood}
          onUpdate={(likelihood) => onUpdateLikelihood(admin.adminAddress, likelihood)}
          allowUnscored={true}
        />
        <span className="text-coffee-400 text-xs ml-2">
          ({admin.functions.length} function{admin.functions.length !== 1 ? 's' : ''})
        </span>
      </button>

      {isExpanded && (
        <ul className="ml-8 mt-2 space-y-1.5">
          {admin.functions.map((func: any, idx: number) => {
            const likelihoodColor = admin.likelihood ? getLikelihoodColor(admin.likelihood) : '#9ca3af'
            const gradeBadgeStyles = func.grade ? getGradeBadgeStyles(func.grade) : null

            return (
              <li key={idx} className="text-xs text-coffee-300 flex items-center gap-2">
                {gradeBadgeStyles ? (
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
                ) : (
                  <span className="inline-block px-1.5 py-0.5 text-xs text-coffee-500">
                    -
                  </span>
                )}
                <button
                  onClick={() => selectGlobal(func.contractAddress)}
                  className="font-medium text-coffee-200 hover:text-blue-400 cursor-pointer transition-colors"
                >
                  {func.contractName}
                </button>
                <span className="text-coffee-500">.</span>
                <span className="text-blue-400">{func.functionName}()</span>
                <span className="text-coffee-500 ml-2">(Impact: </span>
                <ImpactPicker
                  currentImpact={func.impact}
                  onUpdate={(impact) => onUpdateImpact(func.contractAddress, func.functionName, impact)}
                />
                <span className="text-coffee-500">, Likelihood: </span>
                {admin.likelihood ? (
                  <span style={{ color: likelihoodColor }}>{admin.likelihood}</span>
                ) : (
                  <span className="text-coffee-400">unscored</span>
                )}
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
 * Admins Inventory Breakdown Component
 * Displays breakdown of admins by address
 */
export function AdminsInventoryBreakdown({ score }: AdminsInventoryBreakdownProps) {
  const { project } = useParams()
  const queryClient = useQueryClient()
  const { data: contractTags } = useContractTags(project!)
  const gradeColor = getGradeColor(score.grade)

  // Fetch project data for proxy type information
  const { data: projectData } = useQuery({
    queryKey: ['projects', project],
    queryFn: () => getProject(project!),
    enabled: !!project,
  })

  // Build proxy type lookup map
  const proxyTypeMap = useMemo(() => buildProxyTypeMap(projectData), [projectData])

  // Mutation for updating likelihood
  const updateLikelihoodMutation = useMutation({
    mutationFn: ({ adminAddress, likelihood }: { adminAddress: string; likelihood: Likelihood }) => {
      if (!project) throw new Error('Project not found')

      // Get existing tag to preserve other attributes
      // IMPORTANT: Keep the eth: prefix for matching!
      const existingTag = contractTags?.tags.find(tag =>
        tag.contractAddress.toLowerCase() === adminAddress.toLowerCase()
      )

      return updateContractTag(project, {
        contractAddress: adminAddress,
        isExternal: existingTag?.isExternal ?? false,
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

  const handleUpdateLikelihood = (adminAddress: string, likelihood: Likelihood) => {
    updateLikelihoodMutation.mutate({ adminAddress, likelihood })
  }

  // Mutation for updating impact
  const updateImpactMutation = useMutation({
    mutationFn: ({ contractAddress, functionName, impact }: { contractAddress: string; functionName: string; impact: Impact }) => {
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

  const handleUpdateImpact = (contractAddress: string, functionName: string, impact: Impact) => {
    updateImpactMutation.mutate({ contractAddress, functionName, impact })
  }

  // Count functions across all admins
  const totalFunctionCount = score.breakdown
    ? score.breakdown.reduce((sum, admin) => sum + admin.functions.length, 0)
    : 0

  return (
    <div className="text-coffee-300">
      {/* Main header - non-expandable, consistent with other inventory items */}
      <div className="flex items-center justify-between">
        <span className="font-medium">Admins:</span>
        <span>
          {score.inventory}{' '}
          <span className={`font-semibold ${gradeColor}`}>
            (Grade: {score.grade})
          </span>
        </span>
      </div>

      {/* Admin breakdown - always shown */}
      <div className="mt-3 ml-2">
        {!score.breakdown || score.breakdown.length === 0 ? (
          <p className="text-xs text-coffee-400 ml-4">
            No permission owners found
          </p>
        ) : (
          <>
            <p className="text-xs text-coffee-400 ml-4 mb-3">
              {totalFunctionCount} permissioned function{totalFunctionCount !== 1 ? 's' : ''} controlled by {score.breakdown.length} admin{score.breakdown.length !== 1 ? 's' : ''}
            </p>
            {score.breakdown.map((admin) => (
              <AdminSection
                key={admin.adminAddress}
                admin={admin}
                proxyType={proxyTypeMap.get(admin.adminAddress.toLowerCase())}
                onUpdateLikelihood={handleUpdateLikelihood}
                onUpdateImpact={handleUpdateImpact}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
