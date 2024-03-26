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

  let checkedUnitControl = unitControls.find((c) => c.checked)
  let checkedTimeRangeControl = timeRangeControls.find((c) => c.checked)

  function getSortingArrowsOrderKey() {
    if (!checkedUnitControl || !checkedTimeRangeControl) {
      throw new Error('No time range or unit control is checked')
    }
    return `${checkedTimeRangeControl.value}-${checkedUnitControl.value}`
  }

  timeRangeControls.forEach((control) => {
    control.addEventListener('change', () => {
      checkedTimeRangeControl = control
      tableCells.forEach((cell) =>
        cell.setAttribute('data-time-range', control.value),
      )
      SORTING_ARROWS_NAMES.forEach((name) =>
        setSortingArrowsOrderKey(name, getSortingArrowsOrderKey()),
      )
    })
  })

  unitControls.forEach((control) => {
    control.addEventListener('change', () => {
      checkedUnitControl = control
      tableCells.forEach((cell) =>
        cell.setAttribute('data-unit', control.value),
      )
      SORTING_ARROWS_NAMES.forEach((name) =>
        setSortingArrowsOrderKey(name, getSortingArrowsOrderKey()),
      )
    })
  })
}
