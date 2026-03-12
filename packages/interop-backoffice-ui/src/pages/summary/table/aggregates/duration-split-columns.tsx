import type { ColumnDef } from '@tanstack/react-table'
import { SortableHeader } from '~/components/table/SortableHeader'
import type { SummaryAggregateDurationSplitCoverageRow } from '../types'
import { TransferTypeBadge } from './TransferTypeBadge'

function formatIncludedSplitsCsv(
  row: SummaryAggregateDurationSplitCoverageRow,
) {
  return row.includedSplits
    .map((split) => `${split.label}: ${split.transferTypes.join(', ')}`)
    .join(' | ')
}

function getIncludedTransferTypesCount(
  row: SummaryAggregateDurationSplitCoverageRow,
) {
  return row.includedSplits.reduce(
    (sum, split) => sum + split.transferTypes.length,
    0,
  )
}

export const durationSplitCoverageColumns: ColumnDef<SummaryAggregateDurationSplitCoverageRow>[] =
  [
    {
      accessorKey: 'projectName',
      header: (props) => <SortableHeader {...props} label="Protocol" />,
      meta: {
        csvHeader: 'Protocol',
      },
    },
    {
      accessorKey: 'bridgeType',
      header: (props) => <SortableHeader {...props} label="Bridge type" />,
      meta: {
        csvHeader: 'Bridge type',
      },
    },
    {
      id: 'includedInDurationSplit',
      accessorFn: getIncludedTransferTypesCount,
      header: (props) => (
        <SortableHeader {...props} label="Included in duration split" />
      ),
      cell: ({ row }) => {
        if (row.original.includedSplits.length === 0) {
          return '-'
        }

        const observedTransferTypes = new Set(
          row.original.observedTransferTypes,
        )

        return (
          <div className="flex max-w-[900px] flex-col gap-2">
            {row.original.includedSplits.map((split) => (
              <div
                key={`${row.original.projectId}:${row.original.bridgeType}:${split.label}`}
              >
                <div className="mb-1 font-medium text-xs">{split.label}</div>
                {split.transferTypes.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {split.transferTypes.map((transferType) => (
                      <TransferTypeBadge
                        key={`${row.original.projectId}:${row.original.bridgeType}:${split.label}:${transferType}`}
                        variant={
                          observedTransferTypes.has(transferType)
                            ? 'seen'
                            : 'configured'
                        }
                      >
                        {transferType}
                      </TransferTypeBadge>
                    ))}
                  </div>
                ) : (
                  '-'
                )}
              </div>
            ))}
          </div>
        )
      },
      meta: {
        csvHeader: 'Included in duration split',
        csvValue: ({ row }) => formatIncludedSplitsCsv(row.original),
      },
    },
    {
      id: 'notIncludedInDurationSplit',
      accessorFn: (row) => row.notIncludedTransferTypes.length,
      header: (props) => (
        <SortableHeader {...props} label="Not included in duration split" />
      ),
      cell: ({ row }) => {
        if (row.original.notIncludedTransferTypes.length === 0) {
          return '-'
        }

        return (
          <div className="flex max-w-[900px] flex-wrap gap-1">
            {row.original.notIncludedTransferTypes.map((transferType) => (
              <TransferTypeBadge
                key={`${row.original.projectId}:${row.original.bridgeType}:${transferType}`}
                variant="missing"
              >
                {transferType}
              </TransferTypeBadge>
            ))}
          </div>
        )
      },
      meta: {
        csvHeader: 'Not included in duration split',
        csvValue: ({ row }) => row.original.notIncludedTransferTypes.join(', '),
      },
    },
  ]
