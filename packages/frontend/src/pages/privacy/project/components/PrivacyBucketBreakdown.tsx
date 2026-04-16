import type React from 'react'
import type { PrivacyBucketSnapshot } from '~/server/features/privacy/types'
import { cn } from '~/utils/cn'

interface MetricRow {
  label: string
  renderValue: (bucket: PrivacyBucketSnapshot) => React.ReactNode
}

interface Props {
  buckets: PrivacyBucketSnapshot[]
  rows: MetricRow[]
}

export function PrivacyBucketBreakdown({ buckets, rows }: Props) {
  const breakdownRows: MetricRow[] = [
    {
      label: 'Bucket',
      renderValue: (bucket) => (
        <span className="font-medium text-primary">{bucket.label}</span>
      ),
    },
    ...rows,
  ]

  return (
    <div className="overflow-hidden rounded-lg border border-divider bg-surface-secondary">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-separate border-spacing-0">
          <tbody>
            {breakdownRows.map((row, rowIndex) => {
              const isLastRow = rowIndex === breakdownRows.length - 1

              return (
                <tr key={row.label}>
                  <th
                    scope="row"
                    className={cn(
                      'whitespace-nowrap px-3 py-2 text-left font-medium text-[11px] text-secondary uppercase md:px-4',
                      !isLastRow && 'border-divider border-b',
                    )}
                  >
                    {row.label}
                  </th>
                  {buckets.map((bucket) => (
                    <td
                      key={`${row.label}-${bucket.id}`}
                      className={cn(
                        'min-w-28 border-divider border-l px-3 py-2 text-center text-xs md:min-w-36 md:px-4 md:text-sm',
                        !isLastRow && 'border-divider border-b',
                      )}
                    >
                      {row.renderValue(bucket)}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
