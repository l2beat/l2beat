import { makeQuery } from './query'
import { setSortingArrowsOrderKey } from './table/configureSorting'

const SORTING_ARROWS_NAMES = [
  'total-cost',
  'calldata',
  'blobs',
  'compute',
  'overhead',
]

const defaultChecked = {
  timeRange: '7D',
  unit: 'USD',
  type: 'TOTAL',
}

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
      throw new Error('No time range or unit control is checked')
    }
    const timeRange = checkedTimeRangeControl?.value ?? defaultChecked.timeRange
    const unit = checkedUnitControl?.value ?? defaultChecked.unit
    const type = checkedTypeControl?.value ?? defaultChecked.type
    return `${unit}-${timeRange}-${type}`
  }

  function onTimeRangeChange(control: HTMLInputElement) {
    checkedTimeRangeControl = control
    cells.forEach((cell) => cell.setAttribute('data-time-range', control.value))
    SORTING_ARROWS_NAMES.forEach((name) =>
      setSortingArrowsOrderKey(name, getSortingArrowsOrderKey()),
    )
    setSortingArrowsOrderKey('tx-count', control.value)
  }

  function onUnitChange(control: HTMLInputElement) {
    checkedUnitControl = control
    cells.forEach((cell) => cell.setAttribute('data-unit', control.value))
    SORTING_ARROWS_NAMES.forEach((name) =>
      setSortingArrowsOrderKey(name, getSortingArrowsOrderKey()),
    )
  }

  function onTypeChange(control: HTMLInputElement) {
    checkedTypeControl = control
    SORTING_ARROWS_NAMES.forEach((name) =>
      setSortingArrowsOrderKey(name, getSortingArrowsOrderKey()),
    )
    const isAmortized = control.value === 'AMORTIZED'
    const isOneOrSevenDays =
      checkedTimeRangeControl?.value === '7D' ||
      checkedTimeRangeControl?.value === '1D'

    timeRangeControls.forEach((c) => {
      if (c.value === '1D' || c.value === '7D') {
        c.disabled = isAmortized
      }
      if (c.value === '30D' && isAmortized && isOneOrSevenDays) {
        c.checked = true
        onTimeRangeChange(c)
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
