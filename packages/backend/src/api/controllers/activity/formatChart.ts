import {
  ActivityApiChart,
  ActivityApiChartPoint,
  FrontedActivityApiChartPoint,
  FrontendActivityApiChart,
} from '@l2beat/shared-pure'

export function formatChart(data: ActivityApiChartPoint[]): ActivityApiChart {
  return {
    types: ['timestamp', 'daily tx count'],
    data,
  }
}

export function formatFrontendChart(
  data: FrontedActivityApiChartPoint[],
): FrontendActivityApiChart {
  return {
    daily: {
      types: ['timestamp', 'transactions', 'ethereumTransactions'],
      data,
    },
  }
}
