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
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/basic-table'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { RiskCell } from '~/components/table/cells/risk-cell'
import { useBreakpoint } from '~/hooks/use-is-mobile'
import { useTable } from '~/hooks/use-table'
import { type DaRiskEntry } from '~/server/features/data-availability/risks/get-da-risk-entries'
import { cn } from '~/utils/cn'
import { DaTableLastSubRowCell } from '../../../_components/da-table-last-sub-row-cell'
import { DaTableSubRowCell } from '../../../_components/da-table-sub-row-cell'
import { useDaFilter } from '../../../_components/filters/da-filter-context'
import { DaFilters } from '../../../_components/filters/da-filters'
import { columns } from './columns'

interface Props {
  items: DaRiskEntry[]
}

export function DaRiskTable({ items }: Props) {
  const filter = useDaFilter()

  const filteredEntries = useMemo(() => {
    return items.filter(filter)
  }, [items, filter])

  const breakpoint = useBreakpoint()

  const table = useTable({
    data: filteredEntries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
    initialState: {
      expanded: breakpoint !== 'mobile' ? true : undefined,
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  /**
   * NOTE: This table uses a custom sub-component to render the sub-rows. This is done mainly
   * because of some specific requirements for the layout of the sub-rows. Always keep this layout
   * in sync with columns.tsx.
   */

  return (
    <>
      <DaFilters items={filteredEntries} />
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
                      <RiskCell
                        risk={subRow.risks.economicSecurity}
                        emptyMode="em-dash"
                      />
                    </DaTableSubRowCell>
                    <DaTableSubRowCell href={href} lastRow={lastRow}>
                      <RiskCell
                        risk={subRow.risks.fraudDetection}
                        emptyMode="em-dash"
                      />
                    </DaTableSubRowCell>
                    <DaTableSubRowCell href={href} lastRow={lastRow}>
                      <RiskCell
                        risk={subRow.risks.attestations}
                        emptyMode="em-dash"
                      />
                    </DaTableSubRowCell>
                    <DaTableSubRowCell href={href} lastRow={lastRow}>
                      <RiskCell
                        risk={subRow.risks.exitWindow}
                        emptyMode="em-dash"
                      />
                    </DaTableSubRowCell>
                    <DaTableLastSubRowCell
                      href={href}
                      firstRow={firstRow}
                      lastRow={lastRow}
                    >
                      <RiskCell
                        risk={subRow.risks.accessibility}
                        emptyMode="em-dash"
                      />
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
