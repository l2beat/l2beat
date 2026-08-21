import { formatCurrency, formatSeconds } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { getCommonProjectColumns } from '~/components/table/common-project-columns/CommonProjectColumns'
import { TableLink } from '~/components/table/TableLink'
import type { OssificationSummaryEntry } from '~/server/features/projects/ossification/getOssificationEntries'

const columnHelper = createColumnHelper<OssificationSummaryEntry>()

export const ossificationColumns = [
  ...getCommonProjectColumns(columnHelper, (entry) => entry.href),
  columnHelper.accessor('name', {
    header: 'Project',
    cell: (ctx) => (
      <TableLink href={ctx.row.original.href}>
        <span className="font-medium text-sm">{ctx.getValue()}</span>
      </TableLink>
    ),
    enableHiding: false,
  }),
  columnHelper.accessor('score', {
    header: 'Ossification',
    cell: (ctx) => (
      <span className="font-medium tabular-nums">{ctx.getValue()} / 100</span>
    ),
    meta: {
      tooltip:
        'Maturity of the project-wide critical perimeter: grows the longer all critical contracts stay unchanged, on a scale saturating over years.',
    },
    sortDescFirst: true,
  }),
  columnHelper.accessor((entry) => entry.exposure ?? undefined, {
    id: 'exposure',
    header: 'Battle-tested\nexposure',
    cell: (ctx) => {
      const exposure = ctx.row.original.exposure
      if (exposure === null) return <NotApplicableBadge />
      return (
        <span className="tabular-nums">
          {formatCurrency(exposure, 'usd')}
          <span className="ml-0.5 text-secondary text-xs">·years</span>
        </span>
      )
    },
    meta: {
      tooltip:
        'Value secured summed up over the unchanged period — the implicit bug bounty the code has withstood, in dollar-years.',
    },
    sortDescFirst: true,
    sortUndefined: 'last',
  }),
  columnHelper.accessor((entry) => entry.projectAgeSeconds ?? undefined, {
    id: 'lastChange',
    header: 'Last\nchange',
    cell: (ctx) => {
      const age = ctx.row.original.projectAgeSeconds
      if (age === null) return <NotApplicableBadge />
      return <span className="tabular-nums">{formatSeconds(age)} ago</span>
    },
    meta: {
      tooltip:
        'Time since the most recent deployment or critical change anywhere in the critical perimeter.',
    },
    sortDescFirst: true,
    sortUndefined: 'last',
  }),
  columnHelper.accessor('criticalChangesPerYear', {
    header: 'Critical\nchanges / year',
    cell: (ctx) => (
      <span className="tabular-nums">
        {ctx.row.original.clusteredEventCount === 0
          ? '0'
          : ctx.getValue() >= 10
            ? ctx.getValue().toFixed(0)
            : ctx.getValue().toFixed(1)}
      </span>
    ),
    meta: {
      tooltip:
        '24h-clustered critical change events per year over the trailing 36 months, including backfilled history of removed contracts.',
    },
    sortDescFirst: true,
  }),
  columnHelper.accessor('contractCount', {
    header: 'Critical\ncontracts',
    cell: (ctx) => <span className="tabular-nums">{ctx.getValue()}</span>,
    meta: {
      tooltip:
        'Number of contracts in the critical perimeter, as classified by our research team.',
    },
    sortDescFirst: true,
  }),
]
