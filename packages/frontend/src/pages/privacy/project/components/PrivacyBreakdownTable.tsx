import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from '~/components/table/Table'
import type {
  PrivacyAssetSnapshot,
} from '~/server/features/privacy/types'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { PrivacyExpandableAssetRow } from './PrivacyExpandableAssetRow'

export function PrivacyBreakdownTable({
  assets,
}: {
  assets: PrivacyAssetSnapshot[]
}) {
  const showBucketsColumn = assets.some((asset) => asset.bucketCount > 1)
  const colSpan = showBucketsColumn ? 6 : 5
  const totals = getTotals(assets)

  return (
    <Table>
      <TableHeader>
        <TableHeaderRow>
          <TableHead>Asset</TableHead>
          {showBucketsColumn && (
            <TableHead align="right" className="w-[1%] whitespace-nowrap">
              Buckets
            </TableHead>
          )}
          <TableHead align="right">Deposits 7D</TableHead>
          <TableHead align="right">Deposits 30D</TableHead>
          <TableHead align="right">Deposits Total</TableHead>
          <TableHead align="right">Value Secured</TableHead>
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {assets.map((asset) => (
          <PrivacyExpandableAssetRow
            key={asset.symbol}
            asset={asset}
            idPrefix="privacy-breakdown"
            colSpan={colSpan}
            detail={
              <PrivacyBucketBreakdownTable
                asset={asset}
                showBucketsColumn={showBucketsColumn}
              />
            }
          >
            {showBucketsColumn && (
              <TableCell align="right" className="w-[1%] whitespace-nowrap">
                {asset.bucketCount}
              </TableCell>
            )}
            <TableCell align="right">
              <PrivacyDepositsMetric
                deposits={asset.deposits.last7d}
                depositedValueUsd={asset.depositedValueUsd.last7d}
                className="text-right"
              />
            </TableCell>
            <TableCell align="right">
              <PrivacyDepositsMetric
                deposits={asset.deposits.last30d}
                depositedValueUsd={asset.depositedValueUsd.last30d}
                className="text-right"
              />
            </TableCell>
            <TableCell align="right">
              <PrivacyDepositsMetric
                deposits={asset.deposits.total}
                depositedValueUsd={asset.depositedValueUsd.total}
                className="text-right"
              />
            </TableCell>
            <TableCell align="right" className="font-medium">
              {asset.totalValueUsd === null ? '—' : formatCurrency(asset.totalValueUsd, 'usd')}
            </TableCell>
          </PrivacyExpandableAssetRow>
        ))}
        <TableRow highlightId={undefined}>
          <TableCell className="border-divider border-t-4 font-bold text-base">
            Total
          </TableCell>
          {showBucketsColumn && (
            <TableCell align="right" className="border-divider border-t-4" />
          )}
          <TableCell align="right" className="border-divider border-t-4">
            <PrivacyDepositsMetric
              deposits={totals.deposits.last7d}
              depositedValueUsd={totals.depositedValueUsd.last7d}
              className="text-right"
            />
          </TableCell>
          <TableCell align="right" className="border-divider border-t-4">
            <PrivacyDepositsMetric
              deposits={totals.deposits.last30d}
              depositedValueUsd={totals.depositedValueUsd.last30d}
              className="text-right"
            />
          </TableCell>
          <TableCell align="right" className="border-divider border-t-4">
            <PrivacyDepositsMetric
              deposits={totals.deposits.total}
              depositedValueUsd={totals.depositedValueUsd.total}
              className="text-right"
            />
          </TableCell>
          <TableCell
            align="right"
            className="border-divider border-t-4 font-bold"
          >
            {totals.totalValueUsd === null ? '—' : formatCurrency(totals.totalValueUsd, 'usd')}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

function PrivacyBucketBreakdownTable({
  asset,
  showBucketsColumn,
}: {
  asset: PrivacyAssetSnapshot
  showBucketsColumn: boolean
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-divider bg-surface-secondary">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-separate border-spacing-0">
          <tbody>
            {asset.buckets.map((bucket, index) => {
              const isLastRow = index === asset.buckets.length - 1

              return (
                <tr key={bucket.id}>
                  <td
                    className={cn(
                      'px-3 py-2 font-medium text-primary text-xs md:px-4 md:text-sm',
                      !isLastRow && 'border-divider border-b',
                    )}
                  >
                    {formatBucketLabel(bucket.label)}
                  </td>
                  {showBucketsColumn && (
                    <td
                      className={cn(
                        'w-[1%] whitespace-nowrap px-3 py-2 text-right text-secondary text-xs md:px-4 md:text-sm',
                        !isLastRow && 'border-divider border-b',
                      )}
                    />
                  )}
                  <td
                    className={cn(
                      'px-3 py-2 text-right text-xs md:px-4 md:text-sm',
                      !isLastRow && 'border-divider border-b',
                    )}
                  >
                    <PrivacyDepositsMetric
                      deposits={bucket.deposits.last7d}
                      depositedValueUsd={bucket.depositedValueUsd.last7d}
                      className="text-right"
                    />
                  </td>
                  <td
                    className={cn(
                      'px-3 py-2 text-right text-xs md:px-4 md:text-sm',
                      !isLastRow && 'border-divider border-b',
                    )}
                  >
                    <PrivacyDepositsMetric
                      deposits={bucket.deposits.last30d}
                      depositedValueUsd={bucket.depositedValueUsd.last30d}
                      className="text-right"
                    />
                  </td>
                  <td
                    className={cn(
                      'px-3 py-2 text-right text-xs md:px-4 md:text-sm',
                      !isLastRow && 'border-divider border-b',
                    )}
                  >
                    <PrivacyDepositsMetric
                      deposits={bucket.deposits.total}
                      depositedValueUsd={bucket.depositedValueUsd.total}
                      className="text-right"
                    />
                  </td>
                  <td
                    className={cn(
                      'px-3 py-2 text-right font-medium text-xs md:px-4 md:text-sm',
                      !isLastRow && 'border-divider border-b',
                    )}
                  >
                    {bucket.totalValueUsd === null ? '—' : formatCurrency(bucket.totalValueUsd, 'usd')}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PrivacyDepositsMetric({
  deposits,
  depositedValueUsd,
  className,
}: {
  deposits: number
  depositedValueUsd: number
  className?: string
}) {
  return (
    <div className={className}>
      <div className="font-bold">{formatInteger(deposits)}</div>
      <div className="text-[10px] text-secondary leading-none md:text-[11px]">
        {formatCurrency(depositedValueUsd, 'usd')}
      </div>
    </div>
  )
}

function formatBucketLabel(label: string) {
  return label.toLowerCase().endsWith('bucket') ? label : `${label} bucket`
}

function getTotals(assets: PrivacyAssetSnapshot[]) {
  return {
    totalValueUsd: assets.reduce(
      (sum, asset) => sum + (asset.totalValueUsd ?? 0),
      0,
    ),
    deposits: {
      total: assets.reduce((sum, asset) => sum + asset.deposits.total, 0),
      last7d: assets.reduce((sum, asset) => sum + asset.deposits.last7d, 0),
      last30d: assets.reduce((sum, asset) => sum + asset.deposits.last30d, 0),
    },
    depositedValueUsd: {
      total: assets.reduce(
        (sum, asset) => sum + asset.depositedValueUsd.total,
        0,
      ),
      last7d: assets.reduce(
        (sum, asset) => sum + asset.depositedValueUsd.last7d,
        0,
      ),
      last30d: assets.reduce(
        (sum, asset) => sum + asset.depositedValueUsd.last30d,
        0,
      ),
    },
  }
}
