import { Chart } from './chart'

const canvas = document.querySelector('.chart__canvas')
if (canvas && canvas instanceof HTMLCanvasElement) {
  const chart = new Chart(canvas)
  Object.defineProperty(window, 'chart', { value: chart })
}
