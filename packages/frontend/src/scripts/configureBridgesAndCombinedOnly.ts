import { makeQuery } from './query'

export function configureBridgesAndCombinedOnly() {
  const { $, $$ } = makeQuery(document.body)

  const includeCanonicalCheckbox = $.maybe<HTMLInputElement>(
    '[data-role=chart-combined]',
  )
  const bridgesOnlyCells = $$('[data-bridges-only-cell]')
  const combinedOnlyCells = $$('[data-combined-only-cell]')
  includeCanonicalCheckbox?.addEventListener('change', () => {
    const includeCanonical = !!includeCanonicalCheckbox.checked
    bridgesOnlyCells.forEach((cell) =>
      cell.classList.toggle('hidden', includeCanonical),
    )
    combinedOnlyCells.forEach((cell) =>
      cell.classList.toggle('hidden', !includeCanonical),
    )
  })
}
