export function configureCombinedBridges() {
  const checkbox = document.querySelector<HTMLInputElement>('#combined-bridges')
  const bridgesOnly = document.querySelectorAll('[data-bridges-only]')
  const combinedOnly = document.querySelectorAll('[data-combined-only]')

  checkbox?.addEventListener('change', () => {
    bridgesOnly.forEach((x) => x.classList.toggle('hidden', checkbox.checked))
    combinedOnly.forEach((x) => x.classList.toggle('hidden', !checkbox.checked))
  })
}
