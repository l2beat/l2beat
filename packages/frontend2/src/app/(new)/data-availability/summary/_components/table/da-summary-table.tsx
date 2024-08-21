'use client'
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { BasicTable } from '~/app/_components/table/basic-table'
import { FilterWrapper } from '~/app/_components/table/filters/filter-wrapper'
import { TableFacetedFilter } from '~/app/_components/table/filters/table-faceted-filter'
import { useTable } from '~/hooks/use-table'
import { type DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { columns } from './columns'

interface Props {
  items: DaSummaryEntry[]
}

export function DaSummaryTable({ items }: Props) {
  const table = useTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    initialState: {
      sorting: [
        {
          id: 'tvs',
          desc: true,
        },
      ],
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return (
    <>
      <FilterWrapper>
        <TableFacetedFilter title="DA Layer" column={table.getColumn('name')} />
        <TableFacetedFilter
          title="Layer type"
          column={table.getColumn('layerType')}
        />
      </FilterWrapper>
      <BasicTable table={table} />
    </>
  )
}
