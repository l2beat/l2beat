import { createColumnHelper } from '@tanstack/react-table'
import { NoDataBadge } from '~/components/badge/no-data-badge'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/scaling-common-project-columns'
import { getColumnHeaderUnderline } from '~/utils/table/get-column-header-underline'
import { TableLink } from '../../../../../../components/table/table-link'
import type { ScalingTvsTableRow } from '../../_utils/to-table-rows'
import { TotalValueSecuredCell } from './total-value-secured-cell'
import { ValueSecuredCell } from './value-secured-cell'

const columnHelper = createColumnHelper<ScalingTvsTableRow>()

export const scalingTvsColumns = [
  ...getScalingCommonProjectColumns(
    columnHelper,
    (row) => `/scaling/projects/${row.slug}#tvs`,
  ),
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
                href={`/scaling/projects/${ctx.row.original.slug}/tvs-breakdown`}
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
      const children = (
        <ValueSecuredCell
          value={data.breakdown.canonical}
          change={data.change.canonical}
        />
      )
      return (
        <TableLink
          href={
            data.breakdown.canonical > 0
              ? `/scaling/projects/${ctx.row.original.slug}/tvs-breakdown#canonical`
              : undefined
          }
        >
          {children}
        </TableLink>
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
      tooltip:
        'These tokens use L1 Ethereum as their main ledger and are bridged to L2 via a canonical bridge locking tokens in L1 escrow and minting on L2 an IOU representation of that token. The value is displayed together with a percentage change compared to 7D ago.',
      headClassName: getColumnHeaderUnderline('before:bg-chart-stacked-purple'),
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
      const children = (
        <ValueSecuredCell
          value={data.breakdown.native}
          change={data.change.native}
        />
      )
      return (
        <TableLink
          href={
            data.breakdown.native > 0
              ? `/scaling/projects/${ctx.row.original.slug}/tvs-breakdown#native`
              : undefined
          }
        >
          {children}
        </TableLink>
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
      tooltip:
        'These tokens are using L2 as their ledger and are minted directly on L2. Note that for some tokens (omnichain tokens) their ledger is distributed across many blockchains and they can be moved to L2 via a burn-mint bridge. The value is displayed together with a percentage change compared to 7D ago.',
      headClassName: getColumnHeaderUnderline('before:bg-chart-stacked-pink'),
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
      const children = (
        <ValueSecuredCell
          value={data.breakdown.external}
          change={data.change.external}
        />
      )
      return (
        <TableLink
          href={
            data.breakdown.external > 0
              ? `/scaling/projects/${ctx.row.original.slug}/tvs-breakdown#external`
              : undefined
          }
        >
          {children}
        </TableLink>
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
      tooltip:
        'These tokens use some external blockchain as their main ledger and are bridged to L2 via a non-canonical bridge. Tokens are locked on their native ledger and the bridge is minting on L2 an IOU representation of that token. The value is displayed together with a percentage change compared to 7D ago.',
      headClassName: getColumnHeaderUnderline('before:bg-chart-stacked-yellow'),
    },
  }),
]
