import type {
  AuditStatusCounts,
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
