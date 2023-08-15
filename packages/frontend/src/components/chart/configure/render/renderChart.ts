import { State } from '../state/State'
import { fillBelowChart } from './fillBelowChart'
import { labelText } from './labelText'
import { moveToMany } from './moveToMany'
import { strokeChartLine } from './strokeChartLine'
import {
  getCBVStyle,
  getEBVStyle,
  getMainStyle,
  getNMVStyle,
  getSecondaryStyle,
} from './style'

export function renderChart(
  state: State,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  drawYAxis: boolean,
) {
  if (!state.view.chart) {
    return
  }

  const box = canvas.getBoundingClientRect()
  canvas.width = box.width * window.devicePixelRatio
  canvas.height = box.height * window.devicePixelRatio
  const usableHeight = getUsableHeight(canvas, drawYAxis)

  const mainStyle = getMainStyle(canvas, ctx)
  const secondaryStyle = getSecondaryStyle(canvas, ctx)
  const yAxisStyle = getYAxisStyle(state.controls.theme)

  if (
    state.controls.showEthereum &&
    state.view.chart.type === 'ActivityChart'
  ) {
    const mainPoints = state.view.chart.points
    const secondaryPoints = mainPoints.map((p) => ({ x: p.x, y: p.y2 }))
    fillBelowChart(
      ctx,
      secondaryPoints,
      canvas,
      usableHeight,
      secondaryStyle.fillGradient,
      {
        fade: true,
      },
    )
    fillBelowChart(
      ctx,
      mainPoints,
      canvas,
      usableHeight,
      mainStyle.fillGradient,
    )

    if (drawYAxis) {
      drawYAxisLabels(
        ctx,
        state.view.labels,
        canvas,
        usableHeight,
        yAxisStyle.lineStroke,
        yAxisStyle.labelFill,
      )
    }

    strokeChartLine(
      ctx,
      secondaryPoints,
      canvas,
      usableHeight,
      secondaryStyle.strokeGradient,
    )
    strokeChartLine(
      ctx,
      mainPoints,
      canvas,
      usableHeight,
      mainStyle.strokeGradient,
    )
  } else if (state.view.chart.type === 'AggregateDetailedTvlChart') {
    const cbvFillStyle = getCBVStyle(canvas, ctx)
    const ebvFillStyle = getEBVStyle(canvas, ctx)
    const nmvFillStyle = getNMVStyle(canvas, ctx)
    const cbvPoints = state.view.chart.points.map((p) => ({
      x: p.x,
      y: p.parts.cbv,
    }))
    const ebvPoints = state.view.chart.points.map((p) => ({
      x: p.x,
      y: p.parts.ebv,
    }))
    const nmvPoints = state.view.chart.points.map((p) => ({
      x: p.x,
      y: p.parts.nmv,
    }))

    fillBelowChart(ctx, cbvPoints, canvas, usableHeight, cbvFillStyle)
    fillBelowChart(ctx, ebvPoints, canvas, usableHeight, ebvFillStyle)
    fillBelowChart(ctx, nmvPoints, canvas, usableHeight, nmvFillStyle)
    if (drawYAxis) {
      drawYAxisLabels(
        ctx,
        state.view.labels,
        canvas,
        usableHeight,
        yAxisStyle.lineStroke,
        yAxisStyle.labelFill,
      )
    }
  } else if (state.view.chart.type === 'TokenDetailedTvlChart') {
    const style =
      state.view.chart.assetType === 'EBV'
        ? getEBVStyle(canvas, ctx)
        : state.view.chart.assetType === 'CBV'
        ? getCBVStyle(canvas, ctx)
        : getNMVStyle(canvas, ctx)

    const points = state.view.chart.points
    fillBelowChart(ctx, points, canvas, usableHeight, style)
    if (drawYAxis) {
      drawYAxisLabels(
        ctx,
        state.view.labels,
        canvas,
        usableHeight,
        yAxisStyle.lineStroke,
        yAxisStyle.labelFill,
      )
    }
  } else {
    const mainPoints = state.view.chart.points
    fillBelowChart(
      ctx,
      mainPoints,
      canvas,
      usableHeight,
      mainStyle.fillGradient,
    )
    if (drawYAxis) {
      drawYAxisLabels(
        ctx,
        state.view.labels,
        canvas,
        usableHeight,
        yAxisStyle.lineStroke,
        yAxisStyle.labelFill,
      )
    }
    strokeChartLine(
      ctx,
      mainPoints,
      canvas,
      usableHeight,
      mainStyle.strokeGradient,
    )
  }
}

function drawYAxisLabels(
  ctx: CanvasRenderingContext2D,
  labels: string[] | undefined,
  canvas: HTMLCanvasElement,
  usableHeight: number,
  lineStrokeStyle: string,
  labelFillStyle: string,
) {
  ctx.beginPath()

  const lines = [
    [
      { x: 0.0, y: 1.0 },
      { x: 1.0, y: 1.0 },
    ],
    [
      { x: 0.0, y: 0.75 },
      { x: 1.0, y: 0.75 },
    ],
    [
      { x: 0.0, y: 0.5 },
      { x: 1.0, y: 0.5 },
    ],
    [
      { x: 0.0, y: 0.25 },
      { x: 1.0, y: 0.25 },
    ],
    [
      { x: 0.0, y: 0.0 },
      { x: 1.0, y: 0.0 },
    ],
  ]

  lines.forEach((linePoints, i) => {
    moveToMany(linePoints, ctx, canvas, usableHeight)
    labelText(
      linePoints[0],
      ctx,
      canvas,
      usableHeight,
      labels ? labels[i] : '...',
      labelFillStyle,
    )
  })

  ctx.strokeStyle = lineStrokeStyle
  ctx.lineWidth = Math.floor(window.devicePixelRatio)
  ctx.stroke()
}

function getUsableHeight(canvas: HTMLCanvasElement, drawYAxis: boolean) {
  return drawYAxis
    ? canvas.height - 20 * window.devicePixelRatio
    : canvas.height
}

function getYAxisStyle(theme: State['controls']['theme']) {
  const lineStroke =
    theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(51, 51, 51, 0.3)'
  const labelFill =
    theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(115, 115, 115, 0.5)'

  return {
    lineStroke: lineStroke,
    labelFill: labelFill,
  }
}
