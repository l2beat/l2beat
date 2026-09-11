import type {
  AuditStatusCounts,
  AuditsUnitEntry,
  AuditUnitStatus,
} from '~/server/features/audits/types'

export const AUDIT_STATUS_ORDER: AuditUnitStatus[] = [
  'identical',
  'library',
  'differs',
  'unaudited',
]

export const AUDIT_STATUS_META: Record<
  AuditUnitStatus,
  { label: string; description: string; bg: string; text: string }
> = {
  identical: {
    label: 'Identical',
    description:
      "Deployed unit is identical to a revision covered by the project's own audits.",
    bg: 'bg-positive',
    text: 'text-positive',
  },
  library: {
    label: 'Audited standard library',
    description:
      'Deployed unit is identical to a standard library source (e.g. OpenZeppelin) at a revision covered by an audit report in the dataset. A matching name alone is never enough.',
    bg: 'bg-chart-stacked-blue',
    text: 'text-chart-stacked-blue',
  },
  differs: {
    label: 'Differs',
    description:
      'An audited version exists but the deployed unit differs from every audited revision. Changes in comments and require messages are ignored.',
    bg: 'bg-chart-stacked-yellow',
    text: 'text-chart-stacked-yellow',
  },
  unaudited: {
    label: 'No audited source',
    description:
      'No audited source could be matched to the deployed unit in the dataset.',
    bg: 'bg-negative',
    text: 'text-negative',
  },
}

export function totalUnits(counts: AuditStatusCounts): number {
  return AUDIT_STATUS_ORDER.reduce((sum, s) => sum + counts[s], 0)
}

export function formatShare(part: number, total: number): string {
  if (total === 0) return '-'
  return `${Math.round((part / total) * 1000) / 10}%`
}

/**
 * The deployed unit equals an audited revision for which the report recorded
 * major findings. Since the code is unchanged, the fix for those findings is
 * not present in the deployed unit.
 */
export function hasUnresolvedMajorFinding(unit: AuditsUnitEntry): boolean {
  return (
    (unit.status === 'identical' || unit.status === 'library') &&
    (unit.match?.majorFindings ?? 0) > 0
  )
}

export const MAJOR_FINDING_DESCRIPTION =
  'The deployed code is identical to an audited revision for which the audit report recorded major findings. Because the code is unchanged, the fix for those findings is not present in the deployed unit. Open the audit report to check the finding.'
