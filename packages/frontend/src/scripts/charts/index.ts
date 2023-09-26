import { configureCharts as oldConfigureCharts } from '../../components/chart/configure'
import { makeQuery } from '../query'
import { ChartRenderer } from './renderer/ChartRenderer'

const DEV_NEW_CHARTS_ENABLED = false

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
    formatYAxisLabel: (value) => '%%' + value.toFixed(2),
    points: [
      { series: [2, 1], data: undefined },
      { series: [4, 3], data: undefined },
      { series: [3, 2], data: undefined },
    ],
    yAxisScale: 'LIN',
    seriesStyle: [
      { fillStyle: 'purple' },
      { fillStyle: 'pink' },
      // { fillStyle: 'signature gradient', lineStyle: 'signature gradient' },
    ],
    renderTooltip: () => '<div>Tooltip</div>',
  })
}

function getElements() {
  const { $ } = makeQuery(document.body)
  const chartView = $.maybe('[data-role="chart-view"]')

  return { chartView }
}
