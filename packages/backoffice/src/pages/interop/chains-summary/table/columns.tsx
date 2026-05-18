import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { Link } from 'react-router-dom'
import { Badge } from '~/components/core/Badge'
import type { ChainsSummaryRow } from '../types'

const columnHelper = createColumnHelper<ChainsSummaryRow>()

export const chainsSummaryColumns: TableOptions<ChainsSummaryRow>['columns'] = [
  columnHelper.accessor('name', {
    header: 'Chain',
    cell: ({ row }) => (
      <div className="flex min-w-52 items-center gap-3">
        <div
          className="flex size-7 shrink-0 items-center justify-center rounded-full border bg-muted"
          style={{ borderColor: row.original.color }}
        >
          {row.original.iconUrl ? (
            <img
              src={row.original.iconUrl}
              alt=""
              className="size-5 rounded-full"
              loading="lazy"
            />
          ) : (
            <span className="font-semibold text-[10px]">
              {row.original.display.slice(0, 3)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <div className="truncate font-medium">{row.original.name}</div>
          <div className="font-mono text-muted-foreground text-xs">
            {row.original.id}
          </div>
        </div>
      </div>
    ),
    meta: {
      csvHeader: 'Chain',
      getCsvValue: ({ row }) => row.original.name,
    },
  }),
  columnHelper.accessor('enabledOnProductionFrontend', {
    header: 'Prod FE',
    cell: ({ row, getValue }) => (
      <StatusBadge
        enabled={getValue()}
        detail={
          row.original.enabledOnProductionFrontendUpcoming
            ? 'upcoming'
            : undefined
        }
      />
    ),
    meta: {
      csvHeader: 'Enabled on prod FE',
      getCsvValue: ({ row }) =>
        String(row.original.enabledOnProductionFrontend),
      filter: { kind: 'select' },
    },
  }),
  columnHelper.accessor('enabledOnProductionBackendCapture', {
    header: 'Prod BE',
    cell: ({ row, getValue }) => (
      <StatusBadge
        enabled={getValue() || row.original.enabledOnProductionBackendOneSided}
        detail={
          row.original.enabledOnProductionBackendOneSided
            ? 'one-sided'
            : undefined
        }
      />
    ),
    meta: {
      csvHeader: 'Enabled on prod BE',
      getCsvValue: ({ row }) =>
        String(
          row.original.enabledOnProductionBackendCapture ||
            row.original.enabledOnProductionBackendOneSided,
        ),
      filter: { kind: 'select' },
    },
  }),
  columnHelper.accessor('enabledOnStagingFrontend', {
    header: 'Staging FE',
    cell: ({ row, getValue }) => (
      <StatusBadge
        enabled={getValue()}
        detail={
          row.original.enabledOnStagingFrontendUpcoming ? 'upcoming' : undefined
        }
      />
    ),
    meta: {
      csvHeader: 'Enabled on staging FE',
      getCsvValue: ({ row }) => String(row.original.enabledOnStagingFrontend),
      filter: { kind: 'select' },
    },
  }),
  columnHelper.accessor('enabledOnStagingBackendCapture', {
    header: 'Staging BE',
    cell: ({ row, getValue }) => (
      <StatusBadge
        enabled={getValue() || row.original.enabledOnStagingBackendOneSided}
        detail={
          row.original.enabledOnStagingBackendOneSided ? 'one-sided' : undefined
        }
      />
    ),
    meta: {
      csvHeader: 'Enabled on staging BE',
      getCsvValue: ({ row }) =>
        String(
          row.original.enabledOnStagingBackendCapture ||
            row.original.enabledOnStagingBackendOneSided,
        ),
      filter: { kind: 'select' },
    },
  }),
  columnHelper.accessor('missingTokensCount', {
    header: 'Missing tokens',
    cell: ({ getValue }) => (
      <CountLink to="/interop/missing-tokens" value={getValue()} />
    ),
    sortingFn: numericSort('missingTokensCount'),
    meta: {
      csvHeader: 'Missing tokens',
      getCsvValue: ({ row }) =>
        formatCountForCsv(row.original.missingTokensCount),
    },
  }),
  columnHelper.accessor('suspiciousTransfersCount', {
    header: 'Suspicious transfers',
    cell: ({ getValue }) => (
      <CountLink
        to="/interop/insights/anomalies/suspicious-transfers"
        value={getValue()}
      />
    ),
    sortingFn: numericSort('suspiciousTransfersCount'),
    meta: {
      csvHeader: 'Suspicious transfers',
      getCsvValue: ({ row }) =>
        formatCountForCsv(row.original.suspiciousTransfersCount),
    },
  }),
  columnHelper.accessor('notIncludedTransfersCount', {
    header: 'Not included txs',
    cell: ({ getValue }) => (
      <CountLink to="/interop/aggregates" value={getValue()} />
    ),
    sortingFn: numericSort('notIncludedTransfersCount'),
    meta: {
      csvHeader: 'Not included txs',
      getCsvValue: ({ row }) =>
        formatCountForCsv(row.original.notIncludedTransfersCount),
    },
  }),
]

function CountLink({ to, value }: { to: string; value: number | undefined }) {
  if (value === undefined) {
    return <span className="text-muted-foreground">—</span>
  }
  if (value === 0) {
    return <span className="text-muted-foreground">0</span>
  }
  return (
    <Link to={to} className="text-primary underline-offset-2 hover:underline">
      {value}
    </Link>
  )
}

function numericSort<K extends keyof ChainsSummaryRow>(key: K) {
  return (
    left: { original: ChainsSummaryRow },
    right: { original: ChainsSummaryRow },
  ) => {
    const a = (left.original[key] as number | undefined) ?? -1
    const b = (right.original[key] as number | undefined) ?? -1
    return a - b
  }
}

function formatCountForCsv(value: number | undefined) {
  return value === undefined ? '' : String(value)
}

function StatusBadge({
  enabled,
  detail,
}: {
  enabled: boolean
  detail?: string
}) {
  return enabled ? (
    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
      true{detail ? `, ${detail}` : ''}
    </Badge>
  ) : (
    <Badge variant="outline" className="text-muted-foreground">
      false
    </Badge>
  )
}
