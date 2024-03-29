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
  const { $, $$ } = makeQuery(document.body)
  const searchParams = new URLSearchParams(window.location.search)

  const cells = $$('[data-role="costs-controls-wrapper"]')

  const unitControls = $$<HTMLInputElement>(
    '[data-role="costs-unit-controls"] input',
  )
  const timeRangeControls = $$<HTMLInputElement>(
    '[data-role="costs-time-range-controls"] input',
  )
  const typeControls = $$<HTMLInputElement>(
    '[data-role="costs-type-controls"] input',
  )

  let checkedTimeRangeControl = $<HTMLInputElement>(
    '[data-role="costs-time-range-controls"] input:checked',
  )
  let checkedUnitControl = $<HTMLInputElement>(
    '[data-role="costs-unit-controls"] input:checked',
  )
  let checkedTypeControl = $<HTMLInputElement>(
    '[data-role="costs-type-controls"] input:checked',
  )

  function getSortingArrowsOrderKey() {
    if (!checkedUnitControl || !checkedTimeRangeControl) {
      throw new Error('No time range or unit control is checked')
    }
    return `${checkedTimeRangeControl.value}-${checkedUnitControl.value}-${checkedTypeControl.value}`
  }

  function onTimeRangeChange(
    control: HTMLInputElement,
    urlSearchParams?: URLSearchParams,
  ) {
    const searchParams =
      urlSearchParams ?? new URLSearchParams(window.location.search)

    checkedTimeRangeControl = control
    cells.forEach((cell) => cell.setAttribute('data-time-range', control.value))
    SORTING_ARROWS_NAMES.forEach((name) =>
      setSortingArrowsOrderKey(name, getSortingArrowsOrderKey()),
    )
    setSortingArrowsOrderKey('tx-count', control.value)

    searchParams.set('time-range', control.value)
    setQueryParams(searchParams)
  }

  function onUnitChange(control: HTMLInputElement) {
    const searchParams = new URLSearchParams(window.location.search)

    checkedUnitControl = control
    cells.forEach((cell) => cell.setAttribute('data-unit', control.value))
    SORTING_ARROWS_NAMES.forEach((name) =>
      setSortingArrowsOrderKey(name, getSortingArrowsOrderKey()),
    )

    searchParams.set('unit', control.value)
    setQueryParams(searchParams)
  }

  function onTypeChange(control: HTMLInputElement) {
    const searchParams = new URLSearchParams(window.location.search)

    checkedTypeControl = control
    SORTING_ARROWS_NAMES.forEach((name) =>
      setSortingArrowsOrderKey(name, getSortingArrowsOrderKey()),
    )
    const isAmortized = control.value === 'AMORTIZED'
    const is24hOr7d =
      checkedTimeRangeControl.value === '7D' ||
      checkedTimeRangeControl.value === '24H'

    timeRangeControls.forEach((c) => {
      if (c.value === '24H' || c.value === '7D') {
        c.disabled = isAmortized
      }
      if (c.value === '30D' && isAmortized && is24hOr7d) {
        c.checked = true
        onTimeRangeChange(c, searchParams)
      }
    })
    cells.forEach((cell) => cell.setAttribute('data-type', control.value))

    searchParams.set('type', control.value)
    setQueryParams(searchParams)
  }

  const preselectedTimeRange = searchParams.get('time-range')
  const preselectedUnit = searchParams.get('unit')
  const preselectedType = searchParams.get('type')

  timeRangeControls.forEach((control) => {
    if (control.value === preselectedTimeRange) {
      control.checked = true
      onTimeRangeChange(control)
    }

    control.addEventListener('change', () => onTimeRangeChange(control))
  })

  unitControls.forEach((control) => {
    if (control.value === preselectedUnit) {
      control.checked = true
      onUnitChange(control)
    }
    control.addEventListener('change', () => onUnitChange(control))
  })

  typeControls.forEach((control) => {
    if (control.value === preselectedType) {
      control.checked = true
      onTypeChange(control)
    }
    control.addEventListener('change', () => {
      onTypeChange(control)
    })
  })
}
