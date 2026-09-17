import type { Column, Table } from '@tanstack/react-table'

/**
 * Column visibility picked in the column picker is persisted in localStorage
 * and applied by `useTable` after mount, because the server-rendered HTML is
 * edge-cached and identical for everyone. Without help, a refresh paints every
 * column and then removes the hidden ones once React has hydrated.
 *
 * Like `HomeWhatsNewCard`, the table renders an inline script right before its
 * own markup. The script runs during HTML parsing, reads this table's persisted
 * state and appends a `<style>` to `<head>` hiding the matching cells, so the
 * hidden columns are never painted. Nothing inside the React root is touched.
 *
 * `useTable` flags the table as applied in the same render that puts the
 * persisted visibility into React state, which turns the rules off. From then
 * on visibility is plain React state and the stale `<style>` matches nothing.
 */

export const STORAGE_KEY_PREFIX = 'table-column-visibility-'

const TABLE_ID_ATTR = 'data-table-id'
const APPLIED_ATTR = 'data-columns-applied'
const COLUMN_ID_ATTR = 'data-column-id'

export interface PersistedColumns {
  tableId: string
  /** True once the persisted visibility is in React state. */
  isApplied: boolean
}

export function getPersistedColumnsStorageKey(tableId: string) {
  return `${STORAGE_KEY_PREFIX}${tableId}` as const
}

/** Attributes for the `<table>` element. */
export function getPersistedTableAttributes<T>(table: Table<T>) {
  const persistedColumns = table.options.meta?.persistedColumns
  if (!persistedColumns) return undefined
  return {
    [TABLE_ID_ATTR]: persistedColumns.tableId,
    [APPLIED_ATTR]: persistedColumns.isApplied ? '' : undefined,
  }
}

/** Attributes for every header and body cell of a column. */
export function getPersistedColumnAttributes<T>(column: Column<T>) {
  return { [COLUMN_ID_ATTR]: column.id }
}

/**
 * Inline script rendered before the table. Kept ES5 and self-contained since
 * it runs before any bundle. Only explicit `false` entries hide a column.
 */
export function getPrePaintHideScript(tableId: string): string {
  const key = JSON.stringify(getPersistedColumnsStorageKey(tableId))
  const tableSelector = JSON.stringify(
    `[${TABLE_ID_ATTR}=${JSON.stringify(tableId)}]:not([${APPLIED_ATTR}]) [${COLUMN_ID_ATTR}=`,
  )
  return (
    `try{var v=JSON.parse(localStorage.getItem(${key})||"{}"),c="";` +
    `for(var k in v)if(v[k]===false)c+=${tableSelector}+JSON.stringify(k)+"]{display:none}";` +
    `if(c){var s=document.createElement("style");s.textContent=c;document.head.appendChild(s)}}catch{}`
  )
}
