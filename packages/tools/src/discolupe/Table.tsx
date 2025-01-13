import clsx from 'clsx'
import { useState } from 'react'
import { NavLink } from 'react-router'
import { FilterButton } from './FilterButton'
import { AVAILABLE_COLUMNS, LupeColumn } from './columns'
import { DiscoLupeProject } from './data'
import { SortingArrowIcon } from './icons/SortingArrowIcon'

interface Row {
  project: DiscoLupeProject
  columns: string[]
}

export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  byColumnId: string
  direction: SortDirection
}

export interface TableProps {
  projects: DiscoLupeProject[]
  sort: SortConfig
}

export function Table({ projects, sort }: TableProps) {
  const [filterState, setFilterState] = useState<Record<string, string[]>>({})
  const selectedColumns = AVAILABLE_COLUMNS

  const rows = getRows(
    projects,
    selectedColumns,
    sort.byColumnId,
    sort.direction,
  )
  const filteredRows = filterRows(selectedColumns, rows, filterState)

  return (
    <table className="table-auto border-collapse">
      <thead className="bg-gray-100">
        <tr>
          {selectedColumns.map((c, j) => (
            <th
              key={c.header}
              className="whitespace-nowrap bg-black px-4 py-2 text-left font-semibold text-base text-orange-300"
            >
              <div className="flex flex-row">
                <FilterButton
                  values={[...new Set(rows.map((r) => r.columns[j] ?? ''))]}
                  selected={filterState[c.id] ?? []}
                  onValueChange={(values: string[]) => {
                    setFilterState((filterState) => {
                      return {
                        ...filterState,
                        [c.id]: values,
                      }
                    })
                  }}
                />
                <NavLink
                  to={`?sort=${c.id}&dir=${getSortDirection(c.id, sort.byColumnId, sort.direction)}`}
                  className="hover:text-orange-500"
                >
                  {c.header.charAt(0).toUpperCase() + c.header.slice(1)}
                  <span className="ml-2 inline-block align-middle text-gray-500">
                    {getSortIcon(c.id, sort.byColumnId, sort.direction)}
                  </span>
                </NavLink>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filteredRows.map((row, i) => {
          return (
            <tr
              key={row.project.id.toString()}
              className={clsx(
                'border-gray-400 border-y',
                i % 2 === 1 ? 'bg-gray-600' : 'bg-gray-800',
              )}
            >
              {row.columns.map((c, j) => (
                <td
                  key={j}
                  className={clsx(
                    'whitespace-nowrap px-4 py-1 text-gray-200',
                    selectedColumns[j]?.align === 'left'
                      ? 'text-left'
                      : 'text-right',
                  )}
                >
                  {selectedColumns[j]?.displayFn(row.project, c)}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function filterRows(
  selectedColumns: LupeColumn[],
  rows: Row[],
  filter: Record<string, string[]>,
): Row[] {
  return rows.filter((r) => {
    for (const columnID in filter) {
      const filterValues = filter[columnID]
      if (filterValues === undefined) {
        continue
      }

      const index = columnIDToIndex(selectedColumns, columnID)
      const value = r.columns[index]
      if (value === undefined) {
        console.error(`Expected to find a column value at index ${index}`)
        continue
      }

      if (!filterValues.includes(value)) {
        return false
      }
    }

    return true
  })
}

function columnIDToIndex(columns: LupeColumn[], columnId: string): number {
  return columns.findIndex((c) => c.id === columnId)
}

function getRows(
  projects: DiscoLupeProject[],
  selectedColumns: LupeColumn[],
  sortColumn: string | undefined,
  sortDirection: SortDirection,
): Row[] {
  let rows: Row[] = projects.map((l2) => ({
    project: l2,
    columns: selectedColumns.map((c) => c.fn(l2)),
  }))

  if (sortColumn) {
    const columnIndex = columnIDToIndex(selectedColumns, sortColumn)
    rows.sort((r1, r2) => {
      if (
        r1.columns[columnIndex] === undefined ||
        r2.columns[columnIndex] === undefined
      ) {
        return 0
      }

      return r1.columns[columnIndex].localeCompare(r2.columns[columnIndex])
    })

    if (sortDirection === 'desc') {
      rows = rows.reverse()
    }
  }

  return rows
}

function getSortDirection(
  column: string,
  sortBy: string,
  direction: SortDirection,
): SortDirection {
  return column === sortBy && direction === 'asc' ? 'desc' : 'asc'
}

function getSortIcon(column: string, sortBy: string, direction: SortDirection) {
  if (column !== sortBy) {
    return (
      <div className="flex flex-col gap-0.5">
        <SortingArrowIcon />
        <SortingArrowIcon className="rotate-180" />
      </div>
    )
  }

  return direction === 'asc' ? (
    <SortingArrowIcon />
  ) : (
    <SortingArrowIcon className="rotate-180" />
  )
}
