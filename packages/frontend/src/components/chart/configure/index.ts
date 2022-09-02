import { getOutputs } from './getOutputs'
import { initHover } from './hover'
import { plot } from './plot'
import { ChartStateWithInput, makeChartState } from './state'
import { toUiState, UiState } from './ui'

export function configureChart() {
  const chart = document.querySelector<HTMLElement>('[data-role="chart"]')
  if (!chart) {
    return
  }

  const outputs = getOutputs(chart)

  let uiState: UiState | undefined
  const chartState = makeChartState(chart, () => update())
  window.addEventListener('resize', () => requestAnimationFrame(draw))

  function update() {
    uiState = chartState.input && toUiState(chartState as ChartStateWithInput)
    requestAnimationFrame(draw)
  }

  const hover = initHover(chart)

  function draw() {
    hover.update(uiState)
    plot(uiState, outputs)
  }
}
