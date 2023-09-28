import { configureCharts as oldConfigureCharts } from '../../components/chart/configure'
import { makeQuery } from '../query'
import { ChartControls } from './ChartControls'
import { ChartRenderer } from './renderer/ChartRenderer'
import { ChartViewController } from './view-controller/ChartViewController'

const DEV_NEW_CHARTS_ENABLED = true

export function configureCharts() {
  // eslint-disable-next-line
  if (!DEV_NEW_CHARTS_ENABLED) {
    oldConfigureCharts()
    return
  }

  const { $ } = makeQuery(document.body)
  const chart = $.maybe('[data-role="chart"]')
  const chartView = $.maybe('[data-role="chart-view"]')

  if (!chartView || !chart) {
    return
  }

  const chartRenderer = new ChartRenderer(chartView)
  const chartViewController = new ChartViewController(chartRenderer)
  new ChartControls(chart, chartViewController)
}
