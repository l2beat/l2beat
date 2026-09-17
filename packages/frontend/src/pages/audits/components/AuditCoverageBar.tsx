import { formatInteger } from '@l2beat/shared-pure'
import { Breakdown } from '~/components/breakdown/Breakdown'
import type {
  AuditCoverageNumbers,
  AuditStatusCounts,
} from '~/server/features/audits/types'
import { cn } from '~/utils/cn'
import {
  AUDIT_STATUS_META,
  AUDIT_STATUS_ORDER,
  formatShare,
  totalUnits,
} from './auditStatus'

/** Stacked bar of deployed unit instances per status. */
export function UnitStatusBar({
  counts,
  className,
}: {
  counts: AuditStatusCounts
  className?: string
}) {
  return (
    <Breakdown
      className={cn('h-[6px] w-full', className)}
      values={AUDIT_STATUS_ORDER.map((status) => ({
        value: counts[status],
        className: AUDIT_STATUS_META[status].bg,
      }))}
    />
  )
}

/** Stacked bar of covered vs uncovered lines. */
export function LineCoverageBar({
  lines,
  className,
}: {
  lines: AuditCoverageNumbers['lines']
  className?: string
}) {
  return (
    <Breakdown
      className={cn('h-[6px] w-full', className)}
      values={[
        { value: lines.covered, className: 'bg-positive' },
        { value: lines.uncovered, className: 'bg-negative' },
      ]}
    />
  )
}

export function UnitStatusBarTooltipContent({
  counts,
}: {
  counts: AuditStatusCounts
}) {
  const total = totalUnits(counts)
  return (
    <div className="space-y-1">
      <div className="text-heading-16">
        Deployed units: {formatInteger(total)}
      </div>
      {AUDIT_STATUS_ORDER.map((status) => (
        <div
          key={status}
          className="flex items-center justify-between gap-x-3 text-label-value-15"
        >
          <span className="flex items-center gap-1.5">
            <span
              className={cn(
                'size-2.5 rounded-sm',
                AUDIT_STATUS_META[status].bg,
              )}
            />
            {AUDIT_STATUS_META[status].label}
          </span>
          <span>
            <b className="font-bold">{formatInteger(counts[status])}</b>{' '}
            <span className="text-secondary">
              ({formatShare(counts[status], total)})
            </span>
          </span>
        </div>
      ))}
    </div>
  )
}

export function LineCoverageTooltipContent({
  lines,
}: {
  lines: AuditCoverageNumbers['lines']
}) {
  return (
    <div className="space-y-1">
      <div className="text-heading-16">
        Lines of code: {formatInteger(lines.total)}
      </div>
      <div className="flex items-center justify-between gap-x-3 text-label-value-15">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-positive" />
          Covered by audits
        </span>
        <span>
          <b className="font-bold">{formatInteger(lines.covered)}</b>{' '}
          <span className="text-secondary">
            ({formatShare(lines.covered, lines.total)})
          </span>
        </span>
      </div>
      <div className="flex items-center justify-between gap-x-3 text-label-value-15">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-negative" />
          Not covered
        </span>
        <span>
          <b className="font-bold">{formatInteger(lines.uncovered)}</b>{' '}
          <span className="text-secondary">
            ({formatShare(lines.uncovered, lines.total)})
          </span>
        </span>
      </div>
      <p className="max-w-[280px] pt-1 text-secondary text-xs">
        Not covered lines are all lines of units without audited source plus the
        lines added in units that differ from their audited version.
      </p>
    </div>
  )
}
