import { formatInteger } from '@l2beat/shared-pure'
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { LineCoverageTooltipContent } from '~/components/audits/AuditCoverageBar'
import { AuditsCoverageSparkline } from '~/components/audits/AuditsCoverageSparkline'
import {
  formatShare,
  UNCOUNTED_UNITS_NOTE,
} from '~/components/audits/auditStatus'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { formatContractCount } from '~/components/ossification/formatCriticalChangesPerYear'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { BasicTable } from '~/components/table/BasicTable'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns/CommonProjectColumns'
import { TableLink } from '~/components/table/TableLink'
import { useTable } from '~/hooks/useTable'
// Client-safe: only coverage arithmetic, no server dependencies.
import {
  fullyCoveredShare,
  linesCoveredShare,
} from '~/server/features/audits/countFullyCoveredContracts'
import type { AuditsSummaryEntry } from '~/server/features/audits/types'
import { cn } from '~/utils/cn'

const columnHelper = createColumnHelper<AuditsSummaryEntry>()

const columns = [
  ...getCommonProjectColumns(columnHelper, (row) => row.href),
  columnHelper.accessor('name', {
    header: 'Name',
    enableHiding: false,
    cell: (ctx) => (
      <TableLink href={ctx.row.original.href}>
        <span className="font-bold text-sm">
          {ctx.row.original.shortName ?? ctx.row.original.name}
        </span>
      </TableLink>
    ),
    enableSorting: false,
    meta: { cellClassName: 'pl-4', headClassName: 'pl-4' },
  }),
  columnHelper.display({
    id: 'timeline',
    header: 'Unaudited lines\nover time',
    cell: (ctx) =>
      ctx.row.original.coverageHistory === null ? (
        <NotApplicableBadge />
      ) : (
        <AuditsCoverageSparkline
          history={ctx.row.original.coverageHistory}
          to={ctx.row.original.timeline.to}
          href={`${ctx.row.original.href}#audit-timeline`}
          className="mx-auto"
        />
      ),
    meta: {
      align: 'center',
      tooltip:
        "Lines of the critical contracts not covered by the audits published by then, from the launch to today. The line falls as audits cover code and rises as unaudited code is deployed. Green when there are fewer unaudited lines now than at the launch, red when there are more. Click one to open the project's full timeline.",
    },
  }),
  columnHelper.accessor(
    (row) => row.timeline.criticalChangesSinceLatestAudit ?? -1,
    {
      id: 'upgradesSinceAudit',
      header: 'Upgrades since\nlast audit',
      cell: (ctx) => {
        const count = ctx.row.original.timeline.criticalChangesSinceLatestAudit
        return count === null ? (
          <NotApplicableBadge />
        ) : (
          <span
            className={cn('font-medium text-sm', count > 0 && 'text-negative')}
          >
            {formatInteger(count)}
          </span>
        )
      },
      sortDescFirst: true,
      meta: {
        align: 'center',
        tooltip:
          "Code changes to the project's critical contracts after its latest audit report, own or of its stack, as tracked by ossification. State changes are not counted.",
      },
    },
  ),
  columnHelper.accessor(fullyCoveredShare, {
    id: 'fullyCovered',
    header: 'Fully audited\ncontracts',
    cell: (ctx) => {
      const { fullyCoveredContracts, contracts } = ctx.row.original
      return (
        <TwoRowCell>
          <TwoRowCell.First>
            {formatShare(fullyCoveredContracts, contracts)}
          </TwoRowCell.First>
          <TwoRowCell.Second>
            {formatInteger(fullyCoveredContracts)} of {formatInteger(contracts)}{' '}
            contracts
          </TwoRowCell.Second>
        </TwoRowCell>
      )
    },
    sortDescFirst: true,
    meta: {
      tooltip: `Share of the critical contracts whose whole deployed source, every unit of every file, is identical to audited code. Contracts without verified source count as not covered. ${UNCOUNTED_UNITS_NOTE}`,
    },
  }),
  columnHelper.accessor(linesCoveredShare, {
    id: 'linesCovered',
    header: 'Lines identical\nto audited',
    cell: (ctx) => {
      const lines = ctx.row.original.coverage.lines
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <TwoRowCell>
              <TwoRowCell.First>
                {formatShare(lines.covered, lines.total)}
              </TwoRowCell.First>
              <TwoRowCell.Second>
                {formatContractCount(ctx.row.original.contracts)}
              </TwoRowCell.Second>
            </TwoRowCell>
          </TooltipTrigger>
          <TooltipContent>
            <LineCoverageTooltipContent lines={lines} />
          </TooltipContent>
        </Tooltip>
      )
    },
    sortDescFirst: true,
    meta: {
      tooltip: `Share of deployed lines identical to audited code, across the critical contracts. ${UNCOUNTED_UNITS_NOTE}`,
    },
  }),
]

const initialSorting: SortingState = [
  { id: 'fullyCovered', desc: true },
  { id: 'linesCovered', desc: true },
]

export function AuditsSummaryTable({
  entries,
}: {
  entries: AuditsSummaryEntry[]
}) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const table = useTable('AuditsSummaryTable', {
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting, columnPinning: { left: ['#', 'logo'] } },
    onSortingChange: setSorting,
  })

  return (
    <PrimaryCard className="mt-2">
      <BasicTable table={table} />
    </PrimaryCard>
  )
}
