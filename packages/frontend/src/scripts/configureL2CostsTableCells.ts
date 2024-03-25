import { makeQuery } from './query'

export function configureL2CostsTableCells() {
  const { $$ } = makeQuery(document.body)

  const tableCells = $$('[data-role="l2-costs-table-cell"]')

  const unitControls = $$<HTMLInputElement>(
    '[data-role="l2-costs-unit-controls"] input',
  )
  const timeRangeControls = $$<HTMLInputElement>(
    '[data-role="l2-costs-time-range-controls"] input',
  )

  timeRangeControls.forEach((control) => {
    control.addEventListener('change', () => {
      tableCells.forEach((cell) =>
        cell.setAttribute('data-time-range', control.value),
      )
    })
  })

  unitControls.forEach((control) => {
    control.addEventListener('change', () => {
      console.log(control.value)
      tableCells.forEach((cell) =>
        cell.setAttribute('data-unit', control.value),
      )
    })
  })
}
