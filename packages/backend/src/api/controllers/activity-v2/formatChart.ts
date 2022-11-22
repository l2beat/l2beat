import { ActivityApiChart, ActivityApiChartPoint } from '@l2beat/types'

export function formatChart(data: ActivityApiChartPoint[]): ActivityApiChart {
  return {
    types: ['timestamp', 'daily tx count'],
    data,
  }
}
