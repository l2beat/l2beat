import { z } from 'zod'

import { makeQuery } from './query'

const LivenessTimeRangeControlsValues = z.enum(['30D', '90D', 'MAX'])
type LivenessTimeRangeControlsValues = z.infer<
  typeof LivenessTimeRangeControlsValues
>

export function configureLivenessTimeRangeControls() {
  const { $$ } = makeQuery(document.body)
  const livenessTimeRangeControls = $$<HTMLInputElement>(
    '[data-role="liveness-time-range-controls"] input',
  )
  const livenessTimeRangeCells = $$('[data-role="liveness-time-range-cell"]')
  livenessTimeRangeControls.forEach((control) => {
    control.addEventListener('change', () => {
      const parsedValue = LivenessTimeRangeControlsValues.parse(control.value)
      manageCellVisibility(parsedValue)
    })
  })

  const manageCellVisibility = (state: LivenessTimeRangeControlsValues) => {
    livenessTimeRangeCells.forEach((cell) => {
      cell.dataset.state = state
    })
  }
}
