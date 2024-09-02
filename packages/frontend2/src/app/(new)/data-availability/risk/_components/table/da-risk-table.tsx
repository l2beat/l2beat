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

                return (
                  <tr key={subRow.slug}>
                    <td colSpan={3}></td>
                    <td
                      className={cn(
                        'group h-9 whitespace-pre align-middle',
                        !lastRow &&
                          'border-b border-b-gray-200 dark:border-b-zinc-700',
                      )}
                    >
                      <ProjectNameCell
                        className={cn(
                          'size-full bg-gray-100 p-2 pl-8 dark:bg-gray-900',
                          firstRow && 'rounded-tl-xl',
                          lastRow && 'rounded-bl-xl',
                        )}
                        project={{
                          ...row.original,
                          name: subRow.daBridge.name,
                          shortName: undefined,
                        }}
                      />
                    </td>
                    <TableCell
                      className={cn(
                        'bg-gray-100 align-middle dark:bg-gray-900',
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
                      className={cn(
                        'bg-gray-100 align-middle dark:bg-gray-900',
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
                      className={cn(
                        'bg-gray-100 align-middle dark:bg-gray-900',
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
                      className={cn(
                        'bg-gray-100 align-middle dark:bg-gray-900',
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
                        'group h-9 whitespace-pre align-middle',
                        !lastRow &&
                          'border-b border-b-gray-200 dark:border-b-zinc-700',
                      )}
                    >
                      <div
                        className={cn(
                          'flex size-full items-center bg-gray-100 dark:bg-gray-900',
                          firstRow && 'rounded-tr-xl',
                          lastRow && 'rounded-br-xl',
                        )}
                      >
                        <RiskCell
                          risk={subRow.risks.accessibility}
                          emptyMode="em-dash"
                        />
                      </div>
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
