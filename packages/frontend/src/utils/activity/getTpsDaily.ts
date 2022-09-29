import { ActivityApiChartPoint } from '@l2beat/types'


export function getTpsDaily(data: ActivityApiChartPoint[] | undefined): string {
  if (data === undefined) {
    return ''
  }

const SECONDS_IN_A_DAY = 24 * 60 * 60

return ((data.at(-1)?.[1] ?? 0) / SECONDS_IN_A_DAY).toFixed(2)

}
