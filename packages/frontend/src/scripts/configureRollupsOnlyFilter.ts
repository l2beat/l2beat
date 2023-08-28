import { makeQuery } from './query'

export function configureRollupsOnlyFilter() {
  const { $, $$ } = makeQuery(document.body)
  const notRollups = $$('[data-rollup="false"]')

  const rollupsOnlyCheckbox = $.maybe<HTMLInputElement>(
    '#rollups-only-checkbox',
  )

  rollupsOnlyCheckbox?.addEventListener('change', () => {
    notRollups.forEach((notRollup) =>
      notRollup.classList.toggle('hidden', rollupsOnlyCheckbox.checked),
    )
  })
}
