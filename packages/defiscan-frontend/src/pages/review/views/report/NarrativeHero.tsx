import { clsx } from 'clsx'
import { formatUsdValue } from '../../../../utils/format'
import { computeRiskScore, riskLevelFromScore, type RiskLevel } from '../../../../utils/risk'
import type { CompiledReview } from '../../../../types'

interface NarrativeHeroProps {
  review: CompiledReview
}

export function NarrativeHero({ review }: NarrativeHeroProps) {
  const { metadata, totals } = review
  const riskScore = computeRiskScore(review)
  const riskLevel = riskLevelFromScore(riskScore)
  const risk = riskPresentation(riskLevel, review)

  return (
    <div>
      {/* Protocol description */}
      {metadata.description && (
        <p className="text-lg text-text-secondary leading-relaxed max-w-3xl">
          {metadata.description}
        </p>
      )}

      {/* Risk verdict banner */}
      <div
        className={clsx(
          'mt-8 rounded-2xl border-2 p-6',
          risk.bgColor,
          risk.borderColor,
        )}
      >
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-0.5">
            <RiskIndicator level={riskLevel} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className={clsx('text-xl font-bold', risk.color)}>
                {risk.label}
              </h2>
            </div>
            <p className="mt-2 text-text-primary leading-relaxed">
              {risk.summary}
            </p>
          </div>
        </div>
      </div>

      {/* At-a-glance metrics */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-text-secondary">Contracts</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            {totals.contractCount}
          </p>
          <p className="mt-1 text-sm text-text-muted">analyzed</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-text-secondary">Admins</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            {totals.adminCount}
          </p>
          <p className="mt-1 text-sm text-text-muted">with control</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-text-secondary">Capital at Risk</p>
          <p className="mt-1 text-2xl font-bold text-capital">
            {formatUsdValue(totals.totalCapitalAtRisk)}
          </p>
          <p className="mt-1 text-sm text-text-muted">in protocol</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-text-secondary">Dependencies</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            {totals.dependencyCount}
          </p>
          <p className="mt-1 text-sm text-text-muted">external</p>
        </div>
      </div>
    </div>
  )
}

function RiskIndicator({ level }: { level: RiskLevel }) {
  const colors: Record<string, { ring: string; fill: string }> = {
    MINIMAL: { ring: 'text-risk-minimal', fill: 'text-risk-minimal' },
    LOW: { ring: 'text-risk-low', fill: 'text-risk-low' },
    MEDIUM: { ring: 'text-risk-medium', fill: 'text-risk-medium' },
    HIGH: { ring: 'text-risk-high', fill: 'text-risk-high' },
    CRITICAL: { ring: 'text-risk-critical', fill: 'text-risk-critical' },
  }
  const fallback = { ring: 'text-risk-medium', fill: 'text-risk-medium' }
  const c = colors[level] ?? fallback

  const dashLength =
    level === 'MINIMAL'
      ? 113
      : level === 'LOW'
        ? 90
        : level === 'MEDIUM'
          ? 56
          : level === 'HIGH'
            ? 85
            : 113

  return (
    <svg
      className={clsx('h-10 w-10', c.ring)}
      viewBox="0 0 40 40"
      fill="none"
    >
      <circle
        cx="20"
        cy="20"
        r="18"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.3"
      />
      <circle
        cx="20"
        cy="20"
        r="18"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray={`${dashLength} 113`}
        strokeLinecap="round"
        transform="rotate(-90 20 20)"
      />
      <circle
        cx="20"
        cy="20"
        r="6"
        className={c.fill}
        fill="currentColor"
      />
    </svg>
  )
}

interface RiskPresentation {
  label: string
  summary: string
  color: string
  bgColor: string
  borderColor: string
}

function riskPresentation(
  level: RiskLevel,
  review: CompiledReview,
): RiskPresentation {
  const { admins, totals } = review
  const hasEOA = admins.some(
    (a) => a.adminType === 'EOA' || a.adminType === 'EOAPermissioned',
  )
  const allImmutable =
    admins.length > 0 &&
    admins.every(
      (a) =>
        a.adminType === 'Revoked' ||
        a.adminType === 'Immutable' ||
        a.adminType === 'Contract' ||
        a.adminType === 'Untemplatized',
    )

  switch (level) {
    case 'CRITICAL':
      return {
        label: 'Critical Risk',
        summary: hasEOA
          ? `This protocol has externally owned accounts (EOAs) with admin access to ${formatUsdValue(totals.totalCapitalAtRisk)} in capital. A single compromised key could affect user funds.`
          : `This protocol has significant centralization risks with ${totals.adminCount} admins controlling ${formatUsdValue(totals.totalCapitalAtRisk)} in capital.`,
        color: 'text-risk-critical',
        bgColor: 'bg-risk-critical/5',
        borderColor: 'border-risk-critical/30',
      }
    case 'HIGH':
      return {
        label: 'High Risk',
        summary: `This protocol has notable centralization vectors. ${totals.adminCount} admin${totals.adminCount !== 1 ? 's' : ''} control${totals.adminCount === 1 ? 's' : ''} permissioned functions across ${totals.contractCount} contracts with ${formatUsdValue(totals.totalCapitalAtRisk)} at stake.`,
        color: 'text-risk-high',
        bgColor: 'bg-risk-high/5',
        borderColor: 'border-risk-high/30',
      }
    case 'MEDIUM':
      return {
        label: 'Medium Risk',
        summary: `This protocol has standard governance controls. Admin access is distributed across ${totals.adminCount} entit${totals.adminCount !== 1 ? 'ies' : 'y'} with ${formatUsdValue(totals.totalCapitalAtRisk)} in managed capital.`,
        color: 'text-risk-medium',
        bgColor: 'bg-risk-medium/5',
        borderColor: 'border-risk-medium/30',
      }
    case 'LOW':
      return {
        label: 'Low Risk',
        summary: allImmutable
          ? 'All admin controls resolve to immutable contracts or revoked addresses. No human entity can modify protocol behavior.'
          : `This protocol has minimal centralization risk with strong governance controls protecting ${formatUsdValue(totals.totalCapitalAtRisk)} in capital.`,
        color: 'text-risk-low',
        bgColor: 'bg-risk-low/5',
        borderColor: 'border-risk-low/30',
      }
    case 'MINIMAL':
      return {
        label: 'Minimal Risk',
        summary:
          'This protocol has very low centralization risk. Admin controls are minimal or fully immutable.',
        color: 'text-risk-minimal',
        bgColor: 'bg-risk-minimal/5',
        borderColor: 'border-risk-minimal/30',
      }
  }
}
