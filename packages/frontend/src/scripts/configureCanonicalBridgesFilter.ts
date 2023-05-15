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

  const combinedCheckbox = document.querySelector<HTMLInputElement>(
    '#combined-bridges-checkbox',
  )

  combinedCheckbox?.addEventListener('change', () => {
    bridgesOnlyCells.forEach((x) =>
      x.classList.toggle('hidden', combinedCheckbox.checked),
    )
    combinedOnlyCells.forEach((x) =>
      x.classList.toggle('hidden', !combinedCheckbox.checked),
    )
    L2s.forEach((x) => {
      x.classList.toggle('hidden', !combinedCheckbox.checked)
    })
  })
}
