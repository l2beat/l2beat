import { ActivityApiChart, ActivityApiChartPoint } from '@l2beat/common'

export function formatChart(data: ActivityApiChartPoint[]): ActivityApiChart {
  return {
    types: ['timestamp', 'daily tx count'],
    data,
  }
}
