/* 
  If you want to rerender indexes of a table (e.g. when you filter rows and want to re-render indexes),
  you need to add the following attributes to the table element:
  - data-role="table"
  - data-table-indexes-renderer-on="true"

  You also need to add the following attributes to the index cell:
  - data-role="index-cell"

  Example:
  <table data-role="table" data-table-indexes-renderer-on="combined-bridges-checkbox">
    <thead>
      ...
    </thead>
    <tbody>
      <tr>
        <td data-role="index-cell">1</td>
        <td>...</td>
      </tr>
      <tr>
        <td data-role="index-cell">2</td>
        <td>...</td>
      </tr>
    </tbody>
*/
export function configureTableIndexRerender() {
  // In the future, as we introduce more elements that require re-rendering of indexes,
  // we will need to include them in this file as well.
  const combinedCheckbox = document.querySelector<HTMLInputElement>(
    '#combined-bridges-checkbox',
  )
  console.log(combinedCheckbox)

  rerenderNumbers()

  combinedCheckbox?.addEventListener('change', () => {
    rerenderNumbers('combined-bridges-checkbox')
  })
}

function rerenderNumbers(rerenderOn?: string) {
  const tablesToRerenderIndexes = document.querySelectorAll(
    `[data-role="table"][data-table-rerender-indexes-on${
      rerenderOn ? `="${rerenderOn}"` : ''
    }]`,
  )

  tablesToRerenderIndexes.forEach((table) => {
    const visibleRows = Array.from(table.querySelectorAll('tbody tr')).filter(
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
    console.debug('triggered renderNumbers() |', {
      visibleRowsLength: visibleRows.length,
    })
  })
}
