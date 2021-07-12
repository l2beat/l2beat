import { initChart } from './chart'

const chart = document.querySelector('.chart')
if (chart) {
  initChart(chart as HTMLElement)
}
