export function configureFilters() {
  const combinedCheckbox =
    document.querySelector<HTMLInputElement>('#combined-bridges')
  const archivedCheckbox =
    document.querySelector<HTMLInputElement>('#archived-projects')
  const upcomingCheckbox =
    document.querySelector<HTMLInputElement>('#upcoming-rollups')

  const archived = Array.from(document.querySelectorAll('[data-archived]'))
  const upcoming = Array.from(document.querySelectorAll('[data-upcoming]'))
  const L2s = Array.from(document.querySelectorAll('[data-layer2]'))
  const bridgesOnlyCells = Array.from(
    document.querySelectorAll('[data-bridges-only-cell]'),
  )
  const combinedOnlyCells = Array.from(
    document.querySelectorAll('[data-combined-only-cell]'),
  )

  const archivedBridges = archived.filter((x) => !L2s.includes(x))
  const archivedL2s = archived.filter((x) => L2s.includes(x))
  const activeL2s = L2s.filter((x) => !archivedL2s.includes(x))

  archivedCheckbox?.addEventListener('change', () => {
    const l2sVisible = !combinedCheckbox || combinedCheckbox.checked

    archivedL2s.forEach((x) => {
      if (l2sVisible) {
        x.classList.toggle('hidden', !archivedCheckbox.checked)
      }
    })
    archivedBridges.forEach((x) =>
      x.classList.toggle('hidden', !archivedCheckbox.checked),
    )
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
  })

  upcomingCheckbox?.addEventListener('change', () => {
    upcoming.forEach((x) => {
      x.classList.toggle('hidden', !upcomingCheckbox.checked)
    })
  })
}
