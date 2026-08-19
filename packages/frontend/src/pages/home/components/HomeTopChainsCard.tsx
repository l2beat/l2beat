import { formatDollarValueNumber } from '@l2beat/shared-pure'
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
import { TopNBadge } from '~/pages/interop/summary/components/TopNBadge'
import { toTableRows } from '~/pages/layer2s/summary/utils/toTableRows'
import type { L2SummaryEntry } from '~/server/features/layer2s/summary/getL2SummaryEntries'
import type { TvsTableData } from '~/server/features/layer2s/tvs/getTvsTableData'
import { HomeCard } from './HomeCard'
import { HomeCardHeader } from './HomeCardHeader'

interface Props {
  entries: L2SummaryEntry[]
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
        title="Layer 2s"
        badge={<TopNBadge n={5} />}
        href="/layer2s/summary"
        linkLabel="View all"
      />
      <div className="mt-2 flex-1">
        <BasicTable table={table} compact />
      </div>
    </HomeCard>
  )
}

type HomeTopChainRow = ReturnType<typeof toTableRows>[number]

const columnHelper = createColumnHelper<HomeTopChainRow>()

function getHomeTopChainsColumns() {
  const [_index, ...rest] = getCommonProjectColumns(
    columnHelper,
    (row) => `/layer2s/projects/${row.slug}`,
  )

  return [
    ...rest,
    columnHelper.accessor((row) => row.name, {
      id: 'name',
      cell: (ctx) => (
        <div className="flex h-full items-center">
          <ProjectNameInfoTooltip project={ctx.row.original}>
            <TableLink href={`/layer2s/projects/${ctx.row.original.slug}`}>
              <ProjectNameCell project={ctx.row.original} withInfoTooltip />
            </TableLink>
          </ProjectNameInfoTooltip>
        </div>
      ),
      meta: {
        cellClassName: 'lg:pl-2.5',
        headClassName: 'lg:pl-2.5',
      },
      enableHiding: false,
    }),
    columnHelper.display({
      id: 'stage',
      header: 'Stage',
      cell: (ctx) => (
        <StageCell
          href={`/layer2s/projects/${ctx.row.original.slug}#stage`}
          stageConfig={ctx.row.original.stage}
          isAppchain={ctx.row.original.capability === 'appchain'}
          emergencyWarning={ctx.row.original.statuses?.emergencyWarning}
        />
      ),
      meta: {
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
          href={`/layer2s/projects/${ctx.row.original.slug}#risk-analysis`}
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
          <TableLink href={`/layer2s/tvs?highlight=${ctx.row.original.slug}`}>
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
  ]
}
