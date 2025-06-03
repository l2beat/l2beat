import type { ActivityChartData } from '../scaling/activity/getActivityChart'
import type { TvsChartData } from '../scaling/tvs/getTvsChartData'

export function isTvsChartDataEmpty(data: TvsChartData) {
  return data.every(
    ([_, native, canonical, external]) =>
      native === 0 && canonical === 0 && external === 0,
  )
}

export function isActivityChartDataEmpty(data: ActivityChartData) {
  return data.data.every(([_, count]) => count === 0)
}
