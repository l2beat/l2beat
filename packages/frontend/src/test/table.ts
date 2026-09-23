import {
  createTable,
  getCoreRowModel,
  type RowData,
  type Table,
  type TableOptions,
  type VisibilityState,
} from '@tanstack/react-table'
import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

/**
 * `useTable` needs React to run, so tests build the same TanStack table
 * directly. `columnVisibility` stands in for the state restored from the
 * column picker.
 */
export function createTestTable<T extends RowData>(params: {
  data: T[]
  columns: TableOptions<T>['columns']
  columnVisibility?: VisibilityState
}): Table<T> {
  const table = createTable<T>({
    data: params.data,
    columns: params.columns,
    getCoreRowModel: getCoreRowModel(),
    renderFallbackValue: null,
    state: {},
    onStateChange: () => {},
  })
  table.setOptions((prev) => ({
    ...prev,
    state: {
      ...table.initialState,
      columnVisibility: params.columnVisibility ?? {},
    },
  }))
  return table
}

/** Server rendering reads query params from the request URL, set per request. */
export function renderOnServer(element: ReactElement): string {
  const previousUrl = globalThis.__FIX_SSR_URL__
  globalThis.__FIX_SSR_URL__ = '/'
  try {
    return renderToStaticMarkup(element)
  } finally {
    globalThis.__FIX_SSR_URL__ = previousUrl
  }
}

/** Opening tags only, so assertions do not depend on cell contents. */
export function getCellTags(html: string, tagName: 'th' | 'td') {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'g')) ?? []
}

export function getColumnCellTags(
  html: string,
  tagName: 'th' | 'td',
  columnId: string,
) {
  return getCellTags(html, tagName).filter((tag) =>
    tag.includes(`data-column-id="${columnId}"`),
  )
}
