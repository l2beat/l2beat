import { z } from 'zod'

import { makeQuery } from './query'
import { setSortingArrowsOrderKey } from './table/configureSorting'
import { setQueryParams } from './utils/setQueryParams'

const LivenessTimeRangeControlsValues = z.enum(['30D', '90D', 'MAX'])
type LivenessTimeRangeControlsValues = z.infer<
  typeof LivenessTimeRangeControlsValues
>

export function configureLivenessTimeRangeControls() {
  const searchParams = new URLSearchParams(window.location.search)

  const { $$ } = makeQuery()
  const livenessTimeRangeControls = $$<HTMLInputElement>(
    '[data-role="liveness-time-range-controls"] input',
  )
  const livenessTimeRangeCells = $$('[data-role="liveness-time-range-cell"]')

  const preselectedTimeRange = searchParams.get('time-range')
  livenessTimeRangeControls.forEach((control) => {
    if (control.value === preselectedTimeRange) {
      const parsedValue = LivenessTimeRangeControlsValues.parse(control.value)
      control.checked = true

      setSortingArrowsOrderKey('tx-data-submissions', control.value)
      setSortingArrowsOrderKey('proof-submissions', control.value)
      setSortingArrowsOrderKey('state-updates', control.value)

      manageCellVisibility(parsedValue)
    }
    control.addEventListener('change', () => {
      const searchParams = new URLSearchParams(window.location.search)

      const parsedValue = LivenessTimeRangeControlsValues.parse(control.value)
      manageCellVisibility(parsedValue)

      setSortingArrowsOrderKey('tx-data-submissions', control.value)
      setSortingArrowsOrderKey('proof-submissions', control.value)
      setSortingArrowsOrderKey('state-updates', control.value)

      searchParams.set('time-range', parsedValue)
      setQueryParams(searchParams)
    })
  })

  function manageCellVisibility(state: LivenessTimeRangeControlsValues) {
    livenessTimeRangeCells.forEach((cell) => {
      cell.dataset.state = state
    })
  }
}
