import { makeQuery } from '../query'

export function reorderIndexes(table: HTMLElement) {
  const { $$ } = makeQuery(table)

  const rows = $$('tbody tr[data-slug]')
  const visibleRows = rows.filter((r) => !r.classList.contains('hidden'))

  visibleRows.forEach((r, index) => {
    const indexCell = r.querySelector('[data-role="index-cell"]')
    if (!indexCell) {
      console.error('Programming error: no index cell found', r)
      return
    }
    indexCell.innerHTML = `${index + 1}`
  })

  return rows.length
}
