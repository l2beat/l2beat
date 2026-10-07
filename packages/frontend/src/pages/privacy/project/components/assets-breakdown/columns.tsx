import { formatCurrency } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import type { PrivacyAsset } from '~/server/features/privacy/types'
import { AssetCell } from './components/AssetCell'
import { PrivacyDepositsMetric } from './components/PrivacyDepositsMetric'
import { PRIVACY_ASSETS_BREAKDOWN_HEADERS as HEADERS } from './privacyAssetsBreakdown'

const columnHelper = createColumnHelper<PrivacyAsset>()

export const privacyAssetsBreakdownColumns = [
  columnHelper.accessor('symbol', {
    header: HEADERS.asset,
    cell: (ctx) => <AssetCell row={ctx.row} />,
    meta: { cellClassName: 'font-bold text-base' },
  }),
  columnHelper.accessor('bucketCount', {
    id: 'buckets',
    header: HEADERS.buckets,
    cell: (ctx) => ctx.getValue(),
    meta: {
      align: 'right',
      headClassName: 'w-[1%] whitespace-nowrap',
      cellClassName: 'w-[1%] whitespace-nowrap',
    },
  }),
  columnHelper.accessor((row) => row.deposits.last7d, {
    id: 'deposits7d',
    header: HEADERS.deposits7d,
    cell: (ctx) => (
      <PrivacyDepositsMetric
        deposits={ctx.row.original.deposits.last7d}
        depositedValueUsd={ctx.row.original.depositedValueUsd.last7d}
      />
    ),
    meta: { align: 'right' },
  }),
  columnHelper.accessor((row) => row.deposits.last30d, {
    id: 'deposits30d',
    header: HEADERS.deposits30d,
    cell: (ctx) => (
      <PrivacyDepositsMetric
        deposits={ctx.row.original.deposits.last30d}
        depositedValueUsd={ctx.row.original.depositedValueUsd.last30d}
      />
    ),
    meta: { align: 'right' },
  }),
  columnHelper.accessor((row) => row.deposits.total, {
    id: 'depositsTotal',
    header: HEADERS.depositsTotal,
    cell: (ctx) => (
      <PrivacyDepositsMetric
        deposits={ctx.row.original.deposits.total}
        depositedValueUsd={ctx.row.original.depositedValueUsd.total}
      />
    ),
    meta: { align: 'right' },
  }),
  columnHelper.accessor((row) => row.totalValueUsd, {
    id: 'valueLocked',
    header: HEADERS.valueLocked,
    cell: (ctx) => {
      const value = ctx.getValue()
      return value === null ? '—' : formatCurrency(value, 'usd')
    },
    meta: { align: 'right', cellClassName: 'font-medium' },
  }),
]
