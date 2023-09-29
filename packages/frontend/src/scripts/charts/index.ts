import { makeQuery } from '../query'
import { ChartControls } from './ChartControls'
import { ChartDataController } from './ChartDataController'
import { ChartSettingsManager } from './ChartSettings'
import { ChartRenderer } from './renderer/ChartRenderer'
import { ChartViewController } from './view-controller/ChartViewController'

export function configureCharts() {
  const { $ } = makeQuery(document.body)
  const chart = $.maybe('[data-role="chart"]')
  const chartView = $.maybe('[data-role="chart-view"]')

  if (!chartView || !chart) {
    return
  }

  const chartSettingsManager = new ChartSettingsManager()

  const chartRenderer = new ChartRenderer(chartView)
  const chartViewController = new ChartViewController(chartRenderer)
  const chartDataController = new ChartDataController(chartViewController)

  const chartControls = new ChartControls(
    chart,
    chartSettingsManager,
    chartViewController,
    chartDataController,
  )
  chartControls.init()
}
