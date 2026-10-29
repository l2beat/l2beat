import type { Logger } from '@l2beat/backend-tools'
import { DataNotReadyError, TargetNotReadyError } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { Retries } from '@l2beat/uif'
import { expect, mockFn, mockObject } from 'earl'
import { retryWhileNotReady, useTipIfStalled } from './dataNotReady'

describe(retryWhileNotReady.name, () => {
  it('retries not ready data every minute and other errors with back-off', () => {
    const strategy = retryWhileNotReady(
      Retries.exponentialBackOff({ initialTimeoutMs: 1000, maxAttempts: 3 }),
    )

    strategy.markAttempt(new TargetNotReadyError(UnixTime(0), 1, UnixTime(0)))
    expect(strategy.isWaiting?.()).toEqual(true)
    expect(strategy.timeoutMs()).toEqual(60_000)

    strategy.markAttempt(new DataNotReadyError('Not published'))
    expect(strategy.timeoutMs()).toEqual(60_000)

    strategy.markAttempt(new Error('RPC error'))
    expect(strategy.isWaiting?.()).toEqual(false)
    expect(strategy.timeoutMs()).toEqual(1000)
  })
})

describe(useTipIfStalled.name, () => {
  it('rethrows while the chain has had less than an hour', async () => {
    const logger = mockObject<Logger>({ warn: mockFn().returns(undefined) })
    const timestamp = UnixTime.now() - 10 * UnixTime.MINUTE
    const error = new TargetNotReadyError(timestamp, 100, timestamp - 30)

    await expect(
      useTipIfStalled(() => Promise.reject(error), {
        logger,
        chain: 'ethereum',
        timestamp,
      }),
    ).toBeRejectedWith(TargetNotReadyError)
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it('uses the tip once the chain has stalled for an hour past the target', async () => {
    const logger = mockObject<Logger>({ warn: mockFn().returns(undefined) })
    const timestamp = UnixTime.now() - UnixTime.HOUR
    const error = new TargetNotReadyError(timestamp, 100, timestamp - 30)

    const result = await useTipIfStalled(() => Promise.reject(error), {
      logger,
      chain: 'ethereum',
      timestamp,
    })

    expect(result).toEqual(100)
    expect(logger.warn).toHaveBeenOnlyCalledWith('Chain stalled, using tip', {
      chain: 'ethereum',
      timestamp,
      tip: 100,
      tipTimestamp: timestamp - 30,
    })
  })

  it('rethrows other errors', async () => {
    const logger = mockObject<Logger>({ warn: mockFn().returns(undefined) })

    await expect(
      useTipIfStalled(() => Promise.reject(new Error('RPC error')), {
        logger,
        chain: 'ethereum',
        timestamp: UnixTime.now() - UnixTime.HOUR,
      }),
    ).toBeRejectedWith('RPC error')
  })
})
