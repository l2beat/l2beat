import { initChart } from './chart'
import { darkModeSupport } from './darkModeSupport'

darkModeSupport()

const chart = document.querySelector<HTMLElement>('.chart')
if (chart) {
  initChart(chart)
}
