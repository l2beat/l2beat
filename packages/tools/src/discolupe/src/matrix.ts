import type { LupeColumn } from './columns'
import type { ColumnFilter } from './filtering'
import type { DiscoLupeProject } from './model'
import type { SortConfig } from './sort'

interface Matrix {
  rowCount: number
  projects: DiscoLupeProject[]
  columns: Column[]
}

export interface Row {
  project: DiscoLupeProject
  columns: string[]
}

interface Column {
  config: LupeColumn
  values: string[]
}

export function toVisibleRows(
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
  const column = columnConfigs[columnIndex]

  rows.sort((r1, r2) => {
    if (column?.sortComparator !== undefined) {
      return column.sortComparator(r1.project, r2.project)
    }
    return defaultSortComparator(r1, r2, columnIndex)
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

function defaultSortComparator(r1: Row, r2: Row, columnIndex: number): number {
  if (
    r1.columns[columnIndex] === undefined ||
    r2.columns[columnIndex] === undefined
  ) {
    return 0
  }

  return r1.columns[columnIndex].localeCompare(r2.columns[columnIndex])
}

function columnIDToIndex(columns: LupeColumn[], columnId: string): number {
  return columns.findIndex((c) => c.id === columnId)
}

export function toMatrix(
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
