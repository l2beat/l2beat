import { ActivityApiChartPoint, ActivityApiCharts } from '@l2beat/shared-pure'

export function formatActivityChart(
  dailyData: ActivityApiChartPoint[],
): ActivityApiCharts {
  return {
    daily: {
      types: ['timestamp', 'transactions', 'ethereumTransactions'],
      data: dailyData,
    },
  }
}
