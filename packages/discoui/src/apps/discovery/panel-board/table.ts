import type { AgentViewSpec } from '../agent/applyView'
import type { BoardRow, CellPart, TableBlock } from './boardApi'

export interface TableSort {
  column: number
  descending: boolean
}

// Ascending, descending, then back to the order the board was written in.
export function nextSort(
  sort: TableSort | undefined,
  column: number,
): TableSort | undefined {
  if (sort?.column !== column) return { column, descending: false }
  return sort.descending ? undefined : { column, descending: true }
}

// Numbers sort as numbers, and empty cells go last either way, so the rows
// that have the answer come first.
export function sortRows(
  rows: readonly BoardRow[],
  sort: TableSort | undefined,
): readonly BoardRow[] {
  if (sort === undefined) return rows
  const filled = rows.filter((row) => cellText(row, sort.column) !== '')
  const empty = rows.filter((row) => cellText(row, sort.column) === '')
  const sorted = [...filled].sort((a, b) =>
    compareCells(cellText(a, sort.column), cellText(b, sort.column)),
  )
  if (sort.descending) sorted.reverse()
  return [...sorted, ...empty]
}

// Numbers by value, before text, so decimals and negatives order right.
function compareCells(a: string, b: string): number {
  const x = Number(a)
  const y = Number(b)
  if (Number.isFinite(x) && Number.isFinite(y)) return x - y
  if (Number.isFinite(x)) return -1
  if (Number.isFinite(y)) return 1
  return a.localeCompare(b, 'en', { numeric: true })
}

function cellText(row: BoardRow, column: number): string {
  return (row.cells[column] ?? []).map(partText).join(' ')
}

function partText(part: CellPart): string {
  return 'address' in part ? part.name : part.text
}

// The rows' contracts and the related ones in their columns, without values
// like signers that would only crowd the graph.
export function tableContracts(table: TableBlock): string[] {
  const addresses = new Set<string>()
  for (const row of table.rows) {
    if (row.address !== undefined) addresses.add(row.address)
    for (const column of table.graphColumns) {
      for (const part of row.cells[column] ?? []) {
        if ('address' in part) addresses.add(part.address)
      }
    }
  }
  return [...addresses]
}

export function onlyView(title: string, contracts: string[]): AgentViewSpec {
  return {
    title,
    hide: [],
    show: [],
    only: contracts,
    groups: [],
    colors: [],
    arrange: 'keep',
  }
}

export function shortAddress(address: string): string {
  const separator = address.indexOf(':')
  const hex = address.slice(separator + 1)
  return `${address.slice(0, separator + 1)}${hex.slice(0, 6)}…${hex.slice(-4)}`
}

const WIDE_TEXT_CHARS = 40

// A column of sentences gets room to read them on a few lines, instead of
// one word per line next to columns of short names.
export function wideColumns(table: TableBlock): boolean[] {
  return table.columns.map((_, column) =>
    table.rows.some((row) =>
      (row.cells[column] ?? []).some(
        (part) => 'text' in part && part.text.length > WIDE_TEXT_CHARS,
      ),
    ),
  )
}

const NARROW_COLUMN_PX = 110
const WIDE_COLUMN_PX = 240

// How wide the table needs to be to read without scrolling sideways.
export function tableWidthPx(wide: readonly boolean[]): number {
  let widthPx = 0
  for (const isWide of wide) {
    widthPx += isWide ? WIDE_COLUMN_PX : NARROW_COLUMN_PX
  }
  return widthPx
}
