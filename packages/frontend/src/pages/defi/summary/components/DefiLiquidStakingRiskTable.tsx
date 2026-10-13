import type { ProjectDefiLiquidStakingRisks } from '@l2beat/config'
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import {
  ProjectNameCell,
  ProjectNameInfoTooltip,
} from '~/components/table/cells/ProjectNameCell'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns/CommonProjectColumns'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sortTableValues'
import { TableLink } from '~/components/table/TableLink'
import { useTable } from '~/hooks/useTable'
import type { DefiSummaryEntry } from '~/server/features/defi/getDefiSummaryEntries'
import { DefiTvlCell } from './DefiTvlCell'

export type DefiLiquidStakingRiskEntry = DefiSummaryEntry & {
  liquidStaking: ProjectDefiLiquidStakingRisks
}

type RiskKey = Exclude<keyof ProjectDefiLiquidStakingRisks, 'token'>

const columnHelper = createColumnHelper<DefiLiquidStakingRiskEntry>()

function riskColumn(key: RiskKey, header: string, tooltip: string) {
  return columnHelper.accessor((e) => adjustTableValue(e.liquidStaking[key]), {
    id: key,
    header,
    meta: { tooltip },
    cell: (ctx) => (
      <TableValueCell
        value={ctx.row.original.liquidStaking[key]}
        href={ctx.row.original.href}
      />
    ),
    sortDescFirst: true,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(
        a.original.liquidStaking[key],
        b.original.liquidStaking[key],
      ),
  })
}

const columns = [
  ...getCommonProjectColumns(columnHelper, (row) => row.href),
  columnHelper.accessor('name', {
    header: 'Name',
    enableHiding: false,
    cell: (ctx) => {
      // The protocol name, not the token: the second line lists the tickers.
      const project = {
        name: ctx.row.original.name,
        shortName: undefined,
        slug: ctx.row.original.slug,
        icon: ctx.row.original.icon,
        backgroundColor: undefined,
        description: ctx.row.original.description,
        statuses: {
          underReview: ctx.row.original.isUnderReview ? 'config' : undefined,
        },
      } as const

      return (
        <ProjectNameInfoTooltip project={project}>
          <TableLink href={ctx.row.original.href}>
            <TwoRowCell>
              <TwoRowCell.First>
                <ProjectNameCell project={project} withInfoTooltip />
              </TwoRowCell.First>
              <TwoRowCell.Second>
                {ctx.row.original.tokens?.join(', ')}
              </TwoRowCell.Second>
            </TwoRowCell>
          </TableLink>
        </ProjectNameInfoTooltip>
      )
    },
    enableSorting: false,
    meta: {
      cellClassName: 'pl-4',
      headClassName: 'pl-4',
    },
  }),
  columnHelper.accessor('totalValueLockedUsd', {
    header: 'TVL',
    cell: (ctx) => (
      <DefiTvlCell
        value={ctx.getValue()}
        dataSource={ctx.row.original.tvlDataSource}
      />
    ),
    sortUndefined: 'last',
    meta: {
      align: 'right',
      tooltip: 'Total USD value of assets locked in the protocol.',
    },
  }),
  riskColumn(
    'minting',
    'Minting',
    'Who can mint the token, and who decides where deposited ETH is staked?',
  ),
  riskColumn(
    'operators',
    'Operators',
    'Who runs the validators, and who bears the loss if they are slashed?',
  ),
  riskColumn(
    'backing',
    'Backing',
    'Where is the staked ETH held, and who controls its withdrawal keys?',
  ),
  riskColumn(
    'exchangeRate',
    'Oracle',
    'Who reports the exchange rate, and how far can one report move it?',
  ),
  riskColumn(
    'exit',
    'Exit',
    'How do holders get their ETH back, and can anyone stop them?',
  ),
  riskColumn(
    'upgrades',
    'Upgrades',
    'Who can change the code, and how much notice do holders get?',
  ),
]

const initialSorting: SortingState = [{ id: '#', desc: false }]

export function DefiLiquidStakingRiskTable({
  entries,
}: {
  entries: DefiLiquidStakingRiskEntry[]
}) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)

  const table = useTable('DefiLiquidStakingRiskTable', {
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
    onSortingChange: setSorting,
  })

  return (
    <>
      <ColumnsControls columns={table.getAllColumns()} />
      <BasicTable table={table} />
    </>
  )
}
