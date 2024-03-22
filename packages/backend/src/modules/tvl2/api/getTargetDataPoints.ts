import { UnixTime } from '@l2beat/shared-pure'

import { Clock } from '../../../tools/Clock'

export function getTargetDataPoints(
  token: { sinceTimestamp: UnixTime },
  clock: Clock,
) {
  const start = token.sinceTimestamp.toEndOf('hour')

  const sixHourlyBoundary = clock
    ._TVL_ONLY_getSixHourlyDeletionBoundary()
    .gt(start)
    ? clock._TVL_ONLY_getSixHourlyDeletionBoundary()
    : start

  const hourlyBoundary = clock._TVL_ONLY_getHourlyDeletionBoundary().gt(start)
    ? clock._TVL_ONLY_getHourlyDeletionBoundary()
    : start

  const end = clock.getLastHour()

  const dailyDiff =
    sixHourlyBoundary.toStartOf('day').toNumber() -
    start.toEndOf('day').toNumber()

  const dailyDataPoints = dailyDiff > 0 ? Math.floor(dailyDiff / 86400) + 1 : 0

  const sixHourlyDiff =
    hourlyBoundary.toStartOf('six hours').toNumber() -
    sixHourlyBoundary.toEndOf('six hours').toNumber()

  const sixHourlyDataPoints =
    sixHourlyDiff > 0 ? Math.floor(sixHourlyDiff / 21600) + 1 : 0

  const hourlyDiff = end.toNumber() - hourlyBoundary.toEndOf('hour').toNumber()

  const hourlyDataPoints =
    hourlyDiff > 0 ? Math.floor(hourlyDiff / 3600) + 1 : 0

  return dailyDataPoints + sixHourlyDataPoints + hourlyDataPoints
}
