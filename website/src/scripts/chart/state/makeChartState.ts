import { apiGet } from './api'
import { ChartInput } from './ChartInput'
import { onRadioChange } from './onRadioChange'
import { getInitialEndpoint } from './getInitialEndpoint'
import { toDays } from '../toDays'
import { ChartState } from './ChartState'
import { getControls } from './getControls'

export function makeChartState(chart: HTMLElement, onChange: () => void) {
  const controls = getControls(chart)

  const state: ChartState = {
    endpoint: getInitialEndpoint(chart),
    days: toDays(controls.range.find((x) => x.checked)?.value ?? '90D'),
    altCurrency: controls.currency.find((x) => x.checked)?.value === 'ETH',
    logScale: controls.scale.find((x) => x.checked)?.value === 'LOG',
  }

  if (state.endpoint) {
    updateInput(state.endpoint)
  }

  onRadioChange(controls.range, (control) => {
    state.days = toDays(control.value)
    onChange()
  })

  onRadioChange(controls.currency, (control) => {
    state.altCurrency = control.value === 'ETH'
    onChange()
  })

  onRadioChange(controls.scale, (control) => {
    state.logScale = control.value === 'LOG'
    onChange()
  })

  function updateInput(url: string) {
    state.endpoint = url
    apiGet<ChartInput>(url).then((result) => {
      // prevent race conditions
      if (state.endpoint === url) {
        state.input = result
        onChange()
      }
    })
  }

  return state
}
