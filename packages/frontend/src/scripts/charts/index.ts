import { makeQuery } from '../query'
import { ChartControls } from './ChartControls'
import { ChartSettingsManager } from './ChartSettings'
import { ChartDataController } from './data-controller/ChartDataController'
import { ChartRenderer } from './renderer/ChartRenderer'
import { ChartViewController } from './view-controller/ChartViewController'

interface Options {
  disableLocalStorage?: boolean
}

export function configureCharts(opts?: Options) {
  const { $$ } = makeQuery(document.body)
  const charts = $$('[data-role="chart"]')

  for (const chart of charts) {
    const chartSettingsManager = new ChartSettingsManager(opts)

    const chartRenderer = new ChartRenderer(chart)
    const chartViewController = new ChartViewController(chart, chartRenderer)
    const chartDataController = new ChartDataController(chartViewController)

    const chartControls = new ChartControls(
      chart,
      chartSettingsManager,
      chartViewController,
      chartDataController,
    )
    chartControls.init()
  }
}
