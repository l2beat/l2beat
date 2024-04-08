import { makeQuery } from './query'
import { setSortingArrowsOrderKey } from './table/configureSorting'

const SORTING_ARROWS_NAMES = [
  'total-cost',
  'calldata',
  'blobs',
  'compute',
  'overhead',
]

export function configureCostsControlsWrappers() {
  const { $, $$ } = makeQuery(document.body)

  const cells = $$('[data-role="costs-controls-wrapper"]')

  const timeRangeControls = $$<HTMLInputElement>(
    '[data-role="chart-range-controls"] input',
  )
  const typeControls = $$<HTMLInputElement>(
    '[data-role="costs-type-controls"] input',
  )

  let checkedTimeRangeControl = $.maybe<HTMLInputElement>(
    '[data-role="chart-range-controls"] input:checked',
  )
  let checkedUnitControl = $.maybe<HTMLInputElement>(
    '[data-role="chart-unit-controls"] input:checked',
  )
  let checkedTypeControl = $.maybe<HTMLInputElement>(
    '[data-role="costs-type-controls"] input:checked',
  )

  function getSortingArrowsOrderKey() {
    if (!checkedUnitControl || !checkedTimeRangeControl) {
      return
    }
    const timeRange = checkedTimeRangeControl?.value
    const unit = checkedUnitControl?.value
    const type = checkedTypeControl?.value
    return `${timeRange}-${unit}-${type}`
  }

  function onTimeRangeChange(control: HTMLInputElement) {
    checkedTimeRangeControl = control
    cells.forEach((cell) => cell.setAttribute('data-time-range', control.value))
    SORTING_ARROWS_NAMES.forEach((name) => {
      const orderKey = getSortingArrowsOrderKey()
      if (orderKey) setSortingArrowsOrderKey(name, orderKey)
    })
    setSortingArrowsOrderKey('l2-tx-count', control.value)
  }

  function onUnitChange(control: HTMLInputElement) {
    checkedUnitControl = control
    cells.forEach((cell) => cell.setAttribute('data-unit', control.value))
    SORTING_ARROWS_NAMES.forEach((name) => {
      const orderKey = getSortingArrowsOrderKey()
      if (orderKey) setSortingArrowsOrderKey(name, orderKey)
    })
  }

  function onTypeChange(control: HTMLInputElement) {
    checkedTypeControl = control
    SORTING_ARROWS_NAMES.forEach((name) => {
      const orderKey = getSortingArrowsOrderKey()
      if (orderKey) setSortingArrowsOrderKey(name, orderKey)
    })
    const isPerL2Tx = control.value === 'PER-L2-TX'
    const isOneOrSevenDays =
      checkedTimeRangeControl?.value === '7D' ||
      checkedTimeRangeControl?.value === '1D'

    timeRangeControls.forEach((c) => {
      if (c.value === '1D' || c.value === '7D') {
        c.disabled = isPerL2Tx
      }
      if (c.value === '30D' && isPerL2Tx && isOneOrSevenDays) {
        c.checked = true
        c.dispatchEvent(new Event('change'))
      }
    })
    cells.forEach((cell) => cell.setAttribute('data-type', control.value))
  }

  typeControls.forEach((control) => {
    control.addEventListener('change', () => {
      onTypeChange(control)
    })
  })

  return {
    onTimeRangeChange,
    onUnitChange,
  }
}
