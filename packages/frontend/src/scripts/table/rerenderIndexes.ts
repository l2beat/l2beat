export function reorderIndexes(rows: HTMLElement[]) {
  rows.forEach((r, index) => {
    const indexCell = r.querySelector('[data-role="index-cell"]')
    if (!indexCell) {
      console.error('Programming error: no index cell found', r)
      return
    }
    indexCell.innerHTML = `${index + 1}`
  })

  return rows.length
}
