import { toDays } from '../toDays'
import { apiGet } from './api'
import { ChartInput } from './ChartInput'
import { ChartState } from './ChartState'
import { getControls } from './getControls'
import { getEndpoint } from './getEndpoint'
import { onRadioChange } from './onRadioChange'

export function makeChartState(chart: HTMLElement, onChange: () => void) {
  const controls = getControls(chart)

  const mainEndpoint = getEndpoint(chart)
  const selected = controls.token.find((x) => x.checked)
  const initialEndpoint = selected ? getEndpoint(selected) : mainEndpoint

  const state: ChartState = {
    endpoint: initialEndpoint,
    days: toDays(controls.range.find((x) => x.checked)?.value ?? '90D'),
    altCurrency: controls.currency.find((x) => x.checked)?.value === 'ETH',
    logScale: controls.scale.find((x) => x.checked)?.value === 'LOG',
    token: selected?.value,
  }

  if (state.endpoint) {
    setTimeout(() => updateInput(state.endpoint))
  }

  onRadioChange(controls.range, (control) => {
    state.days = toDays(control.value)
    onChange()
  })

  onRadioChange(controls.currency, (control) => {
    state.altCurrency = control.value === 'ETH'
    state.token = undefined
    for (const input of controls.token) {
      input.checked = false
    }
    if (state.endpoint !== mainEndpoint) {
      state.endpoint = mainEndpoint
      updateInput(state.endpoint)
    } else {
      onChange()
    }
  })

  onRadioChange(controls.scale, (control) => {
    state.logScale = control.value === 'LOG'
    onChange()
  })

  onRadioChange(controls.token, (control) => {
    state.endpoint = getEndpoint(control)
    state.token = control.value
    state.altCurrency = false
    for (const input of controls.currency) {
      input.checked = false
    }
    if (state.endpoint) {
      updateInput(state.endpoint)
    }
  })

  controls.moreTokens?.addEventListener('click', () => {
    controls.moreTokens?.parentElement?.classList.add('more')
  })

  function updateInput(url: string) {
    state.endpoint = url
    state.input = undefined
    onChange()
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
