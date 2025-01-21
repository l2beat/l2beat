import clsx from 'clsx'
import { ColumnSelector } from './ColumnSelector'
import { FilterButton } from './FilterButton'
import { SortingArrowIcon } from './icons/SortingArrowIcon'
import {
  AVAILABLE_COLUMNS,
  DEFAULT_COLUMN_IDS,
  type LupeColumn,
  deserializeColumns,
  serializeColumns,
} from './src/columns'
import {
  type ColumnFilter,
  deserializeFilter,
  serializeFilter,
} from './src/filtering'
import { toMatrix, toVisibleRows } from './src/matrix'
import type { DiscoLupeProject } from './src/model'
import {
  type SortConfig,
  type SortDirection,
  deserializeSort,
  getSortDirection,
  serializeSort,
} from './src/sort'
import { useSearchParamsState } from './useSearchParamsState'

export interface TableProps {
  projects: DiscoLupeProject[]
}

export function Table({ projects }: TableProps) {
  const [selectedColumns, setSelectedColumns] = useSearchParamsState<
    LupeColumn[]
  >(
    AVAILABLE_COLUMNS.filter((c) => DEFAULT_COLUMN_IDS.includes(c.id)),
    'cols',
    serializeColumns,
    deserializeColumns,
  )

  const defaultFilterState = Object.fromEntries(
    selectedColumns.map((c) => [c.id, undefined]),
  ) as ColumnFilter
  const [filter, setFilter] = useSearchParamsState<ColumnFilter>(
    defaultFilterState,
    'filter',
    serializeFilter,
    (serialized: string) => deserializeFilter(serialized, defaultFilterState),
  )

  const [sort, setSort] = useSearchParamsState<SortConfig>(
    { byColumnId: 'qx', direction: 'asc' },
    'sort',
    serializeSort,
    deserializeSort,
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
