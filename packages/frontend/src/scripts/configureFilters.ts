export function configureFilters() {
  const archived = Array.from(
    document.querySelectorAll<HTMLElement>('[data-archived]'),
  )
  const upcoming = Array.from(
    document.querySelectorAll<HTMLElement>('[data-upcoming]'),
  )
  const L2s = Array.from(
    document.querySelectorAll<HTMLElement>('[data-layer2]'),
  )
  const bridgesOnlyCells = Array.from(
    document.querySelectorAll<HTMLElement>('[data-bridges-only-cell]'),
  )
  const combinedOnlyCells = Array.from(
    document.querySelectorAll<HTMLElement>('[data-combined-only-cell]'),
  )

  const archivedBridges = archived.filter((x) => !L2s.includes(x))
  const archivedL2s = archived.filter((x) => L2s.includes(x))
  const activeL2s = L2s.filter((x) => !archivedL2s.includes(x))

  const combinedCheckbox =
    document.querySelector<HTMLInputElement>('#combined-bridges')
  const archivedCheckbox = setupArchivedCheckbox(archived)
  const upcomingCheckbox = setupUpcomingCheckbox(upcoming)

  // this call ensures that the numbers are rendered correctly on page load
  // this needs to be called after the checkboxes are set up
  renderNumbers()

  archivedCheckbox?.addEventListener('change', () => {
    localStorage.setItem(
      'l2beat-filter-archived',
      archivedCheckbox.checked.toString(),
    )

    const l2sVisible = !combinedCheckbox || combinedCheckbox.checked

    archivedL2s.forEach((x) => {
      if (l2sVisible) {
        x.classList.toggle('hidden', !archivedCheckbox.checked)
      }
    })
    archivedBridges.forEach((x) =>
      x.classList.toggle('hidden', !archivedCheckbox.checked),
    )
    renderNumbers()
  })

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
    archivedL2s.forEach((x) => {
      x.classList.toggle(
        'hidden',
        !(archivedCheckbox?.checked && combinedCheckbox.checked),
      )
    })
    renderNumbers()
  })

  upcomingCheckbox?.addEventListener('change', () => {
    localStorage.setItem(
      'l2beat-filter-upcoming',
      upcomingCheckbox.checked.toString(),
    )

    upcoming.forEach((x) => {
      x.classList.toggle('hidden', !upcomingCheckbox.checked)
    })
    renderNumbers()
  })
}

function setupArchivedCheckbox(archived: HTMLElement[]) {
  const saved = localStorage.getItem('l2beat-filter-archived')

  const archivedCheckbox =
    document.querySelector<HTMLInputElement>('#archived-projects')

  if (archivedCheckbox) {
    archivedCheckbox.checked = saved === 'true' ? true : false

    archived.forEach((x) => {
      x.classList.toggle('hidden', !archivedCheckbox.checked)
    })
  }

  return archivedCheckbox
}

function setupUpcomingCheckbox(upcoming: HTMLElement[]) {
  const saved = localStorage.getItem('l2beat-filter-upcoming')

  const upcomingCheckbox =
    document.querySelector<HTMLInputElement>('#upcoming-rollups')

  if (upcomingCheckbox) {
    upcomingCheckbox.checked = saved === 'true' ? true : false

    upcoming.forEach((x) => {
      x.classList.toggle('hidden', !upcomingCheckbox.checked)
    })
  }

  return upcomingCheckbox
}

// this function is currently placed in the same file as configureFilters()
// because only configureFilters changes the numbering of the rows
// in the future maybe this should be a separate script with its own eventListener
function renderNumbers() {
  const isTableVisible = document.querySelector('[data-role="table"]')
  if (!isTableVisible) {
    console.debug('triggered renderNumbers() | table not visible')
    return
  }

  const visibleRows = Array.from(
    document.querySelectorAll('[data-role="row"]'),
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
}
