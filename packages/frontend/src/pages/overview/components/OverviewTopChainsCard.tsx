import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { PizzaRosetteCell } from '~/components/rosette/pizza/PizzaRosetteCell'
import { SyncStatusWrapper } from '~/components/SyncStatusWrapper'
import { BasicTable } from '~/components/table/BasicTable'
import {
  ProjectNameCell,
  ProjectNameInfoTooltip,
} from '~/components/table/cells/ProjectNameCell'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import { getCommonProjectColumns } from '~/components/table/common-project-columns/CommonProjectColumns'
import { useTvsDisplayControlsContext } from '~/components/table/display/contexts/TvsDisplayControlsContext'
import { TableLink } from '~/components/table/TableLink'
import { EM_DASH } from '~/consts/characters'
import { useTable } from '~/hooks/useTable'
import { ChevronIcon } from '~/icons/Chevron'
import { toTableRows } from '~/pages/scaling/summary/utils/toTableRows'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import { api } from '~/trpc/React'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatDollarValueNumber } from '~/utils/number-format/formatDollarValueNumber'

interface Props {
  entries: ScalingSummaryEntry[]
  chainVolumeMap: Record<string, number>
}

export function OverviewTopChainsCard({ entries, chainVolumeMap }: Props) {
  const { display } = useTvsDisplayControlsContext()
  const { data: tvsTable, isLoading: isTvsLoading } = api.tvs.table.useQuery({
    type: 'rollups',
    excludeAssociatedTokens: display.excludeAssociatedTokens,
    excludeRwaRestrictedTokens: display.excludeRwaRestrictedTokens,
  })

  const tableEntries = useMemo<OverviewTopChainRow[]>(() => {
    const rows = toTableRows({
      entries,
      data: tvsTable?.projects,
    })
    return rows.map((row) => ({
      ...row,
      volume24h: chainVolumeMap[row.id.toString()] ?? chainVolumeMap[row.slug],
    }))
  }, [entries, tvsTable, chainVolumeMap])

  const columns = useMemo(
    () => getOverviewTopChainsColumns({ isTvsLoading }),
    [isTvsLoading],
  )

  const table = useTable({
    data: tableEntries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting: false,
  })

  return (
    <PrimaryCard className="flex h-full flex-col">
      <Header />
      <div className="mt-3 flex-1">
        <BasicTable table={table} />
      </div>
    </PrimaryCard>
  )
}

function Header() {
  return (
    <div className="flex items-center gap-3">
      <span className="font-bold text-xl">Top chains</span>
      <a
        className="flex h-[28px] items-center justify-center gap-1 rounded-md border border-link-stroke px-3 py-2 font-bold text-[13px] text-link leading-none"
        href="/scaling/summary"
      >
        View all
        <ChevronIcon className="-rotate-90 size-2.5 fill-current" />
      </a>
    </div>
  )
}

type OverviewTopChainRow = ReturnType<typeof toTableRows>[number] & {
  volume24h: number | undefined
}

const columnHelper = createColumnHelper<OverviewTopChainRow>()

function getOverviewTopChainsColumns(opts?: { isTvsLoading?: boolean }) {
  return [
    ...getCommonProjectColumns(
      columnHelper,
      (row) => `/scaling/projects/${row.slug}`,
    ),
    columnHelper.accessor((row) => row.name, {
      id: 'name',
      cell: (ctx) => (
        <div className="flex h-full items-center">
          <ProjectNameInfoTooltip project={ctx.row.original}>
            <TableLink href={`/scaling/projects/${ctx.row.original.slug}`}>
              <ProjectNameCell project={ctx.row.original} withInfoTooltip />
            </TableLink>
          </ProjectNameInfoTooltip>
        </div>
      ),
      enableHiding: false,
    }),
    columnHelper.display({
      id: 'risks',
      header: 'Risks',
      cell: (ctx) => (
        <PizzaRosetteCell
          values={ctx.row.original.risks}
          isUnderReview={!!ctx.row.original.statuses?.underReview}
          href={`/scaling/projects/${ctx.row.original.slug}#risk-analysis`}
        />
      ),
      meta: {
        align: 'center',
      },
    }),
    columnHelper.accessor((row) => row.tvs.breakdown?.total ?? 0, {
      id: 'total',
      header: 'Value secured',
      cell: (ctx) => {
        if (opts?.isTvsLoading) {
          return (
            <div className="flex justify-end">
              <Skeleton className="h-6 w-28" />
            </div>
          )
        }
        const value = ctx.row.original.tvs
        const total = value.breakdown?.total
        if (total === undefined) {
          return <NoDataBadge />
        }
        return (
          <TableLink href={`/scaling/tvs?highlight=${ctx.row.original.slug}`}>
            <SyncStatusWrapper isSynced={!value.syncWarning}>
              <div className="flex justify-end">
                <ValueWithPercentageChange change={value.change?.total}>
                  {formatDollarValueNumber(total)}
                </ValueWithPercentageChange>
              </div>
            </SyncStatusWrapper>
          </TableLink>
        )
      },
      meta: {
        align: 'right',
        cellClassName: 'pl-3',
        tooltip:
          'Total value secured is calculated as the sum of canonically bridged tokens, externally bridged tokens, and native tokens, shown together with a percentage change compared to 7D ago.',
      },
    }),
    columnHelper.accessor((row) => row.volume24h ?? -1, {
      id: 'volume24h',
      header: '24h volume',
      cell: (ctx) => {
        const volume = ctx.row.original.volume24h
        if (volume === undefined || volume <= 0) {
          return <span className="text-secondary">{EM_DASH}</span>
        }
        return (
          <span className="font-medium tabular-nums">
            {formatCurrency(volume, 'usd')}
          </span>
        )
      },
      meta: {
        align: 'right',
        tooltip:
          'Total interop volume routed to/from this chain over the last 24h.',
      },
    }),
    columnHelper.accessor('activity.pastDayUops', {
      id: 'uops',
      header: 'Past day UOPS',
      cell: (ctx) => {
        const data = ctx.row.original.activity
        if (!data) {
          return <NoDataBadge />
        }
        return (
          <TableLink
            href={`/scaling/activity?highlight=${ctx.row.original.slug}`}
          >
            <SyncStatusWrapper isSynced={data.isSynced}>
              <ValueWithPercentageChange change={data.change}>
                {formatActivityCount(ctx.getValue() ?? 0)}
              </ValueWithPercentageChange>
            </SyncStatusWrapper>
          </TableLink>
        )
      },
      meta: {
        align: 'right',
        tooltip:
          'User operations per second averaged over the past day, shown together with a percentage change compared to 7D ago.',
      },
    }),
  ]
}
