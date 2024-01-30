import { makeQuery } from '../query'
import { reorderIndexes } from './reorderIndexes'

type TableState = 'empty' | null

export function configureTables() {
  const { $$ } = makeQuery(document.body)
  const tablesToRerenderOnLoad = $$('[data-role=table][data-rerender-on-load]')
  tablesToRerenderOnLoad.forEach((table) => onLoad(table))
}

function onLoad(table: HTMLElement) {
  const parentElement = table.parentElement
  const isInsideTabs = parentElement?.classList.contains('TabsContent')

  const visibleRowsLength = reorderIndexes(table)
  if (parentElement && isInsideTabs) {
    rerenderTabCountBadge(parentElement.id, visibleRowsLength)
  }
}

export function rerenderTable(table: HTMLElement, slugsToShow?: string[]) {
  const parentElement = table.parentElement
  const isInsideTabs = parentElement?.classList.contains('TabsContent')
  const visibleRowsLength = rerenderRows(table, slugsToShow)

  if (parentElement && isInsideTabs) {
    rerenderTabCountBadge(parentElement.id, visibleRowsLength)
  }

  setTableState(table, visibleRowsLength === 0 ? 'empty' : null)
}

function rerenderRows(table: HTMLElement, slugs?: string[]) {
  const { $$ } = makeQuery(table)
  const rows = $$('tbody tr[data-slug]')
  rows.forEach((row) => manageRowVisibility(row, slugs))

  return reorderIndexes(table)
}

function manageRowVisibility(row: HTMLElement, slugs?: string[]) {
  const slug = row.dataset.slug
  if (!slug) {
    throw new Error('No slug found')
  }
  if (!slugs || slugs.includes(slug)) {
    row.classList.remove('hidden')
  } else {
    row.classList.add('hidden')
  }
}

function rerenderTabCountBadge(tabId: string, visibleRowsLength: number) {
  const tabBadgeCount = document.querySelector(
    `.TabsItem#${tabId} .TabsItem-CountBadge`,
  )
  if (!tabBadgeCount) {
    throw new Error('No tabBadgeCount found')
  }
  tabBadgeCount.innerHTML = `${visibleRowsLength}`
}

function setTableState(table: HTMLElement, state: TableState) {
  if (state === null) {
    delete table.dataset.state
    return
  }
  table.dataset.state = state
}
