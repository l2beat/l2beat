import type { ActivityChartData } from '../scaling/activity/getActivityChart'
import type { TvsChartData } from '../scaling/tvs/getTvsChartData'

export function isTvsChartDataEmpty(data: TvsChartData['chart']) {
  return data.every(
    ([_, native, canonical, external]) =>
      native === null && canonical === null && external === null,
  )
}

export function isActivityChartDataEmpty(data: ActivityChartData) {
  return data.data.every(([_, count]) => count === 0)
}
