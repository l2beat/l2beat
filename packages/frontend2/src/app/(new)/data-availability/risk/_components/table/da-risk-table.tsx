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
import { BasicTable } from '~/app/_components/table/basic-table'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import { RiskCell } from '~/app/_components/table/cells/risk-cell'
import { FilterWrapper } from '~/app/_components/table/filters/filter-wrapper'
import { TableFacetedFilter } from '~/app/_components/table/filters/table-faceted-filter'
import { TableCell } from '~/app/_components/table/table'
import { useBreakpoint } from '~/hooks/use-is-mobile'
import { useTable } from '~/hooks/use-table'
import { type DaRiskEntry } from '~/server/features/data-availability/risks/get-da-risk-entries'
import { cn } from '~/utils/cn'
import { columns } from './columns'

interface Props {
  items: DaRiskEntry[]
}

export function DaRiskTable({ items }: Props) {
  const breakpoint = useBreakpoint()
  const table = useTable({
    data: items,
    columns,
    getSubRows: () => [],
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
      <FilterWrapper>
        <TableFacetedFilter title="DA Layer" column={table.getColumn('name')} />
      </FilterWrapper>
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
                    <SubRowTableCell href={href} lastRow={lastRow}>
                      <RiskCell
                        risk={subRow.risks.economicSecurity}
                        emptyMode="em-dash"
                      />
                    </SubRowTableCell>
                    <SubRowTableCell href={href} lastRow={lastRow}>
                      <RiskCell
                        risk={subRow.risks.fraudDetection}
                        emptyMode="em-dash"
                      />
                    </SubRowTableCell>
                    <SubRowTableCell href={href} lastRow={lastRow}>
                      <RiskCell
                        risk={subRow.risks.attestations}
                        emptyMode="em-dash"
                      />
                    </SubRowTableCell>
                    <SubRowTableCell href={href} lastRow={lastRow}>
                      <RiskCell
                        risk={subRow.risks.exitWindow}
                        emptyMode="em-dash"
                      />
                    </SubRowTableCell>
                    <LastSubRowTableCell
                      href={href}
                      firstRow={firstRow}
                      lastRow={lastRow}
                    >
                      <RiskCell
                        risk={subRow.risks.accessibility}
                        emptyMode="em-dash"
                      />
                    </LastSubRowTableCell>
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

function LastSubRowTableCell({
  href,
  children,
  firstRow,
  lastRow,
}: {
  href: string
  children: React.ReactNode
  firstRow: boolean
  lastRow: boolean
}) {
  return (
    <td
      className={cn(
        'group whitespace-pre bg-black/[0.05] group-hover:bg-black/[0.1] dark:bg-white/[0.1] dark:group-hover:bg-white/[0.2]',
        firstRow && 'rounded-tr-xl',
        lastRow && 'rounded-br-xl',
        !lastRow && 'border-b border-b-gray-200 dark:border-b-zinc-700 ',
      )}
    >
      <Link href={href}>
        <div className="flex size-full items-center">{children}</div>
      </Link>
    </td>
  )
}

function SubRowTableCell({
  href,
  children,
  lastRow,
}: {
  href: string
  children: React.ReactNode
  className?: string
  lastRow?: boolean
}) {
  return (
    <td
      className={cn(
        'size-full whitespace-pre bg-black/[0.05] pr-3 group-hover:bg-black/[0.1] dark:bg-white/[0.1] dark:group-hover:bg-white/[0.2]',
        !lastRow && 'border-b border-b-gray-200 dark:border-b-zinc-700',
      )}
    >
      <Link href={href}>
        <div className="flex size-full items-center">{children}</div>
      </Link>
    </td>
  )
}
