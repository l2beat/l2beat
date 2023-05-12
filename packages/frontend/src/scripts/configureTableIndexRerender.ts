export function configureTableIndexRerender() {
  // In the future, as we introduce more elements that require re-rendering of indexes,
  // we will need to include them in this file as well.
  const combinedCheckbox =
    document.querySelector<HTMLInputElement>('#combined-bridges')

  rerenderNumbers()

  combinedCheckbox?.addEventListener('change', () => {
    rerenderNumbers()
  })
}

function rerenderNumbers() {
  const tables = document.querySelectorAll('[data-role="table"]')

  tables.forEach((table) => {
    const visibleRows = Array.from(
      table.querySelectorAll('[data-table-index-rerender]'),
    ).filter((r) => !r.classList.contains('hidden'))

    visibleRows.forEach((r, index) => {
      const indexCell = r.querySelector('[data-role="index-cell"]')
      if (!indexCell) {
        console.error('Programming error: no index cell found', r)
        return
      }
      indexCell.innerHTML = `${index + 1}`
    })
    console.debug('triggered renderNumbers() |', {
      visibleRowsLength: visibleRows.length,
    })
  })
}
