export function configureCanonicalBridgesFilter() {
  const L2s = Array.from(
    document.querySelectorAll<HTMLElement>('[data-layer2]'),
  )
  const bridgesOnlyCells = Array.from(
    document.querySelectorAll<HTMLElement>('[data-bridges-only-cell]'),
  )
  const combinedOnlyCells = Array.from(
    document.querySelectorAll<HTMLElement>('[data-combined-only-cell]'),
  )

  const activeL2s = L2s
  console.log(activeL2s)

  const combinedCheckbox =
    document.querySelector<HTMLInputElement>('#combined-bridges')

  // this call ensures that the numbers are rendered correctly on page load
  // this needs to be called after the checkboxes are set up
  rerenderNumbers()

  combinedCheckbox?.addEventListener('change', () => {
    bridgesOnlyCells.forEach((x) =>
      x.classList.toggle('hidden', combinedCheckbox.checked),
    )
    combinedOnlyCells.forEach((x) =>
      x.classList.toggle('hidden', !combinedCheckbox.checked),
    )
    activeL2s.forEach((x) => {
      x.classList.toggle('hidden', !combinedCheckbox.checked)
    })
    rerenderNumbers()
  })
}

// this function is currently placed in the same file as configureFilters()
// because only configureFilters changes the numbering of the rows
// in the future maybe this should be a separate script with its own eventListener
function rerenderNumbers() {
  const tables = document.querySelectorAll('[data-role="table"]')

  tables.forEach((table) => {
    const visibleRows = Array.from(
      table.querySelectorAll('[data-role="row"]'),
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
