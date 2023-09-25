import { LocalStorage } from './local-storage/LocalStorage'
import { makeQuery } from './query'

export function configureRollupsOnlyFilter() {
  const { $ } = makeQuery(document.body)

  const rollupsOnlyCheckbox = $.maybe<HTMLInputElement>(
    '#rollups-only-checkbox',
  )
  if (!rollupsOnlyCheckbox) {
    return
  }

  const isChecked = !!LocalStorage.getItem('rollups-only-checked')

  if (isChecked) {
    rollupsOnlyCheckbox.checked = true
    rollupsOnlyCheckbox.dispatchEvent(new Event('change'))
  }

  rollupsOnlyCheckbox.addEventListener('change', () => {
    LocalStorage.setItem('rollups-only-checked', rollupsOnlyCheckbox.checked)
  })
}
