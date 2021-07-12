import { getContext } from '../getContext'
import { getElements } from '../getElements'
import { makeChartState } from '.'
import { plot } from '../plot'

export function initChart(chart: HTMLElement) {
  const { output, canvas } = getElements(chart)
  const ctx = getContext(canvas)

  const state = makeChartState(chart, () => requestAnimationFrame(draw))
  window.addEventListener('resize', () => requestAnimationFrame(draw))

  function draw() {
    if (!state.input) {
      return
    }

    console.log(state)

    plot(state.input, state.days, ctx)
  }
}
