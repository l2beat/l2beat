import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import type { DurationSplitCoverageRow } from '../types'
import { TransferTypeBadge } from './TransferTypeBadge'

const columnHelper = createColumnHelper<DurationSplitCoverageRow>()

export const durationSplitCoverageColumns: TableOptions<DurationSplitCoverageRow>['columns'] =
  [
    columnHelper.accessor('projectName', {
      header: 'Protocol',
      meta: {
        csvHeader: 'Protocol',
      },
    }),
    columnHelper.accessor('bridgeType', {
      header: 'Bridge type',
      meta: {
        csvHeader: 'Bridge type',
      },
    }),
    columnHelper.accessor(
      (row) =>
        row.includedSplits
          .flatMap((split) => [split.label, ...split.transferTypes])
          .join(' '),
      {
        id: 'includedSplits',
        header: 'Included in duration split',
        cell: ({ row }) => {
          const splits = row.original.includedSplits

          if (splits.length === 0) {
            return <EmptyCell />
          }

          return (
            <div className="flex min-w-[20rem] flex-col gap-3">
              {splits.map((split) => (
                <div
                  key={`${row.original.projectId}-${row.original.bridgeType}-${split.label}`}
                  className="space-y-2"
                >
                  <div className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    {split.label}
                  </div>
                  {split.transferTypes.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {split.transferTypes.map((transferType) => (
                        <TransferTypeBadge
                          key={`${row.original.projectId}-${row.original.bridgeType}-${split.label}-${transferType}`}
                          transferType={transferType}
                          tone={
                            row.original.observedTransferTypes.includes(
                              transferType,
                            )
                              ? 'included'
                              : 'configured'
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyCell />
                  )}
                </div>
              ))}
            </div>
          )
        },
        sortingFn: (left, right) =>
          getIncludedTransferTypesCount(right.original) -
          getIncludedTransferTypesCount(left.original),
        meta: {
          csvHeader: 'Included in duration split',
          getCsvValue: ({ row }) =>
            row.original.includedSplits
              .map(
                (split) => `${split.label}: ${split.transferTypes.join(', ')}`,
              )
              .join(' | '),
        },
      },
    ),
    columnHelper.accessor((row) => row.notIncludedTransferTypes.join(' '), {
      id: 'notIncludedTransferTypes',
      header: 'Not included in duration split',
      cell: ({ row }) =>
        row.original.notIncludedTransferTypes.length > 0 ? (
          <div className="flex min-w-[18rem] flex-wrap gap-1.5">
            {row.original.notIncludedTransferTypes.map((transferType) => (
              <TransferTypeBadge
                key={`${row.original.projectId}-${row.original.bridgeType}-${transferType}`}
                transferType={transferType}
                tone="missing"
              />
            ))}
          </div>
        ) : (
          <EmptyCell />
        ),
      sortingFn: (left, right) =>
        right.original.notIncludedTransferTypes.length -
        left.original.notIncludedTransferTypes.length,
      meta: {
        csvHeader: 'Not included in duration split',
        getCsvValue: ({ row }) =>
          row.original.notIncludedTransferTypes.join(', '),
      },
    }),
  ]

function getIncludedTransferTypesCount(row: DurationSplitCoverageRow) {
  return row.includedSplits.reduce(
    (sum, split) => sum + split.transferTypes.length,
    0,
  )
}

function EmptyCell() {
  return <span className="text-muted-foreground">-</span>
}
