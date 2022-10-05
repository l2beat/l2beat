export function configureTvlActivity() {
  const checkbox = document.querySelector<HTMLInputElement>('#tvl-activity')
  const headerTvl = document.querySelector<HTMLElement>('#header-tvl')
  const headerActivity = document.querySelector<HTMLElement>('#header-activity')

  checkbox?.addEventListener('change', () => {
    headerTvl?.classList.toggle('hidden', checkbox.checked)
    headerActivity?.classList.toggle('hidden', !checkbox.checked)
  })
}
