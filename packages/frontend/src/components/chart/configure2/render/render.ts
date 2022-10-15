import { fillBelowChart } from '../../configure/draw/fillBelowChart'
import { strokeChartLine } from '../../configure/draw/strokeChartLine'
import { getMainStyle, getSecondaryStyle } from '../../configure/draw/style'
import { State } from '../state/State'

export function render(chart: HTMLElement, previousState: State, state: State) {
  if (previousState === state) {
    return
  }

  if (state.request.showLoader !== previousState.request.showLoader) {
    chart
      .querySelector('[data-role="chart-loader"]')
      ?.classList.toggle('hidden', !state.request.showLoader)
  }

  if (state.view !== previousState.view) {
    const labels = Array.from(
      chart.querySelectorAll('[data-role="chart-label"]'),
    )
    for (let i = 0; i < 5; i++) {
      labels[i].innerHTML = state.view.labels?.[4 - i] ?? '...'
    }

    const canvas = chart.querySelector<HTMLCanvasElement>(
      '[data-role="chart-canvas"]',
    )
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      renderChart(state, canvas, ctx)
    }
  }
}

function renderChart(
  state: State,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
  if (!state.view.chart) {
    return
  }

  const box = canvas.getBoundingClientRect()
  canvas.width = box.width * window.devicePixelRatio
  canvas.height = box.height * window.devicePixelRatio

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const mainStyle = getMainStyle(canvas, ctx)
  const secondaryStyle = getSecondaryStyle(canvas, ctx)

  if (
    state.controls.showEthereum &&
    state.view.chart.type === 'ActivityChart'
  ) {
    const mainPoints = state.view.chart.points
    const secondaryPoints = mainPoints.map((p) => ({ x: p.x, y: p.y2 }))
    fillBelowChart(ctx, secondaryPoints, canvas, secondaryStyle.fillGradient, {
      fade: true,
    })
    fillBelowChart(ctx, mainPoints, canvas, mainStyle.fillGradient)
    strokeChartLine(ctx, secondaryPoints, canvas, secondaryStyle.strokeGradient)
    strokeChartLine(ctx, mainPoints, canvas, mainStyle.strokeGradient)
  } else {
    const mainPoints = state.view.chart.points
    fillBelowChart(ctx, mainPoints, canvas, mainStyle.fillGradient)
    strokeChartLine(ctx, mainPoints, canvas, mainStyle.strokeGradient)
  }
}
