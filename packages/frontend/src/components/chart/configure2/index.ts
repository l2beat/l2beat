import { assert } from '../../../utils/assert'
import { Effect } from './effects'
import { InitMessage, Message } from './messages'
import { State } from './State'
import { update } from './update/update'

export function configureCharts() {
  document
    .querySelectorAll<HTMLElement>('[data-role="chart"]')
    .forEach(configureChart)
}

function configureChart(chart: HTMLElement) {
  const initMessage = getInitMessage(chart, 30)

  let previousState: State | undefined
  let currentState: State | undefined

  function dispatch(message: Message) {
    const [nextState, effects] = update(currentState, message)
    previousState = currentState
    currentState = nextState

    effects.forEach(handleEffect)

    const [previous, current] = [previousState, currentState]
    requestAnimationFrame(() => render(previous, current))
  }

  function handleEffect(effect: Effect) {
    console.log('effect', effect)
  }

  function render(previousState: State | undefined, currentState: State) {
    console.log('render', previousState, currentState)
  }

  dispatch(initMessage)
}

function getInitMessage(chart: HTMLElement, days: number): InitMessage {
  const initialView = chart.dataset.initialView
  assert(initialView === 'tvl' || initialView === 'activity')

  return {
    type: 'InitMessage',
    initialView,
    days,
    tvlEndpoint: chart.dataset.tvlEndpoint,
    activityEndpoint: chart.dataset.activityEndpoint,
  }
}
