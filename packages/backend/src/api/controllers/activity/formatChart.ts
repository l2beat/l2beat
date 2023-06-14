import { ActivityApiChart, ActivityApiChartPoint } from '@l2beat/shared-pure'

export function formatChart(data: ActivityApiChartPoint[]): ActivityApiChart {
  return {
    types: ['timestamp', 'daily tx count'],
    data,
  }
}
