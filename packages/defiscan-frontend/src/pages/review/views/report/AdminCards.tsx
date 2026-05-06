import { useState } from 'react'
import { Badge } from '../../../../components/Badge'
import { AddressDisplay } from '../../../../components/AddressDisplay'
import { UsdValue } from '../../../../components/UsdValue'
import { GlossaryTooltip } from '../../../../components/GlossaryTooltip'
import { generateAdminNarrative } from '../../../../utils/narrative'
import { formatUsdValue } from '../../../../utils/format'
import {
  type CompiledReview,
  type CompiledAdmin,
  type CompiledAdminFunction,
} from '../../../../types'
import { MitigationBadge } from '../../../../components/MitigationBadge'
import { aggregateMitigationsByImpact } from '../explorer/shared'

interface AdminCardsProps {
  review: CompiledReview
  forceExpanded?: boolean
}

const ADMIN_BAR_COLORS = [
  '#EF4444',
  '#F97316',
  '#F59E0B',
  '#FBBF24',
  '#A78BFA',
  '#10B981',
]

/** Describe what an admin type means in plain language */
function describeAdminType(adminType: string): string {
  switch (adminType) {
    case 'EOA':
      return 'This is an Externally Owned Account -- a single private key controlled by one person or entity. If this key is compromised, the attacker gains full control.'
    case 'EOAPermissioned':
      return 'This is a permissioned EOA -- an externally owned account that has been granted specific admin rights. It represents a single point of failure.'
    case 'Multisig':
      return 'This is a multi-signature wallet requiring multiple parties to approve transactions. While safer than a single key, it still requires trust in the signer set.'
    case 'Timelock':
      return 'This is a timelock contract that enforces a mandatory waiting period before changes take effect, giving users time to react to proposed changes.'
    case 'Contract':
    case 'Untemplatized':
      return 'This is a smart contract with admin privileges. Its behavior is determined by its code logic rather than human decisions.'
    case 'Immutable':
      return 'This is an immutable smart contract whose code cannot be changed after deployment. Its admin privileges are exercised purely through fixed on-chain logic.'
    case 'Upgradeable':
      return 'This is an upgradeable smart contract whose logic can be changed by whoever controls the upgrade mechanism.'
    case 'Diamond':
      return 'This is a Diamond proxy contract that can have its logic upgraded through facet additions, replacements, or removals.'
    case 'Revoked':
      return 'This admin address has been revoked or set to the zero address, meaning no entity can exercise these permissions.'
    default:
      return 'This is a contract-based admin with programmatic control over specific protocol functions.'
  }
}

/** Sort admins by funds at risk (descending), then by admin type as tiebreaker */
function sortAdminsByRisk(admins: CompiledAdmin[]): CompiledAdmin[] {
  const riskOrder: Record<string, number> = {
    EOA: 0,
    EOAPermissioned: 1,
    Multisig: 2,
    Timelock: 3,
    Upgradeable: 4,
    Diamond: 4,
    Contract: 5,
    Immutable: 5,
    Untemplatized: 6,
    Revoked: 7,
  }

  return [...admins].sort((a, b) => {
    const fundsDiff = b.totalReachableCapital - a.totalReachableCapital
    if (fundsDiff !== 0) return fundsDiff
    // Tiebreaker: riskier admin types first
    const aOrder = riskOrder[a.adminType] ?? 5
    const bOrder = riskOrder[b.adminType] ?? 5
    return aOrder - bOrder
  })
}

export function AdminCards({ review, forceExpanded }: AdminCardsProps) {
  const { admins, totals } = review
  const [expandedAdmins, setExpandedAdmins] = useState<Set<string>>(new Set())

  if (admins.length === 0) {
    return (
      <div className="rounded-xl border border-status-green/30 bg-status-green/5 p-6">
        <p className="text-status-green font-semibold">
          No external admins detected.
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          This protocol appears to have no human-controlled administrative
          permissions. All contracts are either immutable or controlled by
          internal protocol logic.
        </p>
      </div>
    )
  }

  const sorted = sortAdminsByRisk(admins)

  const isHumanType = (a: CompiledAdmin) =>
    a.adminType === 'EOA' ||
    a.adminType === 'EOAPermissioned' ||
    a.adminType === 'Multisig' ||
    a.adminType === 'Timelock'

  const humanControlled = sorted.filter(
    (a) => isHumanType(a) && !a.isGovernance,
  )
  const governance = sorted.filter((a) => a.isGovernance)

  const noHumanControl = humanControlled.length === 0 && governance.length === 0

  function toggleAdmin(key: string) {
    setExpandedAdmins((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const humanTotal = humanControlled.reduce(
    (sum, a) => sum + a.totalReachableCapital,
    0,
  )
  const govTotal = governance.reduce((sum, a) => sum + a.totalReachableCapital, 0)

  return (
    <div>
      {noHumanControl ? (
        <div className="rounded-xl border border-status-green/30 bg-status-green/5 px-6 py-5 mb-8 max-w-3xl">
          <p className="text-lg font-semibold text-status-green mb-1">
            No Admins
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            All admin controls resolve to immutable contracts or revoked
            addresses. No permissioned functions can affect user funds.
          </p>
        </div>
      ) : (
        <p className="text-lg text-text-secondary leading-relaxed max-w-3xl mb-8">
          Who can change this protocol? We identified{' '}
          <span className="font-semibold text-text-primary">
            {humanControlled.length + governance.length} admin{humanControlled.length + governance.length !== 1 ? 's' : ''}
          </span>{' '}
          with permissioned access to{' '}
          <span className="font-semibold text-text-primary">
            {totals.permissionedFunctionCount} functions
          </span>
          , controlling{' '}
          <UsdValue value={totals.totalCapitalAtRisk} variant="capital" /> in
          TVL
          {totals.totalTokenValueAtRisk > 0 && (
            <>
              {' '}
              and{' '}
              <UsdValue value={totals.totalTokenValueAtRisk} variant="token" />{' '}
              in protocol tokens
            </>
          )}
          .
        </p>
      )}

      {/* Human-controlled admins */}
      {humanControlled.length > 0 && (
        <AdminDistributionChart
          title="Admins"
          subtitle="These are the entities that a person or group of people can directly control."
          admins={humanControlled}
          totalCapital={humanTotal}
          expandedSet={expandedAdmins}
          onToggle={toggleAdmin}
          forceExpanded={forceExpanded}
        />
      )}

      {/* Governance admins */}
      {governance.length > 0 && (
        <div className={humanControlled.length > 0 ? 'mt-6' : ''}>
          <AdminDistributionChart
            title="Governance"
            subtitle="These are onchain governance contracts that manage protocol changes through different voting mechanisms."
            admins={governance}
            totalCapital={govTotal}
            expandedSet={expandedAdmins}
            onToggle={toggleAdmin}
            forceExpanded={forceExpanded}
          />
        </div>
      )}
    </div>
  )
}

function AdminDistributionChart({
  title,
  subtitle,
  admins,
  totalCapital,
  expandedSet,
  onToggle,
  forceExpanded,
}: {
  title: string
  subtitle: string
  admins: CompiledAdmin[]
  totalCapital: number
  expandedSet: Set<string>
  onToggle: (key: string) => void
  forceExpanded?: boolean
}) {
  const maxCapital = Math.max(...admins.map((a) => a.totalReachableCapital), 0)

  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-text-primary mb-1">
        {title}
      </h3>
      <p className="text-sm text-text-secondary mb-4">{subtitle}</p>
      <div className="space-y-3">
        {admins.map((admin, index) => {
          const percentage =
            maxCapital > 0 ? (admin.totalReachableCapital / maxCapital) * 100 : 0
          const expandKey = `admin-${admin.address}`
          const isExpanded = forceExpanded || expandedSet.has(expandKey)

          return (
            <div key={expandKey} id={expandKey}>
              <button
                type="button"
                onClick={() => onToggle(expandKey)}
                className="w-full text-left cursor-pointer group"
              >
                <div className="flex items-center justify-between text-sm mb-1 gap-2">
                  <span className="text-text-primary font-medium truncate flex items-center gap-1.5">
                    <span className="text-text-muted text-xs" data-print-hide>
                      {isExpanded ? '\u25BC' : '\u25B6'}
                    </span>
                    <GlossaryTooltip term={admin.adminType}>
                      <Badge variant="admin-type" adminType={admin.adminType}>
                        {admin.adminType}
                      </Badge>
                    </GlossaryTooltip>
                    {admin.isGovernance && (
                      <GlossaryTooltip term="Governance">
                        <Badge variant="governance">Governance</Badge>
                      </GlossaryTooltip>
                    )}
                    {admin.name}
                    {(() => {
                      const unique = aggregateMitigationsByImpact(
                        admin.functions,
                      )
                      const MAX_BADGES = 4
                      const visible = unique.slice(0, MAX_BADGES)
                      const remaining = unique.length - visible.length
                      return (
                        <>
                          {visible.map((m, i) => (
                            <MitigationBadge key={i} mitigation={m} />
                          ))}
                          {remaining > 0 && (
                            <span
                              className="shrink-0 text-text-muted text-[10px] leading-4 ml-0.5"
                              title={`${unique.length} unique mitigations total`}
                            >
                              +{remaining}
                            </span>
                          )}
                        </>
                      )
                    })()}
                  </span>
                  <span className="font-semibold shrink-0 text-capital">
                    {formatUsdValue(admin.totalReachableCapital)}
                  </span>
                </div>
                {totalCapital > 0 && (
                  <div className="h-3 rounded-full bg-bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.max(percentage, 1)}%`,
                        backgroundColor:
                          ADMIN_BAR_COLORS[index % ADMIN_BAR_COLORS.length],
                      }}
                    />
                  </div>
                )}
              </button>

              {isExpanded && <AdminExpandedContent admin={admin} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AdminExpandedContent({ admin }: { admin: CompiledAdmin }) {
  return (
    <div className="mt-2 ml-6 rounded-lg border border-border/60 bg-bg-muted/30 p-5 space-y-4">
      <div>
        <AddressDisplay address={admin.address} />
      </div>

      {admin.isGovernance && (
        <div className="flex items-center gap-2">
          <Badge variant="governance">Governance</Badge>
          <span className="text-sm text-text-secondary">
            On-chain governance contract
          </span>
        </div>
      )}

      {/* Risk narrative */}
      <div>
        <p className="text-sm text-text-secondary leading-relaxed">
          {describeAdminType(admin.adminType)} {generateAdminNarrative(admin)}
        </p>
      </div>

      {/* Description from review config */}
      {admin.description && (
        <p className="text-sm text-text-secondary leading-relaxed">
          {admin.description}
        </p>
      )}

      {/* Permissioned functions */}
      {admin.functions.length > 0 && (
        <div className="pt-2 border-t border-border/40">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5">
            {admin.functions.length} permissioned function
            {admin.functions.length !== 1 ? 's' : ''}
          </p>
          <div className="space-y-2">
            {admin.functions.map((fn) => (
              <FunctionDetail
                key={`${fn.contractAddress}-${fn.functionName}`}
                fn={fn}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function FunctionDetail({ fn }: { fn: CompiledAdminFunction }) {
  const [showReachable, setShowReachable] = useState(false)
  const hasReachable = fn.reachableContracts.length > 0
  const riskyContracts = fn.reachableContracts.filter((r) => r.fundsAtRisk)

  return (
    <div className="rounded-lg border border-border/50 bg-bg-muted/30 px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm">
          <span className="text-text-muted">{fn.contractName}.</span>
          <span className="text-text-primary font-semibold font-mono">
            {fn.functionName}()
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs shrink-0">
          {fn.directFundsUsd > 0 && (
            <UsdValue
              value={fn.directFundsUsd}
              variant="capital"
              className="text-xs"
            />
          )}
        </div>
      </div>

      {/* Mitigations */}
      {fn.mitigations && fn.mitigations.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {fn.mitigations.map((m, i) => (
            <MitigationBadge key={i} mitigation={m} />
          ))}
        </div>
      )}

      {/* Narrative of impact */}
      {(fn.directFundsUsd > 0 || riskyContracts.length > 0) && (
        <p className="mt-2 text-xs text-text-secondary leading-relaxed">
          {fn.directFundsUsd > 0 && (
            <>
              This function has direct access to a contract holding{' '}
              <UsdValue
                value={fn.directFundsUsd}
                variant="capital"
                className="text-xs"
              />
              .{' '}
            </>
          )}
          {riskyContracts.length > 0 && (
            <>
              It can also reach {riskyContracts.length} additional contract
              {riskyContracts.length !== 1 ? 's' : ''} with TVL at risk.
            </>
          )}
        </p>
      )}

      {hasReachable && (
        <button
          type="button"
          onClick={() => setShowReachable(!showReachable)}
          className="mt-2 text-xs text-purple-600 hover:text-purple-800 transition-colors"
        >
          {showReachable ? 'Hide' : 'Show'} {fn.reachableContracts.length}{' '}
          reachable contract{fn.reachableContracts.length !== 1 ? 's' : ''}
        </button>
      )}

      {showReachable && (
        <ul className="mt-2 space-y-1 text-xs">
          {fn.reachableContracts.map((rc) => (
            <li
              key={rc.address}
              className="flex items-center justify-between py-1 px-2 rounded bg-white/50"
            >
              <span
                className={
                  rc.fundsAtRisk
                    ? 'text-text-primary font-medium'
                    : 'text-text-muted'
                }
              >
                {rc.name}
                {rc.viewOnlyPath && (
                  <span className="ml-1 text-text-muted">(read-only)</span>
                )}
              </span>
              <span className="text-text-muted">
                {rc.calledFunctions.join(', ')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
