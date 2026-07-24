import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { ProjectsUsedIn } from '~/components/ProjectsUsedIn'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { BasicTable } from '~/components/table/BasicTable'
import { ProjectNameCell } from '~/components/table/cells/ProjectNameCell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns/CommonProjectColumns'
import { TableLink } from '~/components/table/TableLink'
import { useTable } from '~/hooks/useTable'
import type { DefiSummaryEntry } from '~/server/features/defi/getDefiSummaryEntries'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

const columnHelper = createColumnHelper<DefiSummaryEntry>()

const columns = [
  ...getCommonProjectColumns(columnHelper, (row) => row.href),
  columnHelper.accessor('name', {
    header: 'Name',
    enableHiding: false,
    cell: (ctx) => (
      <TableLink href={ctx.row.original.href}>
        <ProjectNameCell
          project={{
            name: ctx.row.original.name,
            shortName: ctx.row.original.shortName,
            slug: ctx.row.original.slug,
            icon: ctx.row.original.icon,
            backgroundColor: undefined,
            description: ctx.row.original.description,
            statuses: {
              underReview: ctx.row.original.isUnderReview
                ? 'config'
                : undefined,
            },
          }}
        />
      </TableLink>
    ),
    enableSorting: false,
    meta: {
      cellClassName: 'pl-4',
      headClassName: 'pl-4',
    },
  }),
  columnHelper.accessor('totalValueLockedUsd', {
    header: 'TVL',
    cell: (ctx) => {
      const value = ctx.getValue()

      if (value === undefined) {
        return <NotApplicableBadge />
      }

      return (
        <span className="font-medium text-base">
          {formatCurrency(value, 'usd')}
        </span>
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
      tooltip: 'Total USD value of assets locked in the protocol.',
    },
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    cell: (ctx) => (
      <span className="font-medium text-base">{ctx.getValue()}</span>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('dependencies', {
    header: 'Dependencies',
    cell: (ctx) => {
      const dependencies = ctx.getValue()

      if (dependencies.length === 0) {
        return <span className="font-medium text-base">None</span>
      }

      return <ProjectsUsedIn usedIn={dependencies} />
    },
    enableSorting: false,
  }),
]

const initialSorting: SortingState = [{ id: 'totalValueLockedUsd', desc: true }]

export function DefiSummaryTable({ entries }: { entries: DefiSummaryEntry[] }) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)

  const table = useTable({
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  })

  return (
    <PrimaryCard className="mt-4">
      <BasicTable table={table} />
    </PrimaryCard>
  )
}
