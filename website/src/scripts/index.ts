import { initChart } from './chart'
import { configureDarkMode } from './configureDarkMode'
import { configureTooltips } from './configureTooltips'

configureDarkMode()
configureTooltips()

const chart = document.querySelector<HTMLElement>('.chart')
if (chart) {
  initChart(chart)
}
