import { ChartType } from './types'

export function getChartType(chart: HTMLElement) {
  return ChartType.parse(JSON.parse(chart.dataset.initialType ?? ''))
}
