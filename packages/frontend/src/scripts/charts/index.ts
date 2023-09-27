import { configureCharts as oldConfigureCharts } from '../../components/chart/configure'
import { makeQuery } from '../query'
import { ChartRenderer } from './renderer/ChartRenderer'

const DEV_NEW_CHARTS_ENABLED = true

export function configureCharts() {
  // eslint-disable-next-line
  if (!DEV_NEW_CHARTS_ENABLED) {
    oldConfigureCharts()
    return
  }

  const { chartView } = getElements()
  if (!chartView) {
    return
  }

  const chartRenderer = new ChartRenderer(chartView)

  chartRenderer.render({
    formatYAxisLabel: (value) => '$' + value.toFixed(2),
    points: [
      { series: [2, 1], data: 1 },
      { series: [4, 3], data: 2 },
      { series: [4, 3], data: 3 },
      { series: [3, 2], data: 4 },
      { series: [4, 3], data: 5 },
      { series: [3, 2], data: 6 },
      { series: [2, 1], data: 7 },
      {
        series: [4, 3],
        data: 8,
        milestone: {
          name: 'Milestone',
          description: 'This is a milestone',
          link: 'https://www.google.com',
          date: '2021-01-01',
        },
      },
      { series: [4, 3], data: 9 },
      { series: [2, 1], data: 10 },
      { series: [4, 3], data: 11 },
      { series: [4, 3], data: 12 },
      { series: [3, 2], data: 13 },
    ],
    yAxisScale: 'LIN',
    seriesStyle: [
      { fill: 'purple', point: 'blueSquare' },
      { fill: 'pink', point: 'circle' },
    ],
    renderHoverContents: (point) => `<div>Tooltip is awesome: ${point}!</div>`,
  })
}

function getElements() {
  const { $ } = makeQuery(document.body)
  const chartView = $.maybe('[data-role="chart-view"]')

  return { chartView }
}
