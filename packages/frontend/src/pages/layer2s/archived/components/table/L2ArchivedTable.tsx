import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { type ReactNode, useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { TableSectionHeader } from '~/components/table/TableSectionHeader'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import { useTable } from '~/hooks/useTable'
import type { L2ArchivedEntry } from '~/server/features/layer2s/archived/getL2ArchivedEntries'
import { getL2ArchivedColumns, getL2ArchivedDefaultVisibility } from './columns'

/**
 * On desktop both verdict tables are seen one above the other, so each shared
 * column gets the same width in both instead of sizing to its own rows.
 * `min-width` too, because the header divider row's colspan defeats `width`.
 * Purpose comes last and takes the spare width, so the value the tables sort
 * by stays in view at 1280px. Narrower screens scroll each table on its own,
 * so they keep content-sized columns.
 */
const ALIGNED_COLUMN_WIDTHS = [
  'lg:[&_th:first-child]:w-[52px] lg:[&_th:first-child]:min-w-[52px]',
  'lg:[&_th[data-column-id=name]]:w-[240px] lg:[&_th[data-column-id=name]]:min-w-[240px]',
  'lg:[&_th[data-column-id=Risks]]:w-[64px] lg:[&_th[data-column-id=Risks]]:min-w-[64px]',
  'lg:[&_th[data-column-id=type]]:w-[168px] lg:[&_th[data-column-id=type]]:min-w-[168px]',
  'lg:[&_th[data-column-id=proofSystem]]:w-[144px] lg:[&_th[data-column-id=proofSystem]]:min-w-[144px]',
  'lg:[&_th[data-column-id=total]]:w-[132px] lg:[&_th[data-column-id=total]]:min-w-[132px]',
].join(' ')

interface Props {
  entries: L2ArchivedEntry[]
  title: string
  description: string
  icon: ReactNode
}

export function L2ArchivedTable({ entries, title, description, icon }: Props) {
  const { sorting, setSorting } = useTableSorting()

  // Undefined until mounted: the server can't know the viewport.
  const breakpoint = useBreakpoint()
  const columns = useMemo(
    () => getL2ArchivedColumns(breakpoint === undefined),
    [breakpoint],
  )

  const table = useTable('L2ArchivedTable', {
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    initialState: {
      columnVisibility: getL2ArchivedDefaultVisibility(breakpoint),
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
