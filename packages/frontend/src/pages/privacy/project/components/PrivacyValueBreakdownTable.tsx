import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
} from '~/components/table/Table'
import { EM_DASH } from '~/consts/characters'
import type { PrivacyAssetSnapshot } from '~/server/features/privacy/types'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatNumber } from '~/utils/number-format/formatNumber'
import { PrivacyBucketBreakdown } from './PrivacyBucketBreakdown'
import { PrivacyExpandableAssetRow } from './PrivacyExpandableAssetRow'

export function PrivacyValueBreakdownTable({
  assets,
}: {
  assets: PrivacyAssetSnapshot[]
}) {
  return (
    <Table>
      <TableHeader>
        <TableHeaderRow>
          <TableHead>Asset</TableHead>
          <TableHead align="right">Buckets</TableHead>
          <TableHead align="right">Total Amount</TableHead>
          <TableHead align="right">Price</TableHead>
          <TableHead align="right">Value Secured</TableHead>
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {assets.map((asset) => (
          <PrivacyExpandableAssetRow
            key={asset.symbol}
            asset={asset}
            idPrefix="privacy-value-breakdown"
            colSpan={5}
            detail={
              <PrivacyBucketBreakdown
                buckets={asset.buckets}
                rows={[
                  {
                    label: 'Value Secured',
                    renderValue: (bucket) =>
                      bucket.totalValueUsd === null
                        ? EM_DASH
                        : formatCurrency(bucket.totalValueUsd, 'usd'),
                  },
                ]}
              />
            }
          >
            <TableCell align="right">{asset.bucketCount}</TableCell>
            <TableCell align="right">
              {formatAssetAmount(asset.totalAmount, asset.symbol)}
            </TableCell>
            <TableCell align="right">
              {asset.priceUsd === null
                ? EM_DASH
                : formatCurrency(asset.priceUsd, 'usd')}
            </TableCell>
            <TableCell align="right" className="font-medium text-base">
              {asset.totalValueUsd === null
                ? EM_DASH
                : formatCurrency(asset.totalValueUsd, 'usd')}
            </TableCell>
          </PrivacyExpandableAssetRow>
        ))}
      </TableBody>
    </Table>
  )
}

function formatAssetAmount(amount: number, symbol: string) {
  if (amount === 0) {
    return `0 ${symbol}`
  }

  if (amount < 0.0001) {
    return `<0.0001 ${symbol}`
  }

  const decimals = amount < 1 ? 4 : amount < 100 ? 2 : 0
  return `${formatNumber(amount, decimals)} ${symbol}`
}
