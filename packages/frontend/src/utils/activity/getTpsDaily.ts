import { ActivityApiChartPoint } from '@l2beat/types'

export function getTpsDaily(
  data: ActivityApiChartPoint[] | undefined,
): number | undefined {
  if (data === undefined) {
    return undefined
  }

  const SECONDS_IN_A_DAY = 24 * 60 * 60

  return Math.round(((data.at(-1)?.[1] ?? 0) / SECONDS_IN_A_DAY) * 100) / 100
}
