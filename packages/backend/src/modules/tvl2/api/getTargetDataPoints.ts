import { UnixTime } from '@l2beat/shared-pure'

import { Clock } from '../../../tools/Clock'

export function getTargetDataPoints(
  token: { sinceTimestamp: UnixTime },
  clock: Clock,
) {
  const start = token.sinceTimestamp.toEndOf('hour')
  const sixHourlyBoundary = clock._TVL_ONLY_getSixHourlyDeletionBoundary()
  const hourlyBoundary = clock._TVL_ONLY_getHourlyDeletionBoundary()
  const end = clock.getLastHour()

  let dataPoints = 0

  const hourlyDiff =
    end.toNumber() - Math.max(hourlyBoundary.toNumber(), start.toNumber())
  dataPoints += hourlyDiff > 0 ? Math.floor(hourlyDiff / 3600) + 1 : 0

  const sixHourlyDiff =
    hourlyBoundary.toStartOf('six hours').toNumber() -
    Math.max(
      sixHourlyBoundary.toEndOf('six hours').toNumber(),
      start.toNumber(),
    )
  dataPoints += sixHourlyDiff > 0 ? Math.floor(sixHourlyDiff / 21600) + 1 : 0

  const dailyDiff =
    sixHourlyBoundary.toStartOf('day').toNumber() -
    start.toEndOf('day').toNumber()
  dataPoints += dailyDiff > 0 ? Math.floor(dailyDiff / 86400) + 1 : 0

  return dataPoints
}
