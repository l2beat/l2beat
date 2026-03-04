import type { CompiledReview } from '../../../../types'
import { formatUsdValue } from '../../../../utils/format'
import { computeEntityDependencyCount } from '../../../../utils/dependencies'
import { CapitalFlowDiagram } from './svg/CapitalFlowDiagram'

interface OverviewTabProps {
  review: CompiledReview
}

export function OverviewTab({ review }: OverviewTabProps) {
  const { totals, admins, dependencies } = review

  const vendorCount = new Set(
    dependencies.map((d) => d.entity).filter(Boolean),
  ).size

  // Compute key metrics
  const hasEOA = admins.some(
    (a) => a.adminType === 'EOA' || a.adminType === 'EOAPermissioned',
  )
  const multisigAdmins = admins.filter((a) => a.adminType === 'Multisig')
  const timelockAdmins = admins.filter((a) => a.adminType === 'Timelock')
  const revokedAdmins = admins.filter((a) => a.adminType === 'Revoked')
  const immutableAdmins = admins.filter(
    (a) =>
      a.adminType === 'Untemplatized' ||
      a.adminType === 'Diamond' ||
      a.adminType === 'Immutable' ||
      a.adminType === 'Upgradeable',
  )

  // Compute the highest capital-at-risk for a single admin
  const topAdmin =
    admins.length > 0
      ? admins.reduce((a, b) =>
          a.totalDirectCapital > b.totalDirectCapital ? a : b,
        )
      : null

  // Admin type breakdown (excludes "Contract" type to focus on human-relevant admins)
  const adminBreakdown = [
    {
      label: 'EOA',
      count: admins.filter(
        (a) => a.adminType === 'EOA' || a.adminType === 'EOAPermissioned',
      ).length,
      color: '#EF4444',
    },
    { label: 'Multisig', count: multisigAdmins.length, color: '#F59E0B' },
    { label: 'Timelock', count: timelockAdmins.length, color: '#10B981' },
    { label: 'Other', count: immutableAdmins.length, color: '#3B82F6' },
    { label: 'Revoked', count: revokedAdmins.length, color: '#6B7280' },
  ].filter((b) => b.count > 0)

  const totalAdminCount = adminBreakdown.reduce((s, b) => s + b.count, 0)

  return (
    <div className="space-y-6">
      {/* Key metrics row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MetricBox
          label="Funds Locked"
          value={formatUsdValue(totals.totalCapitalAtRisk)}
          sublabel="in protocol"
          color="text-capital"
        />
        {totals.totalTokenValueAtRisk > 0 && (
          <MetricBox
            label="Token Value"
            value={formatUsdValue(totals.totalTokenValueAtRisk)}
            sublabel="protocol token"
            color="text-token"
          />
        )}
        <MetricBox
          label="Admins"
          value={String(totals.adminCount)}
          sublabel={`controlling ${totals.permissionedFunctionCount} functions`}
        />
        <MetricBox
          label="Dependencies"
          value={String(computeEntityDependencyCount(dependencies))}
          sublabel="external contracts"
        />
        <MetricBox
          label="Contracts"
          value={String(totals.contractCount)}
          sublabel="analyzed"
        />
        <MetricBox
          label="Vendors"
          value={String(vendorCount)}
          sublabel="external providers"
        />
      </div>

      {/* Two-column: Admin type breakdown + Key risk indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Admin Type Breakdown Bar */}
        <div className="rounded-lg border border-border bg-white p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            Admin Type Distribution
          </h3>
          {adminBreakdown.length > 0 ? (
            <>
              <div className="flex h-6 rounded overflow-hidden mb-3">
                {adminBreakdown.map((b) => (
                  <div
                    key={b.label}
                    style={{
                      width: `${(b.count / totalAdminCount) * 100}%`,
                      backgroundColor: b.color,
                    }}
                    className="relative group"
                    title={`${b.label}: ${b.count}`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                {adminBreakdown.map((b) => (
                  <span key={b.label} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-sm inline-block"
                      style={{ backgroundColor: b.color }}
                    />
                    <span className="text-text-secondary">{b.label}</span>
                    <span className="font-semibold text-text-primary">
                      {b.count}
                    </span>
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-text-muted text-sm">No admins found.</p>
          )}
        </div>

        {/* Risk indicators */}
        <div className="rounded-lg border border-border bg-white p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            Key Risk Indicators
          </h3>
          <div className="space-y-2 text-sm">
            <RiskRow
              label="EOA admin keys"
              status={hasEOA ? 'high' : 'safe'}
              detail={
                hasEOA
                  ? `${admins.filter((a) => a.adminType === 'EOA' || a.adminType === 'EOAPermissioned').length} EOA(s) with direct control`
                  : 'No EOA admins detected'
              }
            />
            <RiskRow
              label="Timelock protection"
              status={timelockAdmins.length > 0 ? 'safe' : 'medium'}
              detail={
                timelockAdmins.length > 0
                  ? `${timelockAdmins.length} timelocked admin(s)`
                  : 'No timelock protection found'
              }
            />
            <RiskRow
              label="External dependencies"
              status={
                dependencies.length === 0
                  ? 'safe'
                  : dependencies.length > 5
                    ? 'high'
                    : 'medium'
              }
              detail={`${dependencies.length} external contract${dependencies.length !== 1 ? 's' : ''}`}
            />
            {topAdmin && topAdmin.totalDirectCapital > 0 && (
              <RiskRow
                label="Max single-admin funds"
                status="info"
                detail={`${topAdmin.name}: ${formatUsdValue(topAdmin.totalDirectCapital)}`}
              />
            )}
          </div>
        </div>
      </div>

      {/* Capital Flow Diagram */}
      <div className="rounded-lg border border-border bg-white p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Funds Flow: Admins to Fund Holders
        </h3>
        <CapitalFlowDiagram review={review} />
      </div>
    </div>
  )
}

function MetricBox({
  label,
  value,
  sublabel,
  color,
}: {
  label: string
  value: string
  sublabel?: string
  color?: string
}) {
  return (
    <div className="rounded-lg border border-border bg-white p-3">
      <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
        {label}
      </p>
      <p
        className={`text-xl font-bold tabular-nums mt-0.5 ${color ?? 'text-text-primary'}`}
      >
        {value}
      </p>
      {sublabel && (
        <p className="text-xs text-text-muted mt-0.5">{sublabel}</p>
      )}
    </div>
  )
}

function RiskRow({
  label,
  status,
  detail,
}: {
  label: string
  status: 'safe' | 'medium' | 'high' | 'info'
  detail: string
}) {
  const colors = {
    safe: 'bg-status-green/10 text-status-green',
    medium: 'bg-status-amber/10 text-status-amber',
    high: 'bg-status-red/10 text-status-red',
    info: 'bg-status-blue/10 text-status-blue',
  }
  const icons = {
    safe: 'M5 13l4 4L19 7',
    medium: 'M12 9v2m0 4h.01',
    high: 'M6 18L18 6M6 6l12 12',
    info: 'M13 16h-1v-4h-1m1-4h.01',
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${colors[status]}`}
        >
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={icons[status]}
            />
          </svg>
        </span>
        <span className="text-text-primary font-medium">{label}</span>
      </div>
      <span className="text-text-secondary text-xs">{detail}</span>
    </div>
  )
}
