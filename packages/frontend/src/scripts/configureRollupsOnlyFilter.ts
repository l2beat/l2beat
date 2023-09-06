import { LocalStorage } from './local-storage/LocalStorage'
import { makeQuery } from './query'

export function configureRollupsOnlyFilter() {
  const { $, $$ } = makeQuery(document.body)
  const notRollups = $$('[data-rollup="false"]')

  const rollupsOnlyCheckbox = $.maybe<HTMLInputElement>(
    '#rollups-only-checkbox',
  )
  if (!rollupsOnlyCheckbox) {
    return
  }
  const isChecked = !!LocalStorage.getItem('rollups-only-checked')

  const manageNonRollupsVisibility = (hide: boolean) => {
    notRollups.forEach((notRollup) =>
      notRollup.classList.toggle('hidden', hide),
    )
  }

  if (isChecked) {
    rollupsOnlyCheckbox.checked = isChecked
    manageNonRollupsVisibility(isChecked)
  }

  rollupsOnlyCheckbox.addEventListener('change', () => {
    LocalStorage.setItem('rollups-only-checked', rollupsOnlyCheckbox.checked)
    manageNonRollupsVisibility(rollupsOnlyCheckbox.checked)
  })
}
