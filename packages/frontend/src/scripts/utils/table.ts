import { makeQuery } from '../query'

type TableState = 'empty' | null

export function rerenderTable(table: HTMLElement) {
  const parentElement = table.parentElement
  const isInsideTabs = parentElement?.classList.contains('TabsContent')

  const visibleRowsLength = rerenderIndexes(table)

  if (parentElement && isInsideTabs) {
    rerenderTabCountBadge(parentElement.id, visibleRowsLength)
  }
  setTableState(table, visibleRowsLength === 0 ? 'empty' : null)
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

function rerenderIndexes(table: HTMLElement) {
  const { $$ } = makeQuery(table)
  const visibleRows = $$('tbody tr').filter(
    (r) => !r.classList.contains('hidden'),
  )

  visibleRows.forEach((r, index) => {
    const indexCell = r.querySelector('[data-role="index-cell"]')
    if (!indexCell) {
      console.error('Programming error: no index cell found', r)
      return
    }
    indexCell.innerHTML = `${index + 1}`
  })

  return visibleRows.length
}

function setTableState(table: HTMLElement, state: TableState) {
  if (state === null) {
    delete table.dataset.state
    return
  }
  table.dataset.state = state
}
