import { makeQuery } from '../query'

export function reorderIndexes(table: HTMLElement) {
  const { $$ } = makeQuery(table)
  const visibleRows = $$('tbody tr[data-slug]:not(.hidden)')
  visibleRows
    .map((row) => getIndexOrder(row))
    .sort((a, b) => a.order - b.order)
    .forEach(({ cell }, i) => {
      cell.innerHTML = (i + 1).toString()
    })

  return visibleRows.length
}

function getIndexOrder(row: HTMLElement) {
  const indexCell = row.querySelector('[data-role="index-cell"]')
  const orderValue = indexCell?.closest('td')?.getAttribute('data-order-value')
  if (!orderValue || !indexCell) {
    throw new Error('No order value found')
  }
  return { cell: indexCell, order: Number(orderValue) }
}
