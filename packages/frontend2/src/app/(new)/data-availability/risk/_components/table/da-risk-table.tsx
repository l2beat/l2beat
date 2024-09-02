'use client'
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { BasicTable } from '~/app/_components/table/basic-table'
import { FilterWrapper } from '~/app/_components/table/filters/filter-wrapper'
import { TableFacetedFilter } from '~/app/_components/table/filters/table-faceted-filter'
import { useTable } from '~/hooks/use-table'
import { type DaRiskEntry } from '~/server/features/data-availability/risks/get-da-risk-entries'
import { columns } from './columns'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import { TableCell } from '~/app/_components/table/table'
import { RiskCell } from '~/app/_components/table/cells/risk-cell'
import { cn } from '~/utils/cn'
import { useBreakpoint } from '~/hooks/use-is-mobile'
import Link from 'next/link'

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

  return (
    <>
      <FilterWrapper>
        <TableFacetedFilter title="DA Layer" column={table.getColumn('name')} />
      </FilterWrapper>
      <BasicTable
        table={table}
        rawSubComponent
        renderSubComponent={({ row }) => {
          if (row.original.subRows.length < 1) {
            return (
              <tr className="border-b border-b-gray-200 dark:border-b-zinc-700">
                <td colSpan={8}></td>
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
                        'group h-9 whitespace-pre align-middle',
                        !lastRow &&
                          'border-b border-b-gray-200 dark:border-b-zinc-700',
                      )}
                    >
                      <Link href={href}>
                        <ProjectNameCell
                          className={cn(
                            'size-full bg-black/[0.05] p-2 pl-8 group-hover:bg-black/[0.1] dark:bg-white/[0.1] dark:group-hover:bg-white/[0.2]',
                            firstRow && 'rounded-tl-xl',
                            lastRow && 'rounded-bl-xl',
                          )}
                          project={{
                            ...row.original,
                            name: subRow.daBridge.name,
                            shortName: undefined,
                          }}
                        />
                      </Link>
                    </td>
                    <TableCell
                      href={href}
                      className={cn(
                        'bg-black/[0.05] group-hover:bg-black/[0.1] dark:bg-white/[0.1] dark:group-hover:bg-white/[0.2]',
                        !lastRow &&
                          'border-b border-b-gray-200 dark:border-b-zinc-700',
                      )}
                    >
                      <RiskCell
                        risk={subRow.risks.economicSecurity}
                        emptyMode="em-dash"
                      />
                    </TableCell>

                    <TableCell
                      href={href}
                      className={cn(
                        'bg-black/[0.05] group-hover:bg-black/[0.1] dark:bg-white/[0.1] dark:group-hover:bg-white/[0.2]',
                        !lastRow &&
                          'border-b border-b-gray-200 dark:border-b-zinc-700',
                      )}
                    >
                      <RiskCell
                        risk={subRow.risks.fraudDetection}
                        emptyMode="em-dash"
                      />
                    </TableCell>
                    <TableCell
                      href={href}
                      className={cn(
                        'bg-black/[0.05] group-hover:bg-black/[0.1] dark:bg-white/[0.1] dark:group-hover:bg-white/[0.2]',
                        !lastRow &&
                          'border-b border-b-gray-200 dark:border-b-zinc-700',
                      )}
                    >
                      <RiskCell
                        risk={subRow.risks.attestations}
                        emptyMode="em-dash"
                      />
                    </TableCell>
                    <TableCell
                      href={href}
                      className={cn(
                        'bg-black/[0.05] group-hover:bg-black/[0.1] dark:bg-white/[0.1] dark:group-hover:bg-white/[0.2]',
                        !lastRow &&
                          'border-b border-b-gray-200 dark:border-b-zinc-700',
                      )}
                    >
                      <RiskCell
                        risk={subRow.risks.exitWindow}
                        emptyMode="em-dash"
                      />
                    </TableCell>
                    <td
                      className={cn(
                        'group h-9 whitespace-pre bg-black/[0.05] group-hover:bg-black/[0.1] dark:bg-white/[0.1] dark:group-hover:bg-white/[0.2]',
                        firstRow && 'rounded-tr-xl',
                        lastRow && 'rounded-br-xl',
                        !lastRow &&
                          'border-b border-b-gray-200 dark:border-b-zinc-700 ',
                      )}
                    >
                      <Link href={href}>
                        <div className={cn('flex size-full items-center')}>
                          <RiskCell
                            risk={subRow.risks.accessibility}
                            emptyMode="em-dash"
                          />
                        </div>
                      </Link>
                    </td>
                  </tr>
                )
              })}
              <tr className="border-b border-b-gray-200 dark:border-b-zinc-700">
                <td className="h-2" />
              </tr>
            </>
          )
        }}
      />
    </>
  )
}
