export function configureFilters() {
  const combinedCheckbox =
    document.querySelector<HTMLInputElement>('#combined-bridges')
  const archivedCheckbox =
    document.querySelector<HTMLInputElement>('#archived-projects')

  const archived = Array.from(document.querySelectorAll('[data-archived]'))
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

  console.log(activeL2s.length)

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
}
