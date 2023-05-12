import { install, InstalledClock } from '@sinonjs/fake-timers'
import { expect, mockFn } from 'earl'

import { Logger } from './Logger'
import { LogThrottler, LogThrottlerOptions } from './LogThrottler'

describe(LogThrottler.name, () => {
  let time: InstalledClock
  const logKey = 'logKey'

  const logThrottlerOptions: LogThrottlerOptions = {
    threshold: 4,
    thresholdTimeInMs: 5000,
    throttleTimeInMs: 10000,
  }
  let logThrottler: LogThrottler
  let logger: Logger & {
    info: ReturnType<typeof mockFn>
  }

  beforeEach(() => {
    time = install({})
    logger = mockLogger()
    logThrottler = new LogThrottler(logThrottlerOptions, logger)
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

  it('should throttle and log info about throttling after throttleTime', async () => {
    const throttleLogCalls = 2
    for (let i = 0; i < logThrottlerOptions.threshold + throttleLogCalls; i++) {
      logThrottler.add(logKey)
    }

    expect(logThrottler.isThrottling(logKey)).toEqual(true)
    await time.tickAsync(logThrottlerOptions.throttleTimeInMs)
    expect(logThrottler.isThrottling(logKey)).toEqual(false)
    expect(logger.info).toHaveBeenOnlyCalledWith(
      `"${logKey}" was logged ${throttleLogCalls} times during last ${
        logThrottlerOptions.throttleTimeInMs / 1000
      } seconds`,
    )
  })

  it('should throttle and do not log if throttleCount equals 0', async () => {
    for (let i = 0; i < logThrottlerOptions.threshold; i++) {
      logThrottler.add(logKey)
    }

    expect(logThrottler.isThrottling(logKey)).toEqual(true)
    await time.tickAsync(logThrottlerOptions.throttleTimeInMs)
    expect(logThrottler.isThrottling(logKey)).toEqual(false)
    expect(logger.info).not.toHaveBeenCalled()
  })
})

function mockLogger(): Logger & {
  info: ReturnType<typeof mockFn>
  error: ReturnType<typeof mockFn>
} {
  const logger = Object.create(Logger.SILENT)
  logger.info = mockFn(() => {})
  return logger
}
