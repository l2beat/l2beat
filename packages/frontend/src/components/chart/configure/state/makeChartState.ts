import { toDays } from '../toDays'
import { apiGet } from './api'
import { Charts } from './ChartInput'
import { ChartState } from './ChartState'
import { getControls } from './getControls'
import {
  getActivityEndpoint,
  getEthereumActivityEndpoint,
  getInitialEndpoint,
  getTvlEndpoint,
} from './getEndpoint'
import { getType } from './getType'
import { onRadioChange } from './onRadioChange'

export function makeChartState(chart: HTMLElement, onChange: () => void) {
  const controls = getControls(chart)

  const type = getType(chart)
  const selected = controls.token.find((x) => x.checked)
  const initialEndpoint = getInitialEndpoint(type, chart, selected)

  const state: ChartState = {
    type,
    endpoint: initialEndpoint,
    days: toDays(controls.range.find((x) => x.checked)?.value ?? '90D'),
    altCurrency: controls.currencies.find((x) => x.checked)?.value === 'ETH',
    logScale: controls.scale.find((x) => x.checked)?.value === 'LOG',
    token: selected?.value,
    secondaryEndpoint: getEthereumActivityEndpoint(
      controls.ethActivity?.checked,
      chart,
    ),
  }

  if (state.endpoint) {
    setTimeout(() => updateInput(state.endpoint))
  }

  if (state.secondaryEndpoint) {
    setTimeout(() => updateSecondaryInput(state.secondaryEndpoint))
  }

  onRadioChange(controls.range, (control) => {
    state.days = toDays(control.value)
    if (state.endpoint) {
      updateInput(state.endpoint)
    } else {
      onChange()
    }
  })

  onRadioChange(controls.currencies, (control) => {
    state.altCurrency = control.value === 'ETH'
    state.token = undefined
    for (const input of controls.token) {
      input.checked = false
    }
    if (state.endpoint !== getTvlEndpoint(chart)) {
      state.endpoint = getTvlEndpoint(chart)
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
    state.endpoint = getTvlEndpoint(control)
    state.token = control.value
    state.altCurrency = false
    for (const input of controls.currencies) {
      input.checked = false
    }
    if (state.endpoint) {
      updateInput(state.endpoint)
    }
  })

  controls.moreTokens?.addEventListener('click', () => {
    controls.moreTokens?.parentElement
      ?.querySelectorAll('label')
      .forEach((x) => x.classList.remove('hidden'))
    controls.moreTokens?.classList.add('hidden')
  })

  controls.combined?.addEventListener('change', () => {
    const checked = !!controls.combined?.checked
    updateInput(!checked ? getTvlEndpoint(chart) : '/api/combined-tvl.json')
  })

  controls.tvlActivity?.addEventListener('change', () => {
    const checked = !!controls.tvlActivity?.checked
    updateType(checked)
  })

  controls.ethActivity?.addEventListener('change', () => {
    updateSecondaryInput(
      getEthereumActivityEndpoint(controls.ethActivity?.checked, chart),
    )
  })

  function updateType(toActivity: boolean) {
    if (toActivity) {
      state.type = 'activity'
      onChange()
      controls.currencyControl?.classList.add('hidden')
      controls.ethActivity?.parentElement?.classList.remove('hidden')
      updateInput(getActivityEndpoint(chart))
    } else {
      state.type = 'tvl'
      onChange()
      controls.ethActivity?.parentElement?.classList.add('hidden')
      controls.currencyControl?.classList.remove('hidden')
      updateInput(getTvlEndpoint(chart))
    }
  }

  function updateInput(url: string) {
    state.endpoint = url
    state.mainInput = undefined
    onChange()
    apiGet<Charts>(url).then((result) => {
      // prevent race conditions
      if (state.endpoint !== url) {
        return
      }
      state.mainInput = getInput(state, result)
      onChange()
    }, console.error)
  }

  function updateSecondaryInput(url?: string) {
    state.secondaryEndpoint = url
    state.secondaryInput = undefined
    onChange()
    if (!url) {
      return
    }
    apiGet<Charts>(url).then((result) => {
      // prevent race conditions
      if (state.secondaryEndpoint !== url) {
        return
      }
      state.secondaryInput = getInput(state, result)
      onChange()
    }, console.error)
  }

  return state
}

function getInput(state: ChartState, result: Charts) {
  return state.days === 7
    ? result.hourly
    : state.days <= 90
    ? result.sixHourly
    : result.daily
}
