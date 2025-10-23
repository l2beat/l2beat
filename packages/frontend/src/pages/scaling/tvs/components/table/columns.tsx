import type { TvsToken } from '@l2beat/config'
import { createColumnHelper } from '@tanstack/react-table'
import capitalize from 'lodash/capitalize'
import compact from 'lodash/compact'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { Skeleton } from '~/components/core/Skeleton'
import { getFilterSearchParams } from '~/components/table/filters/utils/getFilterSearchParams'
import type { CommonProjectColumnsOptions } from '~/components/table/utils/common-project-columns/CommonProjectColumns'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/ScalingCommonProjectColumns'
import { categoryToLabel } from '~/pages/scaling/project/tvs-breakdown/components/tables/categoryToLabel'
import { getColumnHeaderUnderline } from '~/utils/table/getColumnHeaderUnderline'
import { TableLink } from '../../../../../components/table/TableLink'
import type { ScalingTvsTableRow } from '../../utils/ToTableRows'
import { TotalValueSecuredCell } from './TotalValueSecuredCell'
import { ValueSecuredCell } from './ValueSecuredCell'

const columnHelper = createColumnHelper<ScalingTvsTableRow>()

export const getScalingTvsColumns = (
  opts: CommonProjectColumnsOptions & {
    breakdownType: 'bridgeType' | 'assetCategory'
    includeRwaRestrictedTokens: boolean
    isTvsLoading?: boolean
  },
) => [
  ...getScalingCommonProjectColumns(
    columnHelper,
    (row) => `/scaling/projects/${row.slug}#tvs`,
    opts,
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
            if (opts?.isTvsLoading) {
              return (
                <div className="flex justify-center">
                  <Skeleton className="h-6 w-45" />
                </div>
              )
            }
            const data = ctx.row.original.tvs.data
            if (!data) {
              return <NoDataBadge />
            }
            return (
              <TotalValueSecuredCell
                href={`/scaling/projects/${ctx.row.original.slug}/tvs-breakdown`}
                tvsWarnings={ctx.row.original.tvs.warnings}
                total={data.breakdown.total}
                breakdown={
                  opts?.breakdownType === 'bridgeType'
                    ? {
                        type: 'bridgeType',
                        canonical: data.breakdown.canonical,
                        external: data.breakdown.external,
                        native: data.breakdown.native,
                      }
                    : {
                        type: 'assetCategory',
                        ether: data.breakdown.ether,
                        associated: 0,
                        stablecoin: data.breakdown.stablecoin,
                        btc: data.breakdown.btc,
                        other: data.breakdown.other,
                        rwaPublic: data.breakdown.rwaPublic,
                        rwaRestricted: data.breakdown.rwaRestricted,
                      }
                }
                change={data.change.total}
                associatedTokens={ctx.row.original.tvs.associatedTokens}
              />
            )
          },
          sortUndefined: 'last',
          meta: {
            cellClassName: 'w-[240px] min-w-[240px]',
            align: 'center',
            tooltip: 'Total = Canonical + External + Native',
          },
        },
      ),
    ],
  }),
  ...(opts?.breakdownType === 'bridgeType'
    ? getTokenBridgeTypeColumns(opts)
    : getTokenAssetCategoryColumns(opts)),
]

function getTokenBridgeTypeColumns(opts: { isTvsLoading?: boolean }) {
  return [
    columnHelper.accessor('tvs.data.breakdown.canonical', {
      id: 'canonical',
      header: 'Canonically bridged',
      cell: (ctx) => (
        <BreakdownCell
          row={ctx.row.original}
          dataKey="canonical"
          type="bridgingType"
          isTvsLoading={opts?.isTvsLoading}
        />
      ),
      sortUndefined: 'last',
      meta: {
        cellClassName: 'w-1/3',
        align: 'right',
        tooltip:
          'These tokens use L1 Ethereum as their main ledger and are bridged to L2 via a canonical bridge locking tokens in L1 escrow and minting on L2 an IOU representation of that token. The value is displayed together with a percentage change compared to 7D ago.',
        headClassName: getColumnHeaderUnderline(
          'before:bg-chart-stacked-purple',
        ),
      },
    }),
    columnHelper.accessor('tvs.data.breakdown.native', {
      id: 'native',
      header: 'Natively minted',
      cell: (ctx) => (
        <BreakdownCell
          row={ctx.row.original}
          dataKey="native"
          type="bridgingType"
          isTvsLoading={opts?.isTvsLoading}
        />
      ),
      sortUndefined: 'last',
      meta: {
        cellClassName: 'w-1/3',
        align: 'right',
        tooltip:
          'These tokens are using L2 as their ledger and are minted directly on L2. Note that for some tokens (omnichain tokens) their ledger is distributed across many blockchains and they can be moved to L2 via a burn-mint bridge. The value is displayed together with a percentage change compared to 7D ago.',
        headClassName: getColumnHeaderUnderline('before:bg-chart-stacked-pink'),
      },
    }),
    columnHelper.accessor('tvs.data.breakdown.external', {
      id: 'external',
      header: 'Externally bridged',
      cell: (ctx) => (
        <BreakdownCell
          row={ctx.row.original}
          dataKey="external"
          type="bridgingType"
          isTvsLoading={opts?.isTvsLoading}
        />
      ),
      sortUndefined: 'last',
      meta: {
        cellClassName: 'w-1/3',
        align: 'right',
        tooltip:
          'These tokens use some external blockchain as their main ledger and are bridged to L2 via a non-canonical bridge. Tokens are locked on their native ledger and the bridge is minting on L2 an IOU representation of that token. The value is displayed together with a percentage change compared to 7D ago.',
        headClassName: getColumnHeaderUnderline(
          'before:bg-chart-stacked-yellow last:pr-3',
        ),
      },
    }),
  ]
}

const getTokenAssetCategoryColumns = (opts: {
  includeRwaRestrictedTokens: boolean
  isTvsLoading?: boolean
}) =>
  compact([
    columnHelper.accessor('tvs.data.breakdown.ether', {
      id: 'ether',
      header: 'ETH & derivatives',
      cell: (ctx) => (
        <BreakdownCell
          row={ctx.row.original}
          dataKey="ether"
          type="category"
          isTvsLoading={opts?.isTvsLoading}
        />
      ),
      sortUndefined: 'last',
      meta: {
        align: 'right',
        headClassName: getColumnHeaderUnderline('before:bg-chart-ethereum'),
      },
    }),
    columnHelper.accessor('tvs.data.breakdown.stablecoin', {
      id: 'stablecoins',
      header: 'Stablecoins',
      cell: (ctx) => (
        <BreakdownCell
          row={ctx.row.original}
          dataKey="stablecoin"
          type="category"
          isTvsLoading={opts?.isTvsLoading}
        />
      ),
      sortUndefined: 'last',
      meta: {
        align: 'right',
        headClassName: getColumnHeaderUnderline('before:bg-chart-teal'),
      },
    }),
    columnHelper.accessor('tvs.data.breakdown.btc', {
      id: 'btc',
      header: 'BTC & derivatives',
      cell: (ctx) => (
        <BreakdownCell
          row={ctx.row.original}
          dataKey="btc"
          type="category"
          isTvsLoading={opts?.isTvsLoading}
        />
      ),
      sortUndefined: 'last',
      meta: {
        align: 'right',
        headClassName: getColumnHeaderUnderline('before:bg-chart-orange'),
      },
    }),
    columnHelper.accessor('tvs.data.breakdown.other', {
      id: 'other',
      header: 'Other',
      cell: (ctx) => (
        <BreakdownCell
          row={ctx.row.original}
          dataKey="other"
          type="category"
          isTvsLoading={opts?.isTvsLoading}
        />
      ),
      sortUndefined: 'last',
      meta: {
        align: 'right',
        headClassName: getColumnHeaderUnderline('before:bg-chart-yellow-lime'),
      },
    }),
    columnHelper.accessor('tvs.data.breakdown.rwaPublic', {
      id: 'rwaPublic',
      header: 'Public RWAs',
      cell: (ctx) => (
        <BreakdownCell
          row={ctx.row.original}
          dataKey="rwaPublic"
          type="category"
          isTvsLoading={opts?.isTvsLoading}
        />
      ),
      sortUndefined: 'last',
      meta: {
        align: 'right',
        headClassName: getColumnHeaderUnderline('before:bg-lime-650 last:pr-3'),
      },
    }),
    opts.includeRwaRestrictedTokens &&
      columnHelper.accessor('tvs.data.breakdown.rwaRestricted', {
        id: 'rwaRestricted',
        header: 'Restricted RWAs',
        cell: (ctx) => (
          <BreakdownCell
            row={ctx.row.original}
            dataKey="rwaRestricted"
            type="category"
            isTvsLoading={opts?.isTvsLoading}
          />
        ),
        sortUndefined: 'last',
        meta: {
          align: 'right',
          headClassName: getColumnHeaderUnderline(
            'before:bg-pink-750 last:pr-3',
          ),
        },
      }),
  ])

function BreakdownCell({
  row,
  dataKey,
  type,
  isTvsLoading,
}: {
  row: ScalingTvsTableRow
  dataKey: TvsToken['category'] | TvsToken['source']
  type: 'bridgingType' | 'category'
  isTvsLoading?: boolean
}) {
  if (isTvsLoading) {
    return (
      <div className="flex justify-end">
        <Skeleton className="h-6 w-full" />
      </div>
    )
  }
  const data = row.tvs.data
  if (!data) {
    return <NoDataBadge />
  }

  const filters = getFilterSearchParams({
    [type]: {
      values: [dataKeyToFilter(dataKey)],
    },
  })

  return (
    <TableLink
      href={
        data.breakdown[dataKey] > 0
          ? `/scaling/projects/${row.slug}/tvs-breakdown?filters=${filters}#tvs-breakdown-token-table`
          : undefined
      }
    >
      <ValueSecuredCell
        value={data.breakdown[dataKey]}
        change={data.change[dataKey]}
      />
    </TableLink>
  )
}

function dataKeyToFilter(dataKey: TvsToken['category'] | TvsToken['source']) {
  switch (dataKey) {
    case 'ether':
    case 'btc':
    case 'stablecoin':
    case 'other':
    case 'rwaPublic':
    case 'rwaRestricted':
      return categoryToLabel(dataKey)
    default:
      return capitalize(dataKey)
  }
}
