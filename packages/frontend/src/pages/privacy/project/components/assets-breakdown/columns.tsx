import { createColumnHelper } from '@tanstack/react-table'
import type { PrivacyAsset } from '~/server/features/privacy/types'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { AssetCell } from './components/AssetCell'
import { PrivacyDepositsMetric } from './components/PrivacyDepositsMetric'

const columnHelper = createColumnHelper<PrivacyAsset>()

export const privacyAssetsBreakdownColumns = [
  columnHelper.accessor('symbol', {
    header: 'Asset',
    cell: (ctx) => <AssetCell row={ctx.row} />,
    meta: { cellClassName: 'font-bold text-base' },
  }),
  columnHelper.accessor('bucketCount', {
    id: 'buckets',
    header: 'Buckets',
    cell: (ctx) => ctx.getValue(),
    meta: {
      align: 'right',
      headClassName: 'w-[1%] whitespace-nowrap',
      cellClassName: 'w-[1%] whitespace-nowrap',
    },
  }),
  columnHelper.accessor((row) => row.deposits.last7d, {
    id: 'deposits7d',
    header: 'Deposits 7D',
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
    header: 'Deposits 30D',
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
    header: 'Deposits Total',
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
    header: 'Value Locked',
    cell: (ctx) => {
      const value = ctx.getValue()
      return value === null ? '—' : formatCurrency(value, 'usd')
    },
    meta: { align: 'right', cellClassName: 'font-medium' },
  }),
]
