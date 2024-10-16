'use client'
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import Link from 'next/link'
import { PentagonRosetteCell } from '~/components/rosette/pentagon/pentagon-rosette-cell'
import { BasicTable } from '~/components/table/basic-table'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { EM_DASH } from '~/consts/characters'
import { useBreakpoint } from '~/hooks/use-is-mobile'
import { useTable } from '~/hooks/use-table'
import { type DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/format'
import { DaTableLastSubRowCell } from '../../../_components/da-table-last-sub-row-cell'
import { DaTableSubRowCell } from '../../../_components/da-table-sub-row-cell'
import { mapRisksToRosetteValues } from '../../../_utils/map-risks-to-rosette-values'
import { customSystemsColumns } from './columns'

interface Props {
  items: DaSummaryEntry[]
}

export function DaSummaryCustomSystemsTable({ items }: Props) {
  const breakpoint = useBreakpoint()
  const table = useTable({
    data: items,
    columns: customSystemsColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
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
      expanded: breakpoint !== 'mobile' ? true : undefined,
    },
  })

  return (
    <>
      <BasicTable
        table={table}
        rowColoringMode="ethereum-only"
        rawSubComponent
        renderSubComponent={({ row }) => {
          if (row.original.subRows.length < 1) {
            return (
              <tr className="border-b border-b-gray-200 dark:border-b-zinc-700">
                <td colSpan={9}></td>
              </tr>
            )
          }
          return (
            <>
              <tr>
                <td className="h-2" />
              </tr>
              {row.original.subRows.map((subRow, i) => {
                const firstRow = i === 0
                const lastRow = i === row.original.subRows.length - 1
                const { href } = subRow

                return (
                  <tr key={subRow.slug} className="group">
                    <td colSpan={3} className="pointer-events-none"></td>
                    <td
                      className={cn(
                        'group whitespace-pre bg-black/[0.05] pr-3 align-middle group-hover:bg-black/[0.1] dark:bg-white/[0.1] dark:group-hover:bg-white/[0.2]',
                        !lastRow &&
                          'border-b border-b-gray-200 dark:border-b-zinc-700',
                        firstRow && 'rounded-tl-xl',
                        lastRow && 'rounded-bl-xl',
                      )}
                    >
                      <Link href={href}>
                        <div className="flex size-full items-center">
                          <ProjectNameCell
                            className={cn('size-full p-2 !pl-8')}
                            project={{
                              ...subRow,
                              name: subRow.daBridge.name,
                              shortName: undefined,
                            }}
                          />
                        </div>
                      </Link>
                    </td>
                    <DaTableSubRowCell href={href} lastRow={lastRow}>
                      <PentagonRosetteCell
                        className="justify-start"
                        values={mapRisksToRosetteValues(subRow.risks)}
                        isUnderReview={subRow.isUnderReview}
                        hasNoBridge={subRow.daBridge.type === 'NoBridge'}
                      />
                    </DaTableSubRowCell>
                    <DaTableLastSubRowCell
                      href={href}
                      firstRow={firstRow}
                      lastRow={lastRow}
                    >
                      {subRow.usedIn.length > 0
                        ? formatCurrency(subRow.tvs, 'usd', {
                            showLessThanMinimum: false,
                          })
                        : EM_DASH}
                    </DaTableLastSubRowCell>
                  </tr>
                )
              })}
              <tr className="border-b border-b-gray-200 dark:border-b-zinc-700">
                <td colSpan={9} className="h-2" />
              </tr>
            </>
          )
        }}
      />
    </>
  )
}
