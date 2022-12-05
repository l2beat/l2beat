import { setupControls } from './controls/setupControls'
import { toDays } from './controls/toDays'
import { handleEffect } from './effects/handleEffect'
import { ChartElements, getChartElements } from './elements'
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
  const initialView = elements.chart.dataset.type === 'tvl' ? 'tvl' : 'activity'

  const daysValue =
    elements.controls.days.find((x) => x.checked)?.value ?? '30D'
  const days = toDays(daysValue)

  const showEthereum = !!elements.controls.showEthereum?.checked

  return {
    type: 'Init',
    initialView,
    days,
    showEthereum,
    aggregateTvlEndpoint: elements.chart.dataset.tvlEndpoint,
    alternativeTvlEndpoint: '/api/combined-tvl.json', // TODO: pass this through props
    activityEndpoint: elements.chart.dataset.activityEndpoint,
    labelCount: elements.view.labels.length,
    // we don't yet know how we obtain this
    milestones: [
      {
        name: 'Nitro Upgrade',
        link: 'https://medium.com/offchainlabs/arbitrum-nitro-one-small-step-for-l2-one-giant-leap-for-ethereum-bc9108047450',
        date: '2022-08-31T00:00:00Z',
        description:
          'Upgrade is live, introducing new architecture, increased throughput and lower fees.',
      },
      {
        name: 'Nitro Upgrade',
        link: 'https://medium.com/offchainlabs/arbitrum-nitro-one-small-step-for-l2-one-giant-leap-for-ethereum-bc9108047450',
        date: '2022-11-30T00:00:00Z',
        description:
          'Upgrade is live, introducing new architecture, increased throughput and lower fees.',
      },
    ],
  }
}
