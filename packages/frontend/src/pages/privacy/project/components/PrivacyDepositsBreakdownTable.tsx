import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
} from '~/components/table/Table'
import type { PrivacyAssetSnapshot } from '~/server/features/privacy/types'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { PrivacyBucketBreakdown } from './PrivacyBucketBreakdown'
import { PrivacyExpandableAssetRow } from './PrivacyExpandableAssetRow'

export function PrivacyDepositsBreakdownTable({
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
          <TableHead align="right">Deposits 7D</TableHead>
          <TableHead align="right">Deposits 30D</TableHead>
          <TableHead align="right">Deposits Total</TableHead>
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {assets.map((asset) => (
          <PrivacyExpandableAssetRow
            key={asset.symbol}
            asset={asset}
            idPrefix="privacy-deposits-breakdown"
            colSpan={5}
            detail={
              <PrivacyBucketBreakdown
                buckets={asset.buckets}
                rows={[
                  {
                    label: 'Deposits 7D',
                    renderValue: (bucket) =>
                      formatInteger(bucket.deposits.last7d),
                  },
                  {
                    label: 'Deposits 30D',
                    renderValue: (bucket) =>
                      formatInteger(bucket.deposits.last30d),
                  },
                ]}
              />
            }
          >
            <TableCell align="right">{asset.bucketCount}</TableCell>
            <TableCell align="right">
              {formatInteger(asset.deposits.last7d)}
            </TableCell>
            <TableCell align="right">
              {formatInteger(asset.deposits.last30d)}
            </TableCell>
            <TableCell align="right" className="font-medium text-base">
              {formatInteger(asset.deposits.total)}
            </TableCell>
          </PrivacyExpandableAssetRow>
        ))}
      </TableBody>
    </Table>
  )
}
