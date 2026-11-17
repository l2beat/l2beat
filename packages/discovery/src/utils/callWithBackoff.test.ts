import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect, mockFn } from 'earl'
import {
  BACKOFF_ATTEMPTS_MAX,
  BACKOFF_WAIT_MS_MAX,
  callWithBackoff,
  isPermanentHttpError,
} from './callWithBackoff'

// Methodology: time is faked, so each wait is read as the difference between
// the fake clock readings of two consecutive attempts.
describe(callWithBackoff.name, () => {
  let time: InstalledClock

  beforeEach(() => {
    time = install()
  })

  afterEach(() => {
    time.uninstall()
  })

  it('throws a permanent error after one attempt', async () => {
    const error = httpError(400)
    const call = mockFn().rejectsWith(error)

    const result = callWithBackoff(call, options()).catch((e: unknown) => e)
    await time.runAllAsync()

    expect(await result).toEqual(error)
    expect(call).toHaveBeenCalledTimes(1)
  })

  it('retries a transient error', async () => {
    const call = mockFn()
      .rejectsWithOnce(httpError(503))
      .rejectsWithOnce(httpError(429))
      .rejectsWithOnce(new Error('socket hang up'))
      .resolvesToOnce('done')

    const result = callWithBackoff(call, options())
    await time.runAllAsync()

    expect(await result).toEqual('done')
    expect(call).toHaveBeenCalledTimes(4)
  })

  it('never waits longer than the cap', async () => {
    const attemptedAtMs: number[] = []
    const call = mockFn(async () => {
      attemptedAtMs.push(Date.now())
      throw httpError(503)
    })

    // The largest value Math.random can return gives the longest waits.
    const result = callWithBackoff(call, {
      ...options(),
      random: () => 1 - Number.EPSILON,
    }).catch((e: unknown) => e)
    await time.runAllAsync()
    await result

    expect(attemptedAtMs.length).toEqual(BACKOFF_ATTEMPTS_MAX)
    const waitsMs = waitsBetweenMs(attemptedAtMs)
    expect(Math.max(...waitsMs)).toEqual(BACKOFF_WAIT_MS_MAX - 1)
    const waitMsTotal = waitsMs.reduce((sum, waitMs) => sum + waitMs, 0)
    expect(waitMsTotal <= 6 * 60_000).toEqual(true)
  })

  it('spreads the waits with jitter', async () => {
    const attemptedAtMs: number[] = []
    const call = mockFn(async () => {
      attemptedAtMs.push(Date.now())
      throw httpError(503)
    })

    const result = callWithBackoff(call, {
      ...options(),
      random: () => 0.5,
    }).catch((e: unknown) => e)
    await time.runAllAsync()
    await result

    const waitsMs = waitsBetweenMs(attemptedAtMs)
    expect(waitsMs.slice(0, 5)).toEqual([2_000, 4_000, 8_000, 16_000, 30_000])
  })

  describe(isPermanentHttpError.name, () => {
    it('treats 4xx as permanent, except a timeout and a rate limit', () => {
      expect(isPermanentHttpError(httpError(400))).toEqual(true)
      expect(isPermanentHttpError(httpError(403))).toEqual(true)
      expect(isPermanentHttpError(httpError(408))).toEqual(false)
      expect(isPermanentHttpError(httpError(429))).toEqual(false)
    })

    it('keeps retrying everything it cannot classify', () => {
      expect(isPermanentHttpError(httpError(500))).toEqual(false)
      expect(isPermanentHttpError(new Error('socket hang up'))).toEqual(false)
      expect(isPermanentHttpError(new TypeError('Invalid response'))).toEqual(
        false,
      )
      expect(isPermanentHttpError('Max rate limit reached')).toEqual(false)
    })
  })
})

function waitsBetweenMs(attemptedAtMs: number[]): number[] {
  const waitsMs: number[] = []
  let previousAtMs: number | undefined
  for (const atMs of attemptedAtMs) {
    if (previousAtMs !== undefined) {
      waitsMs.push(atMs - previousAtMs)
    }
    previousAtMs = atMs
  }
  return waitsMs
}

function options() {
  return {
    random: () => 0,
    isPermanentError: isPermanentHttpError,
    retryCallback: () => {},
  }
}

function httpError(status: number) {
  return new Error('HTTP error', { cause: { status } })
}
