import { makeQuery } from '../query'
import { ChartControls, ChartControlsCallbacks } from './ChartControls'
import { ChartSettingsManager } from './ChartSettings'
import { ChartDataController } from './data-controller/ChartDataController'
import { ChartRenderer } from './renderer/ChartRenderer'
import { ChartViewController } from './view-controller/ChartViewController'

interface Options {
  disableLocalStorage?: boolean
  callbacks?: ChartControlsCallbacks
}

export function configureCharts(opts?: Options) {
  const { $$ } = makeQuery(document.body)
  const charts = $$('[data-role="chart"]')

  for (const chart of charts) {
    const chartSettingsManager = new ChartSettingsManager(chart, opts)

    const chartRenderer = new ChartRenderer(chart)
    const chartViewController = new ChartViewController(chart, chartRenderer)
    const chartDataController = new ChartDataController(chartViewController)

    const chartControls = new ChartControls(
      chart,
      chartSettingsManager,
      chartViewController,
      chartDataController,
      opts?.callbacks,
    )
    chartControls.init()
  }
}
