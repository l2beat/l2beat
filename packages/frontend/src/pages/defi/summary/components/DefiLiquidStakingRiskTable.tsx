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
                {ctx.row.original.liquidStaking.token}
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
  riskColumn(
    'minting',
    'Minting',
    "Who can mint the token, what caps apply, and who routes deposited ETH to validators. Green: permissionless minting with ETH held by protocol contracts until a validator is funded. Red: minted or custodied off-chain at a counterparty's discretion. Second line: who moves deposited ETH into validators.",
  ),
  riskColumn(
    'operators',
    'Operators',
    'Who runs the validators, whether they post a loss-absorbing bond, and who bears slashing. Green: permissionless and bonded. Yellow: curated or whitelisted, with losses socialised to holders. Red: not verifiable on-chain. Second line: whether operators post a loss-absorbing bond.',
  ),
  riskColumn(
    'backing',
    'Backing',
    'Where the staked ETH sits and who controls withdrawal credentials. Green: protocol-controlled credentials pointing at protocol contracts. Yellow: routed through an external protocol. Red: off-chain custody. Second line: who controls the withdrawal credentials.',
  ),
  riskColumn(
    'exchangeRate',
    'Oracle',
    'Who writes the exchange rate, on what quorum, with what per-report bound, and what happens if they stop. Green: derived on-chain without a trusted party. Yellow: a bounded committee. Red: a single party or an unbounded one. Second line: update cadence and the cap per update.',
  ),
  riskColumn(
    'exit',
    'Exit',
    "The path from token to ETH, what gates it, how long it takes, and whether it can be paused. Green: permissionless and unpausable. Yellow: depends on an oracle report or can be paused by a committee. Red: depends on a counterparty's discretion. Second line: the typical delay and whether the exit can be paused.",
  ),
  riskColumn(
    'upgrades',
    'Upgrades',
    'Who can change the code, the minimum delay before a change takes effect, and whether token holders can veto it. Green: at least 30 days and a holder veto. Yellow: at least 7 days, or a holder veto. Red: no delay. Second line: the minimum delay and whether holders have a veto.',
  ),
]

const initialSorting: SortingState = [{ id: '#', desc: false }]

export function DefiLiquidStakingRiskTable({
  entries,
}: {
  entries: DefiLiquidStakingRiskEntry[]
}) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)

  const table = useTable({
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
