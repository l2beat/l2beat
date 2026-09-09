import type { ActivityChartData } from '../layer2s/activity/getActivityChart'
import type { DetailedTvsChartData } from '../layer2s/tvs/getDetailedTvsChart'
import type { TvsChartData } from '../layer2s/tvs/getTvsChartData'

export function isTvsChartDataEmpty(data: TvsChartData['chart']) {
  return data.every(
    ([_, native, canonical, external]) =>
      native === null && canonical === null && external === null,
  )
}

export function isDetailedTvsChartDataEmpty(
  data: DetailedTvsChartData['chart'],
) {
  return data.every(
    ([_, __, native, canonical, external, ether, stablecoin, btc, other]) =>
      native === null &&
      canonical === null &&
      external === null &&
      ether === null &&
      stablecoin === null &&
      btc === null &&
      other === null,
  )
}

export function isActivityChartDataEmpty(data: ActivityChartData) {
  return data.data.every(([_, count]) => count === 0)
}
