import { LocalStorage } from './local-storage/LocalStorage'

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
  if (!combinedCheckbox) {
    return
  }

  const manageTableRowsVisibility = (isCheckboxChecked: boolean) => {
    bridgesOnlyCells.forEach((x) =>
      x.classList.toggle('hidden', isCheckboxChecked),
    )
    combinedOnlyCells.forEach((x) =>
      x.classList.toggle('hidden', !isCheckboxChecked),
    )
    L2s.forEach((x) => {
      x.classList.toggle('hidden', !isCheckboxChecked)
    })
  }

  const isChecked = !!LocalStorage.getItem('combined-bridges-checked')
  combinedCheckbox.checked = isChecked
  combinedCheckbox.dispatchEvent(new Event('change'))
  manageTableRowsVisibility(isChecked)

  combinedCheckbox.addEventListener('change', () => {
    LocalStorage.setItem('combined-bridges-checked', combinedCheckbox.checked)
    manageTableRowsVisibility(combinedCheckbox.checked)
  })
}
