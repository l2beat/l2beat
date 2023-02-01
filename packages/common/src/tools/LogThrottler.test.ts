import { install, InstalledClock } from '@sinonjs/fake-timers'
import { expect } from 'earljs'

import { LoggerOptions, LogLevel } from './Logger'
import { LogThrottler, LogThrottlerOptions } from './LogThrottler'

describe(LogThrottler.name, () => {
  let time: InstalledClock
  const logKey = 'logKey'

  const logThrottlerOptions: LogThrottlerOptions = {
    threshold: 4,
    thresholdTimeInMs: 5000,
    throttleTimeInMs: 10000,
  }
  const loggerOptions: LoggerOptions = {
    logLevel: LogLevel.INFO,
    format: 'pretty',
  }
  let logThrottler: LogThrottler

  beforeEach(() => {
    time = install({})
    logThrottler = new LogThrottler(logThrottlerOptions, loggerOptions)
  })

  afterEach(() => {
    time.uninstall()
  })

  it('should not throttle if logKey was logged less than threshold times', () => {
    for (let i = 0; i < logThrottlerOptions.threshold - 1; i++) {
      logThrottler.add(logKey)
    }

    expect(logThrottler.isThrottling(logKey)).toEqual(false)
  })

  it('should not throttle if logKey was called threshold times in more than thresholdTimeInMs', async () => {
    for (let i = 0; i < logThrottlerOptions.threshold; i++) {
      const timeout =
        (logThrottlerOptions.thresholdTimeInMs + 100) /
        logThrottlerOptions.threshold
      await time.tickAsync(timeout)
      logThrottler.add(logKey)
    }

    expect(logThrottler.isThrottling(logKey)).toEqual(false)
  })

  it('should throttle', async () => {
    for (let i = 0; i < logThrottlerOptions.threshold; i++) {
      logThrottler.add(logKey)
    }

    expect(logThrottler.isThrottling(logKey)).toEqual(true)
    await time.tickAsync(logThrottlerOptions.throttleTimeInMs)
    expect(logThrottler.isThrottling(logKey)).toEqual(false)
  })
})
