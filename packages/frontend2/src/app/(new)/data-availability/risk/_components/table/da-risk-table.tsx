'use client'
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { FilterWrapper } from '~/app/_components/table/filters/filter-wrapper'
import { TableFacetedFilter } from '~/app/_components/table/filters/table-faceted-filter'
import { useTable } from '~/hooks/use-table'
import { type DaRiskEntry } from '~/server/features/data-availability/get-da-risk-entries'
import { columns } from './columns'
import { BasicTable } from '~/app/_components/table/basic-table'

interface Props {
  items: DaRiskEntry[]
}

export function DaRiskTable({ items }: Props) {
  const table = useTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <>
      <FilterWrapper>
        <TableFacetedFilter title="DA Layer" column={table.getColumn('name')} />
      </FilterWrapper>
      <BasicTable
        table={table}
        onResetFilters={() => table.resetColumnFilters()}
      />
    </>
  )
}
