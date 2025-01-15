import clsx from 'clsx'
import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { ColumnSelector } from './ColumnSelector'
import { FilterButton } from './FilterButton'
import {
  AVAILABLE_COLUMNS,
  ColumnId,
  DEFAULT_COLUMN_IDS,
  LupeColumn,
} from './columns'
import { DiscoLupeProject } from './data'
import { SortingArrowIcon } from './icons/SortingArrowIcon'

interface Matrix {
  rowCount: number
  projects: DiscoLupeProject[]
  columns: Column[]
}

type ColumnFilter = Record<ColumnId, string[] | undefined>

interface Row {
  project: DiscoLupeProject
  columns: string[]
}

interface Column {
  config: LupeColumn
  values: string[]
}

export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  byColumnId: ColumnId
  direction: SortDirection
}

export interface TableProps {
  projects: DiscoLupeProject[]
}

function useSearchParamsState<T>(
  initializer: T,
  key: string,
  serialize: (arg: T) => string,
  deserialize: (arg: string) => T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialValue = searchParams.has(key)
    ? deserialize(searchParams.get(key) as string)
    : initializer

  const [state, setState] = useState<T>(initialValue)
  const setParamsAndState: React.Dispatch<React.SetStateAction<T>> = (arg) => {
    setState((prevState) => {
      const newState =
        typeof arg === 'function' ? (arg as (prev: T) => T)(prevState) : arg
      const value = serialize(newState)

      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams)
        newParams.set(key, value)
        return newParams
      })

      return newState
    })
  }

  return [state, setParamsAndState]
}

export function Table({ projects }: TableProps) {
  const [selectedColumns, setSelectedColumns] = useSearchParamsState<
    LupeColumn[]
  >(
    AVAILABLE_COLUMNS.filter((c) => DEFAULT_COLUMN_IDS.includes(c.id)),
    'cols',
    (cols: LupeColumn[]) => cols.map((c) => c.id).join(''),
    (serialized: string) => {
      console.log('deserializing columns', serialized)
      const ids: ColumnId[] = []
      for (let i = 0; i < serialized.length; i += 2) {
        ids.push(serialized.slice(i, i + 2) as ColumnId)
      }
      return AVAILABLE_COLUMNS.filter((c) => ids.includes(c.id))
    },
  )
  const defaultFilterState = Object.fromEntries(
    selectedColumns.map((c) => [c.id, undefined]),
  ) as ColumnFilter
  const [filter, setFilter] = useSearchParamsState<ColumnFilter>(
    defaultFilterState,
    'filter',
    (filter: ColumnFilter) => {
      const definedEntries = Object.entries(filter).filter(
        ([_, value]) => value !== undefined,
      )
      if (definedEntries.length === 0) return ''

      return definedEntries
        .map(([key, values]) => `${key}:${values?.join(',')}`)
        .join('|')
    },
    (serialized: string) => {
      if (!serialized) return defaultFilterState

      try {
        const result = { ...defaultFilterState }

        // Split into column segments and parse
        const segments = serialized.split('|')
        segments.forEach((segment) => {
          const parts = segment.split(':')
          const columnId = parts[0]
          const valueStr = parts[1]

          if (columnId && columnId in defaultFilterState) {
            result[columnId as keyof ColumnFilter] = valueStr
              ? valueStr.split(',')
              : undefined
          }
        })

        return result
      } catch {
        return defaultFilterState
      }
    },
  )

  const [sort, setSort] = useSearchParamsState<SortConfig>(
    { byColumnId: 'qx', direction: 'asc' },
    'sort',
    (sort: SortConfig) => `${sort.byColumnId}:${sort.direction}`,
    (serialized: string) => {
      const [byColumnId, direction] = serialized.split(':') as [
        ColumnId,
        SortDirection,
      ]

      return { byColumnId, direction }
    },
  )

  const matrix = toMatrix(projects, selectedColumns)
  const visibleRows = toVisibleRows(matrix, sort, filter)

  return (
    <div>
      <ColumnSelector
        available={AVAILABLE_COLUMNS}
        selected={selectedColumns}
        onChange={(newSelection: LupeColumn[]) =>
          setSelectedColumns(newSelection)
        }
      />
      <div className="py-4">
        <button
          onClick={() => setFilter(defaultFilterState)}
          className="rounded bg-zinc-700 px-4 py-2 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          Reset all filters
        </button>
      </div>
      <table className="table-auto border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {matrix.columns.map((c) => (
              <th
                key={c.config.header}
                className="whitespace-nowrap bg-black px-4 py-2 text-left font-semibold text-base text-orange-300"
              >
                <div className="flex flex-row">
                  <FilterButton
                    values={[...new Set(c.values)]}
                    selected={filter[c.config.id]}
                    onValueChange={(values: string[] | undefined) => {
                      setFilter((filterState) => {
                        return { ...filterState, [c.config.id]: values }
                      })
                    }}
                  />
                  <div
                    className="hover:text-orange-500"
                    onClick={() => {
                      setSort({
                        byColumnId: c.config.id,
                        direction: getSortDirection(
                          c.config.id,
                          sort.byColumnId,
                          sort.direction,
                        ),
                      })
                    }}
                  >
                    {c.config.header}
                    <span className="ml-2 inline-block align-middle text-gray-500">
                      {getSortIcon(
                        c.config.id,
                        sort.byColumnId,
                        sort.direction,
                      )}
                    </span>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row, i) => {
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
    </div>
  )
}

function toVisibleRows(
  matrix: Matrix,
  sort: SortConfig,
  filter: ColumnFilter,
): Row[] {
  let rows: Row[] = matrix.projects.map((project) => ({
    project,
    columns: [],
  }))

  for (const column of matrix.columns) {
    for (const [rowIndex, value] of column.values.entries()) {
      rows[rowIndex]?.columns.push(value)
    }
  }

  const columnConfigs = matrix.columns.map((c) => c.config)
  const columnIndex = columnIDToIndex(columnConfigs, sort.byColumnId)

  rows.sort((r1, r2) => {
    if (
      r1.columns[columnIndex] === undefined ||
      r2.columns[columnIndex] === undefined
    ) {
      return 0
    }

    return r1.columns[columnIndex].localeCompare(r2.columns[columnIndex])
  })

  if (sort.direction === 'desc') {
    rows = rows.reverse()
  }

  return rows.filter((r) => {
    for (const columnID in filter) {
      const filterValues = filter[columnID as keyof ColumnFilter]
      if (filterValues === undefined) {
        continue
      }

      const index = columnIDToIndex(columnConfigs, columnID)
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

function toMatrix(
  projects: DiscoLupeProject[],
  selectedColumns: LupeColumn[],
): Matrix {
  const result: Matrix = {
    rowCount: projects.length,
    projects,
    columns: [],
  }

  for (const columnConfiguration of selectedColumns) {
    const column: Column = {
      config: columnConfiguration,
      values: projects.map((p) => columnConfiguration.fn(p)),
    }
    result.columns.push(column)
  }

  return result
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
