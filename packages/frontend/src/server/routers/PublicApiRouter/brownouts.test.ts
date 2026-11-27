import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import express from 'express'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import {
  BrownoutMiddleware,
  findBrownout,
  getBrownoutWindows,
} from './brownouts'

const SUNSET = UnixTime.fromDate(new Date('2026-12-11T00:00:00Z'))
const DAY = UnixTime.DAY
const HOUR = UnixTime.HOUR

// Why: the brownouts exist to be noticed by jobs that run once a day, so
// they must not sit at the same hours every day, and must never start early
// or run past the sunset.
// Method: build the schedule for a fixed sunset and check its shape as a
// whole, so a change to the rotation that breaks a property fails here.
describe(getBrownoutWindows.name, () => {
  const windows = getBrownoutWindows(SUNSET)

  it('has two windows on each of the 7 days before the sunset', () => {
    const perDay = new Map<number, number>()
    for (const { start } of windows) {
      const day = UnixTime.toStartOf(start, 'day')
      perDay.set(day, (perDay.get(day) ?? 0) + 1)
    }

    expect([...perDay.keys()]).toEqual(
      Array.from({ length: 7 }, (_, i) => SUNSET - (7 - i) * DAY),
    )
    expect([...perDay.values()]).toEqual(Array(7).fill(2))
  })

  it('lasts 15 minutes on the first three days and an hour on the last four', () => {
    const lengths = windows.map(({ start, end }) => (end - start) / 60)

    expect(lengths).toEqual([...Array(6).fill(15), ...Array(8).fill(60)])
  })

  it('starts at a different hour of the day every time', () => {
    const hours = windows.map(({ start }) =>
      UnixTime.toDate(start).getUTCHours(),
    )

    expect(new Set(hours).size).toEqual(windows.length)
  })

  it('ends before the sunset, also when the sunset is not at midnight', () => {
    const midday = getBrownoutWindows(SUNSET + 12 * HOUR)

    expect(Math.max(...windows.map((w) => w.end))).toBeLessThanOrEqual(SUNSET)
    expect(Math.max(...midday.map((w) => w.end))).toBeLessThanOrEqual(
      SUNSET + 12 * HOUR,
    )
  })
})

// Method: the first window of the schedule above is 4 December 00:00-00:15.
describe(findBrownout.name, () => {
  const windows = getBrownoutWindows(SUNSET)
  const start = SUNSET - 7 * DAY

  it('finds a window from its first second to its last', () => {
    expect(findBrownout(windows, start)?.end).toEqual(start + 15 * 60)
    expect(findBrownout(windows, start + 15 * 60 - 1)?.end).toEqual(
      start + 15 * 60,
    )
  })

  it('finds nothing just before a window and at its end', () => {
    expect(findBrownout(windows, start - 1)).toEqual(undefined)
    expect(findBrownout(windows, start + 15 * 60)).toEqual(undefined)
  })
})

// Why: a caller hit by a brownout has only this response to learn what is
// going on, and a cached copy of it would extend the outage.
// Method: mount the middleware with a fixed clock in front of a stub route
// and read the real HTTP response.
describe(BrownoutMiddleware.name, () => {
  const inWindow = SUNSET - 7 * DAY + 5 * 60

  it('answers 410 during a window, uncached, saying when it ends and where to go', async () => {
    const response = await fetchAt(inWindow, { enabled: true })

    expect(response.status).toEqual(410)
    expect(response.headers.get('cache-control')).toEqual('no-store')
    expect(response.headers.get('retry-after')).toEqual('600')
    expect(await response.json()).toEqual({
      success: false,
      error:
        'This API is deprecated and stops working for good on 2026-12-11T00:00:00.000Z. This is a scheduled test outage that ends at 2026-12-04T00:15:00.000Z. Move to https://api.ethbeat.org: see https://ethbeat.org/api-migration',
      sunset: '2026-12-11T00:00:00.000Z',
      brownout: { scheduled: true, endsAt: '2026-12-04T00:15:00.000Z' },
      migrationGuide: 'https://ethbeat.org/api-migration',
      newApi: 'https://api.ethbeat.org',
    })
  })

  it('lets requests through outside the windows', async () => {
    const response = await fetchAt(inWindow + HOUR, { enabled: true })

    expect(response.status).toEqual(200)
  })

  it('lets requests through during a window when switched off', async () => {
    const response = await fetchAt(inWindow, { enabled: false })

    expect(response.status).toEqual(200)
  })
})

function fetchAt(now: UnixTime, options: { enabled: boolean }) {
  const router = express.Router()
  router.use(
    BrownoutMiddleware({ ...options, sunsetAt: SUNSET, now: () => now }),
  )
  router.get('/data', (_req, res) => {
    res.json({ ok: true })
  })
  return fetchFromRouter(router, '/data')
}
