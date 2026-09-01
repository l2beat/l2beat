import type { TvsToken } from '@l2beat/config'
import { createColumnHelper } from '@tanstack/react-table'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { Skeleton } from '~/components/core/Skeleton'
import { SyncStatusWrapper } from '~/components/SyncStatusWrapper'
import type { CommonProjectColumnsOptions } from '~/components/table/common-project-columns/CommonProjectColumns'
import { getL2CommonProjectColumns } from '~/components/table/common-project-columns/L2CommonProjectColumns'
import { getFilterSearchParams } from '~/components/table/filters/utils/getFilterSearchParams'
import { withChangeSort } from '~/components/table/sorting/changeSortColumn'
import { categoryToLabel } from '~/pages/layer2s/project/tvs-breakdown/components/tables/categoryToLabel'
import { sourceToLabel } from '~/server/features/layer2s/tvs/utils/sourceToLabel'
import { getColumnHeaderUnderline } from '~/utils/table/getColumnHeaderUnderline'
import { TableLink } from '../../../../../components/table/TableLink'
import type { L2TvsTableRow } from '../../utils/toTableRows'
import { TotalValueSecuredCell } from './TotalValueSecuredCell'
import { ValueSecuredCell } from './ValueSecuredCell'

const columnHelper = createColumnHelper<L2TvsTableRow>()

export const getL2TvsColumns = (
  opts: CommonProjectColumnsOptions & {
    breakdownType: 'bridgeType' | 'assetCategory'
    excludeRwaRestrictedTokens?: boolean
    isTvsLoading?: boolean
  },
) => [
  ...getL2CommonProjectColumns(
    columnHelper,
    (row) => `/layer2s/projects/${row.slug}#tvs`,
    opts,
  ),
  columnHelper.group({
    id: 'data',
    header: undefined,
    columns: withChangeSort(
      columnHelper,
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
                href={`/layer2s/projects/${ctx.row.original.slug}/tvs-breakdown`}
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
                additionalTrustAssumptionsPercentage={
                  data.additionalTrustAssumptionsPercentage
                }
                change={data.change.total}
                changePeriod={data.changePeriod}
                associatedTokens={ctx.row.original.tvs.associatedTokens}
                syncWarning={ctx.row.original.tvs.syncWarning}
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
      (row) => ({
        change: row.tvs.data?.change.total,
        period: row.tvs.data?.changePeriod,
      }),
    ),
  }),
  ...(opts?.breakdownType === 'bridgeType'
    ? getTokenBridgeTypeColumns(opts)
    : getTokenAssetCategoryColumns(opts)),
]

function tvsBreakdownColumn<
  T extends
    | TvsToken['category']
    | Exclude<TvsToken['source'], 'custom-canonical'>,
>(opts: {
  id: string
  header: string
  dataKey: T
  type: 'bridgingType' | 'category'
  isTvsLoading?: boolean
  meta: {
    align: 'right'
    cellClassName?: string
    tooltip?: string
    headClassName: string
  }
}) {
  return withChangeSort(
    columnHelper,
    columnHelper.accessor((row) => row.tvs.data?.breakdown[opts.dataKey], {
      id: opts.id,
      header: opts.header,
      cell: (ctx) => (
        <BreakdownCell
          row={ctx.row.original}
          dataKey={opts.dataKey}
          type={opts.type}
          isTvsLoading={opts.isTvsLoading}
        />
      ),
      sortUndefined: 'last',
      meta: opts.meta,
    }),
    (row) => ({
      change: row.tvs.data?.change[opts.dataKey],
      period: row.tvs.data?.changePeriod,
    }),
  )
}

function getTokenBridgeTypeColumns(opts: { isTvsLoading?: boolean }) {
  return [
    ...tvsBreakdownColumn({
      id: 'canonical',
      header: 'Canonically bridged',
      dataKey: 'canonical',
      type: 'bridgingType',
      isTvsLoading: opts.isTvsLoading,
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
    ...tvsBreakdownColumn({
      id: 'native',
      header: 'Natively minted',
      dataKey: 'native',
      type: 'bridgingType',
      isTvsLoading: opts.isTvsLoading,
      meta: {
        cellClassName: 'w-1/3',
        align: 'right',
        tooltip:
          'These tokens are using L2 as their ledger and are minted directly on L2. Note that for some tokens (omnichain tokens) their ledger is distributed across many blockchains and they can be moved to L2 via a burn-mint bridge. The value is displayed together with a percentage change compared to 7D ago.',
        headClassName: getColumnHeaderUnderline('before:bg-chart-stacked-pink'),
      },
    }),
    ...tvsBreakdownColumn({
      id: 'external',
      header: 'Externally bridged',
      dataKey: 'external',
      type: 'bridgingType',
      isTvsLoading: opts.isTvsLoading,
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

function getTokenAssetCategoryColumns(opts: {
  excludeRwaRestrictedTokens?: boolean
  isTvsLoading?: boolean
}) {
  return [
    ...tvsBreakdownColumn({
      id: 'ether',
      header: 'ETH & derivatives',
      dataKey: 'ether',
      type: 'category',
      isTvsLoading: opts.isTvsLoading,
      meta: {
        align: 'right',
        headClassName: getColumnHeaderUnderline('before:bg-chart-ethereum'),
      },
    }),
    ...tvsBreakdownColumn({
      id: 'stablecoins',
      header: 'Stablecoins',
      dataKey: 'stablecoin',
      type: 'category',
      isTvsLoading: opts.isTvsLoading,
      meta: {
        align: 'right',
        headClassName: getColumnHeaderUnderline('before:bg-chart-teal'),
      },
    }),
    ...tvsBreakdownColumn({
      id: 'btc',
      header: 'BTC & derivatives',
      dataKey: 'btc',
      type: 'category',
      isTvsLoading: opts.isTvsLoading,
      meta: {
        align: 'right',
        headClassName: getColumnHeaderUnderline('before:bg-chart-orange'),
      },
    }),
    ...tvsBreakdownColumn({
      id: 'other',
      header: 'Other',
      dataKey: 'other',
      type: 'category',
      isTvsLoading: opts.isTvsLoading,
      meta: {
        align: 'right',
        headClassName: getColumnHeaderUnderline('before:bg-chart-yellow-lime'),
      },
    }),
    ...tvsBreakdownColumn({
      id: 'rwaPublic',
      header: 'Public RWAs',
      dataKey: 'rwaPublic',
      type: 'category',
      isTvsLoading: opts.isTvsLoading,
      meta: {
        align: 'right',
        headClassName: getColumnHeaderUnderline('before:bg-lime-650 last:pr-3'),
      },
    }),
    ...(!opts.excludeRwaRestrictedTokens
      ? tvsBreakdownColumn({
          id: 'rwaRestricted',
          header: 'Restricted RWAs',
          dataKey: 'rwaRestricted',
          type: 'category',
          isTvsLoading: opts.isTvsLoading,
          meta: {
            align: 'right',
            headClassName: getColumnHeaderUnderline(
              'before:bg-pink-750 last:pr-3',
            ),
          },
        })
      : []),
  ]
}

function BreakdownCell({
  row,
  dataKey,
  type,
  isTvsLoading,
}: {
  row: L2TvsTableRow
  dataKey:
    | TvsToken['category']
    | Exclude<TvsToken['source'], 'custom-canonical'>
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
          ? `/layer2s/projects/${row.slug}/tvs-breakdown?filters=${filters}#tvs-breakdown-token-table`
          : undefined
      }
    >
      <SyncStatusWrapper isSynced={!row.tvs.syncWarning}>
        <ValueSecuredCell
          value={data.breakdown[dataKey]}
          change={data.change[dataKey]}
          changePeriod={data.changePeriod}
        />
      </SyncStatusWrapper>
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
      return sourceToLabel(dataKey)
  }
}
