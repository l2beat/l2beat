import type { CompiledReview, CompiledAdmin } from '../../../../types'
import { etherscanUrl, stripChainPrefix } from '../../../../utils/format'
import { MitigationBadge } from '../../../../components/MitigationBadge'
import { deduplicateMitigations } from '../explorer/shared'
import {
  ImpactBarRow,
  ImpactStatsSidebar,
  SectionHeader,
  ShowMoreButton,
  impactPct,
} from './_shared'

interface AdminsSectionProps {
  review: CompiledReview
  onShowMore: () => void
}

const TYPE_BADGE: Record<string, { label: string; bg: string; text: string }> = {
  EOA: { label: 'EOA', bg: 'bg-accent/10', text: 'text-accent' },
  EOAPermissioned: { label: 'EOA', bg: 'bg-accent/10', text: 'text-accent' },
  Multisig: { label: 'Multisig', bg: 'bg-amber-100', text: 'text-amber-700' },
  Timelock: { label: 'Timelock', bg: 'bg-text-primary/5', text: 'text-text-muted' },
  Contract: { label: 'Contract', bg: 'bg-text-primary/5', text: 'text-text-muted' },
  Immutable: { label: 'Immutable', bg: 'bg-green-100', text: 'text-green-700' },
  Upgradeable: { label: 'Upgradeable', bg: 'bg-purple-100', text: 'text-purple-700' },
  Revoked: { label: 'Revoked', bg: 'bg-text-primary/5', text: 'text-text-muted' },
}

function AdminTypeBadge({ type }: { type: string }) {
  const cfg = TYPE_BADGE[type] ?? { label: type, bg: 'bg-text-primary/5', text: 'text-text-muted' }
  return (
    <span className={`inline-flex items-center px-[8px] py-[2px] rounded-sm text-[9px] font-bold uppercase tracking-[0.225px] ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  )
}

function isHumanType(a: CompiledAdmin): boolean {
  return (
    a.adminType === 'EOA' ||
    a.adminType === 'EOAPermissioned' ||
    a.adminType === 'Multisig' ||
    a.adminType === 'Timelock'
  )
}

const RISK_ORDER: Record<string, number> = {
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

function sortByRisk(admins: CompiledAdmin[]): CompiledAdmin[] {
  return [...admins].sort((a, b) => {
    const diff = b.totalReachableCapital - a.totalReachableCapital
    if (diff !== 0) return diff
    return (RISK_ORDER[a.adminType] ?? 5) - (RISK_ORDER[b.adminType] ?? 5)
  })
}

export function AdminsSection({ review, onShowMore }: AdminsSectionProps) {
  const { admins, totals } = review
  const totalTvs = totals.totalCapitalAtRisk + (totals.totalTokenValue ?? 0)

  const humanControlled = sortByRisk(
    admins.filter((a) => isHumanType(a) && !a.isGovernance),
  )
  const governance = sortByRisk(admins.filter((a) => a.isGovernance))
  const activeAdmins = [...humanControlled, ...governance]

  const noHumanControl = activeAdmins.length === 0

  // If no admins at all, or no human/governance control — show immutable empty state
  if (admins.length === 0 || noHumanControl) {
    return (
      <div className="bg-bg-card border border-border rounded-lg p-5 sm:p-[33px] flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <svg className="size-3.5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </svg>
          <span className="font-bold text-[11px] uppercase text-text-muted tracking-[1.2px]">Administrative Control</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-[30px] items-start">
          <div className="flex-1 min-w-0 bg-white border border-border rounded-lg p-[33px] flex flex-col items-center justify-center gap-4 min-h-[220px]">
            <svg className="size-14 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
            <p className="text-sm text-text-muted">No permissioned resources</p>
          </div>
          <ImpactStatsSidebar
            stats={[
              {
                label: 'Impacted TVS',
                value: '0%',
                description: 'Proportion of TVS subject to admin control.',
              },
              { label: 'Admins Detected', value: '0' },
            ]}
          />
        </div>
      </div>
    )
  }

  // Sort all admins by total reachable impact (TVL + token value) descending for top-3.
  // Multisigs that only control token emissions (no TVL reach) still surface here.
  const adminImpact = (a: CompiledAdmin) =>
    a.totalReachableCapital + (a.totalReachableTokenValue ?? 0)
  const sortedByImpact = [...activeAdmins].sort(
    (a, b) => adminImpact(b) - adminImpact(a),
  )
  const maxCapital = Math.max(...sortedByImpact.map(adminImpact), 0)
  // Use pre-computed cross-admin deduplicated totals from the compiler,
  // falling back to raw sum for old compiled reviews.
  const impactedCapital = review.adminTotals
    ? review.adminTotals.totalFundsAtRisk + review.adminTotals.totalTokenValueAtRisk
    : sortedByImpact.reduce((s, a) => s + a.totalReachableCapital, 0)
  const impactedPct = impactPct(impactedCapital, totalTvs)
  const displayedAdmins = sortedByImpact.slice(0, 3)

  return (
    <div className="bg-bg-card border border-border rounded-lg p-5 sm:p-[33px] flex flex-col gap-6">
      {/* Section label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="size-3.5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </svg>
          <span className="font-bold text-[11px] uppercase text-text-muted tracking-[1.2px]">
            Administrative Control
          </span>
        </div>
        <ShowMoreButton onClick={onShowMore} />
      </div>
      <div className="flex flex-col sm:flex-row gap-[30px] items-start">
      {/* Left: bar chart card — contains header + rows */}
      <div className="flex-1 min-w-0 bg-white border border-border rounded-lg p-5 sm:p-[33px] flex flex-col gap-6">
        <SectionHeader
          icon={
            <svg className="size-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
          }
          label="Top Admins"
        />
        <div className="flex flex-col gap-6">
          {displayedAdmins.map((admin) => {
            const rowImpact = adminImpact(admin)
            const barWidth = maxCapital > 0 ? (rowImpact / maxCapital) * 100 : 0
            const rawAddress = stripChainPrefix(admin.address)
            const mitigations = deduplicateMitigations(
              admin.functions?.flatMap((f) => f.mitigations ?? []) ?? [],
            )
            return (
              <ImpactBarRow
                key={admin.address}
                title={admin.name}
                impactUsd={rowImpact}
                barPercent={barWidth}
                badges={
                  <>
                    <a
                      href={etherscanUrl(admin.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-accent"
                      title={rawAddress}
                    >
                      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                    <AdminTypeBadge type={admin.adminType} />
                    {admin.isGovernance && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-[0.5px] bg-blue-100 text-blue-700">
                        Governance
                      </span>
                    )}
                    {(() => {
                      const MAX_BADGES = 4
                      const visible = mitigations.slice(0, MAX_BADGES)
                      const remaining = mitigations.length - visible.length
                      return (
                        <>
                          {visible.map((m, i) => (
                            <MitigationBadge key={i} mitigation={m} />
                          ))}
                          {remaining > 0 && (
                            <span
                              className="shrink-0 text-text-muted text-[10px] leading-4 ml-0.5"
                              title={`${mitigations.length} unique mitigations total`}
                            >
                              +{remaining}
                            </span>
                          )}
                        </>
                      )
                    })()}
                  </>
                }
              />
            )
          })}
        </div>
      </div>

      <ImpactStatsSidebar
        stats={[
          {
            label: 'Impacted TVS',
            value: `${impactedPct}%`,
            description: 'Proportion of TVS subject to admin control.',
          },
          { label: 'Admins Detected', value: activeAdmins.length },
        ]}
      />
      </div>
    </div>
  )
}

