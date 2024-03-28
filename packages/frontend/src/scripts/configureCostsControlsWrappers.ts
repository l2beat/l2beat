import { makeQuery } from './query'
import { setSortingArrowsOrderKey } from './table/configureSorting'
import { setQueryParams } from './utils/setQueryParams'

const SORTING_ARROWS_NAMES = [
  'total-cost',
  'calldata',
  'blobs',
  'compute',
  'overhead',
]

export function configureCostsControlsWrappers() {
  const { $$ } = makeQuery(document.body)
  const searchParams = new URLSearchParams(window.location.search)

  const cells = $$('[data-role="costs-controls-wrapper"]')

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

  const preselectedTimeRange = searchParams.get('time-range')
  const preselectedUnit = searchParams.get('unit')

  timeRangeControls.forEach((control) => {
    if (control.value === preselectedTimeRange) {
      control.checked = true
      onTimeRangeChange(control)
    }

    control.addEventListener('change', () => {
      const searchParams = new URLSearchParams(window.location.search)

      onTimeRangeChange(control)

      searchParams.set('time-range', control.value)
      setQueryParams(searchParams)
    })
  })

  unitControls.forEach((control) => {
    if (control.value === preselectedUnit) {
      control.checked = true
      onUnitChange(control)
    }
    control.addEventListener('change', () => {
      const searchParams = new URLSearchParams(window.location.search)

      onUnitChange(control)

      searchParams.set('unit', control.value)
      setQueryParams(searchParams)
    })
  })
}
