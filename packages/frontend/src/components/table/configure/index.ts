export function configureTables() {
  document
    .querySelectorAll<HTMLElement>('[data-role="table"]')
    .forEach(configureTable)
}

function configureTable(table: HTMLElement) {
  const rows = table.querySelectorAll<HTMLTableRowElement>('tr')

  rows.forEach(setupRowOnClick)
}

function setupRowOnClick(row: HTMLTableRowElement) {
  const link = row.getAttribute('project-link')

  if (!link) return

  row.addEventListener('click', () => {
    window.location.href = link
  })
}
