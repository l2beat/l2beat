import { layer2s } from '@l2beat/config'

import { State } from '../state/State'
import { fillBelowChart } from './fillBelowChart'
import { strokeChartLine } from './strokeChartLine'
import { getMainStyle, getSecondaryStyle } from './style'
export function renderChart(
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
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  console.clear()
  for (let i = 0; i < state.view.chart.points.length; i++) {
    const m = state.view.chart.points[i]
    const tt = layer2s[1].milestones?.find((mil) => {
      // if (
      //   Math.abs(new Date(m.date).getTime() - mil.date.getTime()) === 7200000
      // ) {
      //   console.log(mil.name)
      // }
      return (
        Math.abs(new Date(m.date).getTime() - mil.date.getTime()) === 7200000
      )
    })
    if (tt !== undefined) {
      ctx.beginPath()
      console.log(canvas.height)
      ctx.rect(state.view.chart.points[i].x * canvas.width, canvas.height-10, 10, 10)
      ctx.fillStyle = "#34762F";
      ctx.fill()
      // ctx.rotate(45 * Math.PI / 180)
      ctx.closePath()
      console.log(state.view.chart.points[i])
    }
  }
}
