import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { PizzaRosetteCell } from '~/components/rosette/pizza/PizzaRosetteCell'
import { SyncStatusWrapper } from '~/components/SyncStatusWrapper'
import { BasicTable } from '~/components/table/BasicTable'
import {
  ProjectNameCell,
  ProjectNameInfoTooltip,
} from '~/components/table/cells/ProjectNameCell'
import { StageCell } from '~/components/table/cells/stage/StageCell'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import { getCommonProjectColumns } from '~/components/table/common-project-columns/CommonProjectColumns'
import { TableLink } from '~/components/table/TableLink'
import { useTable } from '~/hooks/useTable'
import { toTableRows } from '~/pages/scaling/summary/utils/toTableRows'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import type { TvsTableData } from '~/server/features/scaling/tvs/getTvsTableData'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'
import { formatDollarValueNumber } from '~/utils/number-format/formatDollarValueNumber'
import { HomeCard } from './HomeCard'
import { HomeCardHeader } from './HomeCardHeader'

interface Props {
  entries: ScalingSummaryEntry[]
  tvsData: TvsTableData
}

export function HomeTopChainsCard({ entries, tvsData }: Props) {
  const tableEntries = useMemo(
    () =>
      toTableRows({
        entries,
        data: tvsData,
      }),
    [entries, tvsData],
  )

  const columns = useMemo(() => getHomeTopChainsColumns(), [])

  const table = useTable({
    data: tableEntries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting: false,
    initialState: {
      sorting: [],
    },
  })

  return (
    <HomeCard className="flex h-full min-w-0 flex-col">
      <HomeCardHeader
        title="Top chains"
        href="/scaling/summary"
        linkLabel="View all"
      />
      <div className="mt-3 flex-1">
        <BasicTable table={table} />
      </div>
    </HomeCard>
  )
}

type HomeTopChainRow = ReturnType<typeof toTableRows>[number]

const columnHelper = createColumnHelper<HomeTopChainRow>()

function getHomeTopChainsColumns() {
  const [_index, ...rest] = getCommonProjectColumns(
    columnHelper,
    (row) => `/scaling/projects/${row.slug}`,
  )

  return [
    ...rest,
    columnHelper.accessor((row) => row.name, {
      id: 'name',
      cell: (ctx) => (
        <div className="flex h-full items-center">
          <ProjectNameInfoTooltip project={ctx.row.original}>
            <TableLink
              href={`/scaling/projects/${ctx.row.original.slug}`}
              className="md:-ml-1.5 md:pl-1.5"
            >
              <ProjectNameCell project={ctx.row.original} withInfoTooltip />
            </TableLink>
          </ProjectNameInfoTooltip>
        </div>
      ),
      enableHiding: false,
    }),
    columnHelper.display({
      id: 'stage',
      header: 'Stage',
      cell: (ctx) => (
        <StageCell
          href={`/scaling/projects/${ctx.row.original.slug}#stage`}
          stageConfig={ctx.row.original.stage}
          isAppchain={ctx.row.original.capability === 'appchain'}
          emergencyWarning={ctx.row.original.statuses?.emergencyWarning}
        />
      ),
      meta: {
        align: 'center',
        tooltip:
          'Project stage where applicable, based on L2BEAT staging criteria.',
      },
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
