import { useState } from 'react'
import { clsx } from 'clsx'
import { Badge } from '../../../../components/Badge'
import { AddressDisplay } from '../../../../components/AddressDisplay'
import { UsdValue } from '../../../../components/UsdValue'
import { GlossaryTooltip } from '../../../../components/GlossaryTooltip'
import { generateAdminNarrative } from '../../../../utils/narrative'
import type {
  CompiledReview,
  CompiledAdmin,
  CompiledAdminFunction,
} from '../../../../types'

interface AdminCardsProps {
  review: CompiledReview
}

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

/** Sort admins by risk: EOAs first, then Multisigs, then Timelocks, then contracts */
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
    const aOrder = riskOrder[a.adminType] ?? 5
    const bOrder = riskOrder[b.adminType] ?? 5
    if (aOrder !== bOrder) return aOrder - bOrder
    // Secondary sort: higher capital first
    return b.totalDirectCapital - a.totalDirectCapital
  })
}

export function AdminCards({ review }: AdminCardsProps) {
  const { admins, totals } = review

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

  // Categorize admins into "human-controlled" vs "internal"
  const humanControlled = sorted.filter(
    (a) =>
      a.adminType === 'EOA' ||
      a.adminType === 'EOAPermissioned' ||
      a.adminType === 'Multisig' ||
      a.adminType === 'Timelock',
  )
  const internalOrOther = sorted.filter(
    (a) =>
      a.adminType !== 'EOA' &&
      a.adminType !== 'EOAPermissioned' &&
      a.adminType !== 'Multisig' &&
      a.adminType !== 'Timelock',
  )

  const allImmutable =
    admins.length > 0 &&
    admins.every(
      (a) =>
        a.adminType === 'Revoked' ||
        a.adminType === 'Contract' ||
        a.adminType === 'Untemplatized' ||
        a.adminType === 'Immutable',
    )

  return (
    <div>
      <p className="text-lg text-text-secondary leading-relaxed max-w-3xl mb-8">
        {allImmutable ? (
          <>
            This protocol has{' '}
            <span className="font-semibold text-text-primary">
              {totals.permissionedFunctionCount} permissioned functions
            </span>
            , but all admin controls resolve to immutable contracts or revoked
            addresses. No permissioned functions can affect user funds.
          </>
        ) : (
          <>
            Who can change this protocol? We identified{' '}
            <span className="font-semibold text-text-primary">
              {admins.length} admin{admins.length !== 1 ? 's' : ''}
            </span>{' '}
            with permissioned access to{' '}
            <span className="font-semibold text-text-primary">
              {totals.permissionedFunctionCount} functions
            </span>
            , controlling{' '}
            <UsdValue value={totals.totalCapitalAtRisk} variant="capital" />
            {' '}in locked funds
            {totals.totalTokenValueAtRisk > 0 && (
              <>
                {' '}and{' '}
                <UsdValue
                  value={totals.totalTokenValueAtRisk}
                  variant="token"
                />{' '}
                in protocol tokens
              </>
            )}
            .
          </>
        )}
      </p>

      {/* Human-controlled admins -- the ones readers care about most */}
      {humanControlled.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Human-Controlled Admins
          </h3>
          <p className="text-sm text-text-secondary mb-4">
            These are the entities that a person or group of people can directly
            control. They represent the most significant centralization vectors.
          </p>
          <div className="space-y-4">
            {humanControlled.map((admin) => (
              <AdminCard key={admin.address} admin={admin} />
            ))}
          </div>
        </div>
      )}

      {/* Internal / contract admins */}
      {internalOrOther.length > 0 && (
        <InternalAdminsSection admins={internalOrOther} />
      )}
    </div>
  )
}

function AdminCard({ admin }: { admin: CompiledAdmin }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <GlossaryTooltip term={admin.adminType}>
                <Badge
                  variant="admin-type"
                  adminType={admin.adminType}
                >
                  {admin.adminType}
                </Badge>
              </GlossaryTooltip>
              {admin.isGovernance && (
                <GlossaryTooltip term="Governance">
                  <Badge variant="governance">Governance</Badge>
                </GlossaryTooltip>
              )}
              <h3 className="font-semibold text-text-primary text-lg">
                {admin.name}
              </h3>
            </div>
            <div className="mt-1">
              <AddressDisplay address={admin.address} />
            </div>
          </div>
          <div className="text-right shrink-0">
            {admin.totalDirectCapital > 0 && (
              <div>
                <UsdValue
                  value={admin.totalDirectCapital}
                  variant="capital"
                  className="text-lg font-semibold"
                />
                <p className="text-xs text-text-muted">funds locked</p>
              </div>
            )}
          </div>
        </div>

        {/* Narrative description -- the story */}
        <div className="mt-4 rounded-lg bg-bg-muted/60 p-4">
          <p className="text-sm font-medium text-text-primary mb-1">
            What does this mean?
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            {describeAdminType(admin.adminType)}{' '}
            {generateAdminNarrative(admin)}
          </p>
        </div>

        {/* Description from review config */}
        {admin.description && (
          <p className="mt-3 text-sm text-text-secondary leading-relaxed">
            {admin.description}
          </p>
        )}
      </div>

      {/* Functions -- progressive disclosure */}
      {admin.functions.length > 0 && (
        <div className="border-t border-border">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full px-5 py-3 flex items-center justify-between text-sm font-medium text-text-secondary hover:bg-bg-muted/40 transition-colors"
          >
            <span>
              {admin.functions.length} permissioned function
              {admin.functions.length !== 1 ? 's' : ''}
            </span>
            <svg
              className={clsx(
                'h-4 w-4 transition-transform',
                expanded && 'rotate-180',
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {expanded && (
            <div className="px-5 pb-4 space-y-2">
              {admin.functions.map((fn) => (
                <FunctionDetail
                  key={`${fn.contractAddress}-${fn.functionName}`}
                  fn={fn}
                />
              ))}
            </div>
          )}
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
              {riskyContracts.length !== 1 ? 's' : ''} with funds at risk.
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

function InternalAdminsSection({ admins }: { admins: CompiledAdmin[] }) {
  const [showAll, setShowAll] = useState(false)

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-semibold text-text-primary">
          Internal Protocol Contracts
        </h3>
        <span className="text-sm text-text-muted">({admins.length})</span>
      </div>
      <p className="text-sm text-text-secondary mb-4">
        These are smart contracts within the protocol that hold permissions for
        internal operations. They are not directly controlled by humans but
        execute protocol logic programmatically.
      </p>

      {!showAll ? (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="text-sm text-purple-600 hover:text-purple-800 transition-colors font-medium"
        >
          Show {admins.length} internal admin
          {admins.length !== 1 ? 's' : ''}
        </button>
      ) : (
        <div className="space-y-3">
          {admins.map((admin) => (
            <div
              key={admin.address}
              className="rounded-lg border border-border/60 bg-bg-muted/30 p-4"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="admin-type" adminType={admin.adminType}>
                  {admin.adminType}
                </Badge>
                <span className="font-medium text-text-primary text-sm">
                  {admin.name}
                </span>
                <AddressDisplay
                  address={admin.address}
                  className="text-xs"
                />
              </div>
              {admin.description && (
                <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                  {admin.description}
                </p>
              )}
              <p className="mt-1 text-xs text-text-muted">
                {admin.functions.length} function
                {admin.functions.length !== 1 ? 's' : ''}
                {admin.totalDirectCapital > 0 && (
                  <>
                    {' -- '}
                    <UsdValue
                      value={admin.totalDirectCapital}
                      variant="capital"
                      className="text-xs"
                    />
                  </>
                )}
              </p>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setShowAll(false)}
            className="text-sm text-purple-600 hover:text-purple-800 transition-colors font-medium"
          >
            Collapse
          </button>
        </div>
      )}
    </div>
  )
}
