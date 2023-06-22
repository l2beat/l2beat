import { setupControls } from './controls/setupControls'
import { handleEffect } from './effects/handleEffect'
import { ChartElements, getChartElements } from './elements'
import { InitMessage, Message } from './messages'
import { render } from './render/render'
import { EMPTY_STATE } from './state/empty'
import { Milestones, State } from './state/State'
import { update } from './update/update'
import { getUserChartSettings } from './userChartSettings'

export function configureCharts() {
  document
    .querySelectorAll<HTMLElement>('[data-role="chart"]')
    .forEach(configureChart)
}

function configureChart(chart: HTMLElement) {
  const elements = getChartElements(chart)

  let previousState: State = EMPTY_STATE
  let currentState: State = EMPTY_STATE

  function dispatch(message: Message) {
    const [nextState, effects] = update(currentState, message)
    currentState = nextState
    effects.forEach((effect) => handleEffect(effect, dispatch))
    requestAnimationFrame(renderUpdates)
  }

  function renderUpdates() {
    render(elements, previousState, currentState)
    previousState = currentState
  }

  window.addEventListener('resize', () => {
    previousState = EMPTY_STATE
    requestAnimationFrame(renderUpdates)
  })

  setupControls(elements, dispatch)
  dispatch(getInitMessage(elements))
}

function getInitMessage(elements: ChartElements): InitMessage {
  const pagePathname = new URL(elements.chart.baseURI).pathname
  const chartSettings = getUserChartSettings(pagePathname)

  const initialView = elements.chart.dataset.type === 'tvl' ? 'tvl' : 'activity'

  const milestones = elements.chart.dataset.milestones
    ? Milestones.parse(JSON.parse(elements.chart.dataset.milestones))
    : []

  return {
    type: 'Init',
    initialView,
    pagePathname,
    aggregateTvlEndpoint: elements.chart.dataset.tvlEndpoint,
    alternativeTvlEndpoint: '/api/combined-tvl.json', // TODO: pass this through props
    activityEndpoint: elements.chart.dataset.activityEndpoint,
    labelCount: elements.view.labels.length,
    milestones,
    ...chartSettings,
  }
}
