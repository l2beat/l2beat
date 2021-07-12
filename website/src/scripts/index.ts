import { initChart } from './state/chart'

const chart = document.querySelector('.chart')
if (chart) {
  initChart(chart as HTMLElement)
}
