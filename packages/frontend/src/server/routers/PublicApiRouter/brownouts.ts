import { UnixTime } from '@l2beat/shared-pure'
import type { NextFunction, Request, Response } from 'express'
import { getGoneBody } from './goneBody'

export interface BrownoutWindow {
  start: UnixTime
  /** Exclusive */
  end: UnixTime
}

const DAYS = 7
const SHORT_WINDOW_DAYS = 3
const SHORT_WINDOW = 15 * UnixTime.MINUTE
const LONG_WINDOW = UnixTime.HOUR

/**
 * The scheduled test outages of the last week before the sunset: twice a
 * day, 15 minutes on the first three days and an hour on the last four.
 *
 * The two windows of a day are 12 hours apart and move 5 hours from one day
 * to the next, so the 14 windows start at 14 different hours of the day.
 * Fixed slots would never hit a daily job that runs between them.
 */
export function getBrownoutWindows(sunsetAt: UnixTime): BrownoutWindow[] {
  const firstDay = UnixTime.toStartOf(sunsetAt, 'day') - DAYS * UnixTime.DAY
  return Array.from({ length: DAYS }, (_, day) => {
    const length = day < SHORT_WINDOW_DAYS ? SHORT_WINDOW : LONG_WINDOW
    const firstHour = (day * 5) % 12
    return [firstHour, firstHour + 12].map((hour) => {
      const start = firstDay + day * UnixTime.DAY + hour * UnixTime.HOUR
      return { start, end: start + length }
    })
  }).flat()
}

export function findBrownout(
  windows: BrownoutWindow[],
  now: UnixTime,
): BrownoutWindow | undefined {
  return windows.find((window) => window.start <= now && now < window.end)
}

/**
 * Answers 410 during a brownout, so that callers who never read the
 * deprecation headers notice before the API is gone for good.
 */
export function BrownoutMiddleware(options: {
  enabled: boolean
  sunsetAt: UnixTime
  now?: () => UnixTime
}) {
  const windows = options.enabled ? getBrownoutWindows(options.sunsetAt) : []
  const now = options.now ?? UnixTime.now

  return (_req: Request, res: Response, next: NextFunction) => {
    const time = now()
    const brownout = findBrownout(windows, time)
    if (!brownout) {
      next()
      return
    }
    res
      .status(410)
      // A cached 410 would outlive the window
      .header('Cache-Control', 'no-store')
      .header('Retry-After', String(brownout.end - time))
      .json(getGoneBody({ sunsetAt: options.sunsetAt, brownout }))
  }
}
