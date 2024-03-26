import { makeQuery } from './query'
import { setSortingArrowsOrderKey } from './table/configureSorting'

const SORTING_ARROWS_NAMES = [
  'total-cost',
  'calldata',
  'blobs',
  'compute',
  'overhead',
]

export function configureCostsTableCells() {
  const { $$ } = makeQuery(document.body)

  const tableCells = $$('[data-role="costs-table-cell"]')

  const unitControls = $$<HTMLInputElement>(
    '[data-role="costs-unit-controls"] input',
  )
  const timeRangeControls = $$<HTMLInputElement>(
    '[data-role="costs-time-range-controls"] input',
  )

  timeRangeControls.forEach((control) => {
    control.addEventListener('change', () => {
      tableCells.forEach((cell) =>
        cell.setAttribute('data-time-range', control.value),
      )
      SORTING_ARROWS_NAMES.forEach((name) =>
        setSortingArrowsOrderKey(name, control.value),
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
