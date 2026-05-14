import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from '~/components/table/Table'
import type { PrivacyAsset } from '~/server/features/privacy/types'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { PrivacyExpandableAssetRow } from './PrivacyExpandableAssetRow'

export function PrivacyAssetsBreakdownTable({
  assets,
}: {
  assets: PrivacyAsset[]
}) {
  const showBucketsColumn = assets.some((asset) => asset.bucketCount > 1)
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
            detail={
              <PrivacyBucketBreakdownRows
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
              {asset.totalValueUsd === null
                ? '—'
                : formatCurrency(asset.totalValueUsd, 'usd')}
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
            {totals.totalValueUsd === null
              ? '—'
              : formatCurrency(totals.totalValueUsd, 'usd')}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

function PrivacyBucketBreakdownRows({
  asset,
  showBucketsColumn,
}: {
  asset: PrivacyAsset
  showBucketsColumn: boolean
}) {
  return (
    <>
      {asset.buckets.map((bucket) => (
        <TableRow
          key={bucket.id}
          highlightId={undefined}
          className="bg-surface-secondary/30"
        >
          <TableCell className="pl-8 font-medium text-primary md:pl-10">
            {formatBucketLabel(bucket.label)}
          </TableCell>
          {showBucketsColumn && (
            <TableCell align="right" className="w-[1%] whitespace-nowrap" />
          )}
          <TableCell align="right">
            <PrivacyDepositsMetric
              deposits={bucket.deposits.last7d}
              depositedValueUsd={bucket.depositedValueUsd.last7d}
              className="text-right"
            />
          </TableCell>
          <TableCell align="right">
            <PrivacyDepositsMetric
              deposits={bucket.deposits.last30d}
              depositedValueUsd={bucket.depositedValueUsd.last30d}
              className="text-right"
            />
          </TableCell>
          <TableCell align="right">
            <PrivacyDepositsMetric
              deposits={bucket.deposits.total}
              depositedValueUsd={bucket.depositedValueUsd.total}
              className="text-right"
            />
          </TableCell>
          <TableCell align="right" className="font-medium">
            {bucket.totalValueUsd === null
              ? '—'
              : formatCurrency(bucket.totalValueUsd, 'usd')}
          </TableCell>
        </TableRow>
      ))}
    </>
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

function getTotals(assets: PrivacyAsset[]) {
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
