import { createColumnHelper } from '@tanstack/react-table'
import { NoDataBadge } from '~/components/badge/no-data-badge'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/scaling-common-project-columns'
import { getColumnHeaderUnderline } from '~/utils/table/get-column-header-underline'
import type { ScalingTvsTableRow } from '../../_utils/to-table-rows'
import { TotalValueSecuredCell } from './total-value-secured-cell'
import { ValueSecuredCell } from './value-secured-cell'

const columnHelper = createColumnHelper<ScalingTvsTableRow>()

export const scalingTvsColumns = [
  ...getScalingCommonProjectColumns(columnHelper),
  columnHelper.group({
    id: 'data',
    header: undefined,
    columns: [
      columnHelper.accessor(
        (col) => {
          if (!col.tvs.data) {
            return undefined
          }
          const { breakdown } = col.tvs.data
          if (
            breakdown.canonical + breakdown.external + breakdown.native ===
            0
          ) {
            return 0
          }
          return breakdown.canonical + breakdown.external + breakdown.native
        },
        {
          id: 'total',
          header: 'Total',
          cell: (ctx) => {
            const data = ctx.row.original.tvs.data
            if (!data) {
              return <NoDataBadge />
            }
            return (
              <TotalValueSecuredCell
                tvsWarnings={ctx.row.original.tvs.warnings}
                breakdown={{
                  canonical: data.breakdown.canonical,
                  external: data.breakdown.external,
                  native: data.breakdown.native,
                }}
                change={data.change.total}
              />
            )
          },
          sortUndefined: 'last',
          meta: {
            align: 'center',
            tooltip: 'Total = Canonical + External + Native',
          },
        },
      ),
    ],
  }),
  columnHelper.accessor('tvs.data.breakdown.canonical', {
    id: 'canonical',
    header: 'Canonical',
    cell: (ctx) => {
      const data = ctx.row.original.tvs.data
      if (!data) {
        return <NoDataBadge />
      }

      return (
        <ValueSecuredCell
          value={data.breakdown.canonical}
          change={data.change.canonical}
        />
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
      tooltip:
        'These tokens use L1 Ethereum as their main ledger and are bridged to L2 via a canonical bridge locking tokens in L1 escrow and minting on L2 an IOU representation of that token. The value is displayed together with a percentage change compared to 7D ago.',
      headClassName: getColumnHeaderUnderline('before:bg-purple-100'),
    },
  }),
  columnHelper.accessor('tvs.data.breakdown.external', {
    id: 'external',
    header: 'External',
    cell: (ctx) => {
      const data = ctx.row.original.tvs.data
      if (!data) {
        return <NoDataBadge />
      }

      return (
        <ValueSecuredCell
          value={data.breakdown.external}
          change={data.change.external}
        />
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
      tooltip:
        'These tokens use some external blockchain as their main ledger and are bridged to L2 via a non-canonical bridge. Tokens are locked on their native ledger and the bridge is minting on L2 an IOU representation of that token. The value is displayed together with a percentage change compared to 7D ago.',
      headClassName: getColumnHeaderUnderline('before:bg-yellow-200'),
    },
  }),
  columnHelper.accessor('tvs.data.breakdown.native', {
    id: 'native',
    header: 'Native',
    cell: (ctx) => {
      const data = ctx.row.original.tvs.data
      if (!data) {
        return <NoDataBadge />
      }

      return (
        <ValueSecuredCell
          value={data.breakdown.native}
          change={data.change.native}
        />
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
      tooltip:
        'These tokens are using L2 as their ledger and are minted directly on L2. Note that for some tokens (omnichain tokens) their ledger is distributed across many blockchains and they can be moved to L2 via a burn-mint bridge. The value is displayed together with a percentage change compared to 7D ago.',
      headClassName: getColumnHeaderUnderline('before:bg-pink-100'),
    },
  }),
]
