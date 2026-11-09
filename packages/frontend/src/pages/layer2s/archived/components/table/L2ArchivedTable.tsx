import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { TableSectionHeader } from '~/components/table/TableSectionHeader'
import { useTable } from '~/hooks/useTable'
import type { L2ArchivedEntry } from '~/server/features/layer2s/archived/getL2ArchivedEntries'
import { l2ArchivedColumns } from './columns'

/**
 * Both verdict tables share these columns and stack on the page, so each
 * column gets the same width in both instead of sizing to its own rows. The
 * total column is left free to take up the spare width at every breakpoint.
 * `min-width` too, because the header divider row's colspan defeats `width`.
 */
const ALIGNED_COLUMN_WIDTHS = [
  '[&_th:first-child]:w-[56px] [&_th:first-child]:min-w-[56px]',
  '[&_th[data-column-id=name]]:w-[256px] [&_th[data-column-id=name]]:min-w-[256px]',
  '[&_th[data-column-id=Risks]]:w-[64px] [&_th[data-column-id=Risks]]:min-w-[64px]',
  '[&_th[data-column-id=type]]:w-[168px] [&_th[data-column-id=type]]:min-w-[168px]',
  '[&_th[data-column-id=proofSystem]]:w-[168px] [&_th[data-column-id=proofSystem]]:min-w-[168px]',
  '[&_th[data-column-id=Purpose]]:w-[180px] [&_th[data-column-id=Purpose]]:min-w-[180px]',
].join(' ')

interface Props {
  entries: L2ArchivedEntry[]
  title: string
  description: string
  icon: ReactNode
}

export function L2ArchivedTable({ entries, title, description, icon }: Props) {
  const { sorting, setSorting } = useTableSorting()

  const table = useTable('L2ArchivedTable', {
    data: entries,
    columns: l2ArchivedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    initialState: {
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return (
    <>
      <TableSectionHeader
        title={title}
        description={description}
        icon={icon}
        count={entries.length}
      >
        <ColumnsControls columns={table.getAllColumns()} />
      </TableSectionHeader>
      <BasicTable table={table} tableWrapperClassName={ALIGNED_COLUMN_WIDTHS} />
    </>
  )
}
