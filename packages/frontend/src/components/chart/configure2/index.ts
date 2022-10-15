import { assert } from '../../../utils/assert'
import { onRadioChange } from '../configure/state/onRadioChange'
import { toDays } from '../configure/toDays'
import { handleEffect } from './effects/handleEffect'
import { InitMessage, Message } from './messages'
import { render } from './render/render'
import { EMPTY_STATE } from './state/empty'
import { State } from './state/State'
import { update } from './update/update'

export function configureCharts() {
  document
    .querySelectorAll<HTMLElement>('[data-role="chart"]')
    .forEach(configureChart)
}

function configureChart(chart: HTMLElement) {
  const initMessage = getInitMessage(chart)

  let previousState: State = EMPTY_STATE
  let currentState: State = EMPTY_STATE

  function dispatch(message: Message) {
    const [nextState, effects] = update(currentState, message)
    currentState = nextState

    effects.forEach((effect) => handleEffect(effect, dispatch))

    requestAnimationFrame(renderUpdates)
  }

  function renderUpdates() {
    render(chart, previousState, currentState)
    previousState = currentState
  }

  window.addEventListener('resize', () => {
    previousState = EMPTY_STATE
    requestAnimationFrame(renderUpdates)
  })

  const rangeControls = document.querySelectorAll<HTMLInputElement>(
    '[data-role="chart-range-controls"] input',
  )
  onRadioChange(rangeControls, (control) => {
    dispatch({ type: 'DaysChanged', days: toDays(control.value) })
  })

  const currenciesControls = document.querySelectorAll<HTMLInputElement>(
    '[data-role="chart-currency-controls"] input',
  )
  onRadioChange(currenciesControls, (control) => {
    dispatch({
      type: 'CurrencyChanged',
      currency: control.value === 'ETH' ? 'eth' : 'usd',
    })
  })

  const scaleControls = document.querySelectorAll<HTMLInputElement>(
    '[data-role="chart-scale-controls"] input',
  )
  onRadioChange(scaleControls, (control) => {
    dispatch({
      type: 'ScaleChanged',
      isLogScale: control.value === 'LOG',
    })
  })

  const combinedControls = document.querySelector<HTMLInputElement>(
    '[data-role="chart-combined"]',
  )
  combinedControls?.addEventListener('change', () => {
    const checked = !!combinedControls.checked
    dispatch({ type: 'ShowAlternativeTvlChanged', showAlternativeTvl: checked })
  })

  const tvlActivityControls = document.querySelector<HTMLInputElement>(
    '[data-role="toggle-tvl-activity"]',
  )
  tvlActivityControls?.addEventListener('change', () => {
    const checked = !!tvlActivityControls.checked
    dispatch({ type: 'ViewChanged', view: checked ? 'activity' : 'tvl' })
  })

  const ethActivityControls = document.querySelector<HTMLInputElement>(
    '[data-role="toggle-ethereum-activity"]',
  )
  ethActivityControls?.addEventListener('change', () => {
    const checked = !!ethActivityControls.checked
    dispatch({ type: 'ShowEthereumChanged', showEthereum: checked })
  })

  dispatch(initMessage)
}

function getInitMessage(chart: HTMLElement): InitMessage {
  const initialView = chart.dataset.initialView
  assert(initialView === 'tvl' || initialView === 'activity')

  return {
    type: 'Init',
    initialView,
    days: 30, // TODO: determine this
    showEthereum: false, // TODO: determine this
    aggregateTvlEndpoint: chart.dataset.tvlEndpoint,
    alternativeTvlEndpoint: undefined, // TODO: determine this
    activityEndpoint: chart.dataset.activityEndpoint,
  }
}
