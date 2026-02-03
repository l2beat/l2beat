/**
 * Shared utility functions and components for V2 scoring UI
 * Used by AdminsInventoryBreakdown, DependencyInventoryBreakdown, etc.
 */
import { useEffect, useMemo, useState } from 'react'
import type {
  AdminDetailWithCapital,
  ApiAddressType,
  FunctionCapitalAnalysis,
  Impact,
  LetterGrade,
  Likelihood,
} from '../api/types'
import { ProxyTypeTag } from '../apps/discovery/defidisco/ProxyTypeTag'
import { usePanelStore } from '../apps/discovery/store/panel-store'

// ─── Pure utility functions ───────────────────────────────────────────────────

export function formatUsdValue(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`
  }
  if (value > 0) {
    return `$${value.toFixed(2)}`
  }
  return '$0'
}

export function hasCapitalData(admin: any): admin is AdminDetailWithCapital {
  return (
    'totalReachableCapital' in admin &&
    typeof admin.totalReachableCapital === 'number'
  )
}

export function isZeroAddress(address: string): boolean {
  const normalized = address.toLowerCase().replace('eth:', '')
  return normalized === '0x0000000000000000000000000000000000000000'
}

export function getGradeColor(grade: LetterGrade): string {
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

export function getGradeBadgeStyles(grade: LetterGrade): {
  backgroundColor: string
  borderColor: string
  color: string
} {
  switch (grade) {
    case 'AAA':
    case 'AA':
    case 'A':
      return {
        backgroundColor: 'rgba(20, 83, 45, 0.5)',
        borderColor: 'rgba(34, 197, 94, 0.3)',
        color: '#4ade80',
      }
    case 'BBB':
    case 'BB':
    case 'B':
      return {
        backgroundColor: 'rgba(113, 63, 18, 0.5)',
        borderColor: 'rgba(234, 179, 8, 0.3)',
        color: '#facc15',
      }
    case 'CCC':
    case 'CC':
    case 'C':
      return {
        backgroundColor: 'rgba(124, 45, 18, 0.5)',
        borderColor: 'rgba(249, 115, 22, 0.3)',
        color: '#fb923c',
      }
    case 'D':
      return {
        backgroundColor: 'rgba(127, 29, 29, 0.5)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
        color: '#f87171',
      }
  }
}

export function getAdminTypeColor(type: ApiAddressType): string {
  switch (type) {
    case 'EOA':
    case 'EOAPermissioned':
      return '#f87171'
    case 'Multisig':
      return '#fbbf24'
    case 'Timelock':
      return '#10b981'
    case 'Contract':
    case 'Diamond':
      return '#60a5fa'
    default:
      return '#9ca3af'
  }
}

export function getImpactColor(impact: string): string {
  switch (impact) {
    case 'critical':
      return '#c084fc'
    case 'high':
      return '#f87171'
    case 'medium':
      return '#fbbf24'
    case 'low':
      return '#10b981'
    default:
      return '#9ca3af'
  }
}

export function getLikelihoodColor(likelihood: string): string {
  switch (likelihood) {
    case 'high':
      return '#f87171'
    case 'medium':
      return '#fb923c'
    case 'low':
      return '#10b981'
    case 'mitigated':
      return '#60a5fa'
    default:
      return '#9ca3af'
  }
}

export function impactToScore(
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
 * Calculate worst grade among a list of functions
 */
export function computeWorstGrade(
  functions: { grade?: LetterGrade }[],
): LetterGrade | null {
  const gradeValues: Record<LetterGrade, number> = {
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
    Unscored: 0,
  }
  return functions
    .filter((f) => f.grade)
    .reduce((worst: LetterGrade | null, f) => {
      if (!worst) return f.grade!
      return gradeValues[f.grade!] < gradeValues[worst] ? f.grade! : worst
    }, null)
}

// ─── Tree structure constants ─────────────────────────────────────────────────

export const TREE_BRANCH = '├──'
export const TREE_LAST = '└──'
export const TREE_PIPE = '│  '
export const TREE_SPACE = '   '

// ─── Shared React components ──────────────────────────────────────────────────

export function TreeNode({
  prefix,
  children,
  onClick,
  className = '',
}: {
  prefix: string
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <div className={`flex items-start font-mono text-xs ${className}`}>
      <span className="mr-1 whitespace-pre text-coffee-600">{prefix}</span>
      {onClick ? (
        <button
          onClick={onClick}
          className="text-left transition-colors hover:text-blue-400"
        >
          {children}
        </button>
      ) : (
        <span>{children}</span>
      )}
    </div>
  )
}

export function FundsDisplay({ value }: { value: number }) {
  if (value <= 0) return null
  return <span className="mr-1.5 text-coffee-400">{formatUsdValue(value)}</span>
}

export function TokenValueDisplay({ value }: { value: number }) {
  if (value <= 0) return null
  return <span className="mr-1.5 text-aux-yellow">{formatUsdValue(value)}</span>
}

export function hasTokenValueData(admin: any): boolean {
  return (
    hasCapitalData(admin) &&
    'totalReachableTokenValue' in admin &&
    typeof admin.totalReachableTokenValue === 'number' &&
    admin.totalReachableTokenValue > 0
  )
}

/**
 * Compute deduplicated capital totals across multiple admins.
 * Avoids double-counting when the same contract is reachable by multiple admins.
 */
export function computeDeduplicatedCapital(admins: AdminDetailWithCapital[]): {
  totalFunds: number
  totalTokenValue: number
} {
  const contractMap = new Map<string, { funds: number; tokenValue: number }>()

  for (const admin of admins) {
    for (const funcAnalysis of admin.functionsWithCapital) {
      // Direct contract
      const directAddr = funcAnalysis.contractAddress.toLowerCase()
      if (!contractMap.has(directAddr)) {
        contractMap.set(directAddr, {
          funds: funcAnalysis.directFundsUsd,
          tokenValue: funcAnalysis.directTokenValueUsd,
        })
      }
      // Reachable contracts (only those with fundsAtRisk)
      for (const rc of funcAnalysis.reachableContracts) {
        if (!rc.fundsAtRisk) continue
        const addr = rc.contractAddress.toLowerCase()
        if (!contractMap.has(addr)) {
          contractMap.set(addr, {
            funds: rc.fundsUsd,
            tokenValue: rc.tokenValueUsd,
          })
        }
      }
    }
  }

  let totalFunds = 0
  let totalTokenValue = 0
  for (const { funds, tokenValue } of contractMap.values()) {
    totalFunds += funds
    totalTokenValue += tokenValue
  }

  return { totalFunds, totalTokenValue }
}

export function ImpactPicker({
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

export function LikelihoodPicker({
  currentLikelihood,
  onUpdate,
  allowUnscored = false,
}: {
  currentLikelihood?: Likelihood
  onUpdate: (likelihood: Likelihood) => void
  allowUnscored?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLikelihood, setSelectedLikelihood] = useState<Likelihood>(
    currentLikelihood || 'high',
  )
  const likelihoodOptions: Likelihood[] = ['high', 'medium', 'low', 'mitigated']

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

  const displayText =
    allowUnscored && !currentLikelihood ? 'unscored' : currentLikelihood
  const displayColor =
    allowUnscored && !currentLikelihood
      ? '#9ca3af'
      : getLikelihoodColor(currentLikelihood || 'high')

  return (
    <div className="relative inline-block">
      <button
        onClick={handleOpen}
        className="rounded border border-coffee-600 bg-coffee-700 px-2 py-0.5 text-xs capitalize hover:bg-coffee-600"
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
        </>
      )}
    </div>
  )
}

export function FunctionCapitalBreakdown({
  analysis,
  isLastFunction,
  parentPrefix,
}: {
  analysis: FunctionCapitalAnalysis
  isLastFunction: boolean
  parentPrefix: string
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const selectGlobal = usePanelStore((state) => state.select)

  const contractsAtRisk = analysis.reachableContracts.filter(
    (c) => c.fundsAtRisk,
  )
  const contractsNotAtRisk = analysis.reachableContracts.filter(
    (c) => !c.fundsAtRisk,
  )

  const hasReachable =
    contractsAtRisk.length > 0 || contractsNotAtRisk.length > 0
  if (!hasReachable) return null

  const childPrefix = parentPrefix + (isLastFunction ? TREE_SPACE : TREE_PIPE)

  return (
    <div className="font-mono text-xs">
      <div
        className="flex cursor-pointer items-start transition-colors hover:text-coffee-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="mr-1 whitespace-pre text-coffee-600">
          {childPrefix}
          {TREE_LAST}
        </span>
        <span className="flex items-center gap-1">
          <FundsDisplay value={analysis.directFundsUsd} />
          <TokenValueDisplay value={analysis.directTokenValueUsd} />
          <button
            onClick={(e) => {
              e.stopPropagation()
              selectGlobal(analysis.contractAddress)
            }}
            className="text-coffee-200 transition-colors hover:text-blue-400"
          >
            {analysis.contractName}
          </button>
          {analysis.unresolvedCallsCount > 0 && (
            <span className="text-yellow-500">
              (+{analysis.unresolvedCallsCount} unresolved)
            </span>
          )}
          <span className="text-coffee-600">{isExpanded ? '▼' : '▶'}</span>
        </span>
      </div>

      {isExpanded && (
        <div>
          {contractsAtRisk.map((contract, idx) => {
            const isLast =
              idx === contractsAtRisk.length - 1 &&
              contractsNotAtRisk.length === 0
            return (
              <TreeNode
                key={contract.contractAddress}
                prefix={`${childPrefix}${TREE_SPACE}${isLast ? TREE_LAST : TREE_BRANCH}`}
                onClick={() => selectGlobal(contract.contractAddress)}
                className={
                  contract.viewOnlyPath ? 'text-coffee-400' : 'text-coffee-200'
                }
              >
                <FundsDisplay value={contract.fundsUsd} />
                <TokenValueDisplay value={contract.tokenValueUsd} />
                <span>{contract.contractName}</span>
                {contract.viewOnlyPath && (
                  <span className="ml-1 text-coffee-600 italic">
                    (view-only)
                  </span>
                )}
                {contract.calledFunctions &&
                  contract.calledFunctions.length > 0 && (
                    <span className="ml-1 text-coffee-500">
                      → {contract.calledFunctions.join(', ')}
                    </span>
                  )}
              </TreeNode>
            )
          })}

          {contractsNotAtRisk.length > 0 && (
            <>
              <TreeNode
                prefix={`${childPrefix}${TREE_SPACE}${TREE_BRANCH}`}
                className="text-coffee-600"
              >
                Unscored (not counted):
              </TreeNode>
              {contractsNotAtRisk.map((contract, idx) => {
                const isLast = idx === contractsNotAtRisk.length - 1
                return (
                  <TreeNode
                    key={contract.contractAddress}
                    prefix={`${childPrefix}${TREE_SPACE}${TREE_PIPE}${isLast ? TREE_LAST : TREE_BRANCH}`}
                    onClick={() => selectGlobal(contract.contractAddress)}
                    className="text-coffee-600"
                  >
                    {contract.fundsUsd > 0 && (
                      <span className="mr-1 text-coffee-600 line-through">
                        {formatUsdValue(contract.fundsUsd)}
                      </span>
                    )}
                    <span>{contract.contractName}</span>
                    {contract.calledFunctions &&
                      contract.calledFunctions.length > 0 && (
                        <span className="ml-1">
                          → {contract.calledFunctions.join(', ')}
                        </span>
                      )}
                  </TreeNode>
                )
              })}
            </>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Owner/Admin section component - displays functions for a single owner address.
 * Used by both the Owners section and the Dependencies section (for external owners).
 */
export function OwnerSection({
  admin,
  proxyType,
  onUpdateLikelihood,
  onUpdateImpact,
}: {
  admin: any
  proxyType?: string
  onUpdateLikelihood: (adminAddress: string, likelihood: Likelihood) => void
  onUpdateImpact: (
    contractAddress: string,
    functionName: string,
    impact: Impact,
  ) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const selectGlobal = usePanelStore((state) => state.select)
  const isRevoked = isZeroAddress(admin.adminAddress)

  const capitalMap = useMemo(() => {
    if (!hasCapitalData(admin))
      return new Map<string, FunctionCapitalAnalysis>()
    return new Map(
      admin.functionsWithCapital.map((fc: FunctionCapitalAnalysis) => [
        `${fc.contractAddress}:${fc.functionName}`,
        fc,
      ]),
    )
  }, [admin])

  const worstGrade =
    admin.functions.length > 0 && admin.likelihood
      ? computeWorstGrade(admin.functions)
      : null

  const badgeStyles = worstGrade ? getGradeBadgeStyles(worstGrade) : null

  return (
    <div className="mb-1 ml-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-2 rounded px-2 py-1 text-left transition-colors hover:bg-coffee-800/30"
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
        {isRevoked ? (
          <span
            className="inline-block rounded border px-1.5 py-0.5 font-semibold text-xs"
            style={{
              color: '#10b981',
              borderColor: '#10b98140',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
            }}
          >
            Revoked
          </span>
        ) : (
          <span
            className="inline-block rounded border px-1.5 py-0.5 text-xs capitalize"
            style={{
              color: getAdminTypeColor(admin.adminType),
              borderColor: getAdminTypeColor(admin.adminType) + '40',
            }}
          >
            {admin.adminType}
          </span>
        )}
        <ProxyTypeTag proxyType={proxyType} />
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (!isRevoked) selectGlobal(admin.adminAddress)
          }}
          className={`font-medium text-sm ${isRevoked ? 'cursor-default text-coffee-400' : 'cursor-pointer text-coffee-200 transition-colors hover:text-blue-400'}`}
        >
          {isRevoked ? '0x0000...0000' : admin.adminName}
        </button>
        <span className="mx-1 text-coffee-500 text-xs">|</span>
        <span className="text-coffee-400 text-xs">Likelihood:</span>
        <LikelihoodPicker
          currentLikelihood={admin.likelihood}
          onUpdate={(likelihood) =>
            onUpdateLikelihood(admin.adminAddress, likelihood)
          }
          allowUnscored={true}
        />
        <span className="ml-2 text-coffee-400 text-xs">
          ({admin.functions.length} function
          {admin.functions.length !== 1 ? 's' : ''})
        </span>
        {hasCapitalData(admin) && admin.totalReachableCapital > 0 && (
          <>
            <span className="mx-1 text-coffee-500 text-xs">|</span>
            <span className="font-medium text-green-400 text-xs">
              {formatUsdValue(admin.totalReachableCapital)} impacted
            </span>
          </>
        )}
        {hasTokenValueData(admin) && (
          <>
            <span className="mx-1 text-coffee-500 text-xs">|</span>
            <span className="font-medium text-aux-yellow text-xs">
              {formatUsdValue(admin.totalReachableTokenValue)} token
            </span>
          </>
        )}
        {hasCapitalData(admin) &&
          (admin.totalReachableCapital > 0 || hasTokenValueData(admin)) && (
            <span className="ml-1 text-coffee-500 text-xs">
              ({admin.uniqueContractsAffected} contract
              {admin.uniqueContractsAffected !== 1 ? 's' : ''})
            </span>
          )}
      </button>

      {isExpanded && (
        <div className="mt-2 ml-6">
          {admin.functions.map((func: any, idx: number) => {
            const isLastFunc = idx === admin.functions.length - 1
            const gradeBadgeStyles = func.grade
              ? getGradeBadgeStyles(func.grade)
              : null
            const capitalAnalysis = capitalMap.get(
              `${func.contractAddress}:${func.functionName}`,
            )

            const treePrefix = isLastFunc ? TREE_LAST : TREE_BRANCH

            const totalFundsForFunc = capitalAnalysis
              ? capitalAnalysis.directFundsUsd +
                capitalAnalysis.totalReachableFundsUsd
              : 0
            const totalTokenValueForFunc = capitalAnalysis
              ? capitalAnalysis.directTokenValueUsd +
                capitalAnalysis.totalReachableTokenValueUsd
              : 0

            return (
              <div key={idx} className="text-coffee-300">
                <div className="flex items-center font-mono text-xs">
                  <span className="mr-1 whitespace-pre text-coffee-600">
                    {treePrefix}
                  </span>
                  {gradeBadgeStyles ? (
                    <span
                      className="mr-1.5 inline-block rounded border px-1.5 py-0.5 text-xs"
                      style={{
                        backgroundColor: gradeBadgeStyles.backgroundColor,
                        borderColor: gradeBadgeStyles.borderColor,
                        color: gradeBadgeStyles.color,
                      }}
                    >
                      {func.grade}
                    </span>
                  ) : (
                    <span className="mr-1.5 inline-block px-1.5 py-0.5 text-coffee-500 text-xs">
                      -
                    </span>
                  )}
                  {totalFundsForFunc > 0 && (
                    <span className="mr-1.5 text-coffee-400">
                      {formatUsdValue(totalFundsForFunc)}
                    </span>
                  )}
                  {totalTokenValueForFunc > 0 && (
                    <span className="mr-1.5 text-aux-yellow">
                      {formatUsdValue(totalTokenValueForFunc)}
                    </span>
                  )}
                  <button
                    onClick={() => selectGlobal(func.contractAddress)}
                    className="cursor-pointer text-coffee-200 transition-colors hover:text-blue-400"
                  >
                    {func.contractName}
                  </button>
                  <span className="text-coffee-500">.</span>
                  <span className="text-blue-400">{func.functionName}()</span>
                  <span className="ml-2 text-coffee-500">(</span>
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
                  <span className="text-coffee-500">)</span>
                </div>
                {capitalAnalysis && (
                  <FunctionCapitalBreakdown
                    analysis={capitalAnalysis}
                    isLastFunction={isLastFunc}
                    parentPrefix=""
                  />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
