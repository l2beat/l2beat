import { createColumnHelper } from '@tanstack/react-table'
import { PrimaryValueCell } from '~/components/table/cells/PrimaryValueCell'
import { TableLink } from '~/components/table/TableLink'
import { getCommonProjectColumns } from '~/components/table/utils/common-project-columns/CommonProjectColumns'
import { EM_DASH } from '~/consts/characters'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import { formatDollarValueNumber } from '~/utils/number-format/formatDollarValueNumber'

const columnHelper = createColumnHelper<ScalingSummaryEntry>()

function getProjectType(entry: ScalingSummaryEntry): string | undefined {
  return entry.filterable?.find((f) => f.id === 'type')?.value
}

export function getBadgeModalProjectsColumns() {
  return [
    ...getCommonProjectColumns(
      columnHelper,
      (row) => `/scaling/projects/${row.slug}`,
    ),
    columnHelper.accessor((row) => row.name, {
      id: 'name',
      header: 'Project',
      cell: (ctx) => (
        <TableLink href={`/scaling/projects/${ctx.row.original.slug}`}>
          <span className="font-medium">
            {ctx.row.original.shortName ?? ctx.row.original.name}
          </span>
        </TableLink>
      ),
    }),
    columnHelper.accessor((row) => getProjectType(row) ?? '', {
      id: 'type',
      header: 'Type',
      cell: (ctx) => {
        const type = getProjectType(ctx.row.original)
        if (!type) {
          return (
            <span className="text-gray-500 text-xs dark:text-gray-400">
              {EM_DASH}
            </span>
          )
        }
        return <PrimaryValueCell>{type}</PrimaryValueCell>
      },
    }),
    columnHelper.accessor((row) => row.tvsOrder, {
      id: 'tvs',
      header: 'TVS',
      cell: (ctx) => {
        const v = ctx.getValue()
        if (v === undefined || v < 0) return EM_DASH
        return (
          <span className="font-medium tabular-nums">
            {formatDollarValueNumber(v)}
          </span>
        )
      },
      meta: { align: 'right' as const },
      sortingFn: 'basic',
      sortUndefined: 'last',
    }),
  ]
}
