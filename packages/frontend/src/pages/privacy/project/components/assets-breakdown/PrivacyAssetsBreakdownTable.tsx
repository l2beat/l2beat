import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
} from '@tanstack/react-table'
import { Fragment, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from '~/components/table/Table'
import { useTable } from '~/hooks/useTable'
import type { PrivacyAsset } from '~/server/features/privacy/types'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { privacyAssetsBreakdownColumns } from './columns'
import { PrivacyDepositsMetric } from './components/PrivacyDepositsMetric'

export function PrivacyAssetsBreakdownTable({
  assets,
}: {
  assets: PrivacyAsset[]
}) {
  const showBucketsColumn = assets.some((asset) => asset.bucketCount > 1)
  const totals = useMemo(() => getTotals(assets), [assets])

  const table = useTable({
    data: assets,
    columns: privacyAssetsBreakdownColumns,
    getRowId: (row) => row.symbol,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: (row) => row.original.bucketCount > 1,
    state: {
      columnVisibility: { buckets: showBucketsColumn },
    },
    initialState: {
      sorting: [],
    },
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableHeaderRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                align={header.column.columnDef.meta?.align}
                className={cn(
                  header.column.columnDef.meta?.headClassName,
                  'border-divider border-b-2',
                )}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            ))}
          </TableHeaderRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <Fragment key={row.id}>
            <TableRow
              highlightId={row.original.symbol}
              className={cn(row.getIsExpanded() && 'border-b-0')}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  align={cell.column.columnDef.meta?.align}
                  className={cell.column.columnDef.meta?.cellClassName}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
            {row.getIsExpanded() &&
              row.original.buckets.map((bucket) => (
                <BucketRow
                  key={`${row.id}-${bucket.id}`}
                  bucket={bucket}
                  showBucketsColumn={showBucketsColumn}
                />
              ))}
          </Fragment>
        ))}
        <TotalsRow totals={totals} showBucketsColumn={showBucketsColumn} />
      </TableBody>
    </Table>
  )
}

function BucketRow({
  bucket,
  showBucketsColumn,
}: {
  bucket: PrivacyAsset['buckets'][number]
  showBucketsColumn: boolean
}) {
  return (
    <TableRow highlightId={undefined} className="bg-surface-secondary/30">
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
        />
      </TableCell>
      <TableCell align="right">
        <PrivacyDepositsMetric
          deposits={bucket.deposits.last30d}
          depositedValueUsd={bucket.depositedValueUsd.last30d}
        />
      </TableCell>
      <TableCell align="right">
        <PrivacyDepositsMetric
          deposits={bucket.deposits.total}
          depositedValueUsd={bucket.depositedValueUsd.total}
        />
      </TableCell>
      <TableCell align="right" className="font-medium">
        {bucket.totalValueUsd === null
          ? '—'
          : formatCurrency(bucket.totalValueUsd, 'usd')}
      </TableCell>
    </TableRow>
  )
}

function TotalsRow({
  totals,
  showBucketsColumn,
}: {
  totals: ReturnType<typeof getTotals>
  showBucketsColumn: boolean
}) {
  return (
    <TableRow highlightId={undefined}>
      <TableCell className="border-divider border-t-2 font-bold text-base">
        Total
      </TableCell>
      {showBucketsColumn && (
        <TableCell align="right" className="border-divider border-t-2" />
      )}
      <TableCell align="right" className="border-divider border-t-2">
        <PrivacyDepositsMetric
          deposits={totals.deposits.last7d}
          depositedValueUsd={totals.depositedValueUsd.last7d}
        />
      </TableCell>
      <TableCell align="right" className="border-divider border-t-2">
        <PrivacyDepositsMetric
          deposits={totals.deposits.last30d}
          depositedValueUsd={totals.depositedValueUsd.last30d}
        />
      </TableCell>
      <TableCell align="right" className="border-divider border-t-2">
        <PrivacyDepositsMetric
          deposits={totals.deposits.total}
          depositedValueUsd={totals.depositedValueUsd.total}
        />
      </TableCell>
      <TableCell align="right" className="border-divider border-t-2 font-bold">
        {totals.totalValueUsd === null
          ? '—'
          : formatCurrency(totals.totalValueUsd, 'usd')}
      </TableCell>
    </TableRow>
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
