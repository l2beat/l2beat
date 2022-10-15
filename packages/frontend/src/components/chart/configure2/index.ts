import { assert } from '../../../utils/assert'
import { handleEffect } from './effects/handleEffect'
import { InitMessage, Message } from './messages'
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

    requestAnimationFrame(render)
  }

  function render() {
    console.log('render', previousState, currentState)
    previousState = currentState
  }

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
