import type { Logger } from '@l2beat/backend-tools'
import { DataNotReadyError, TargetNotReadyError } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { withFakeTimers } from '../test/withFakeTimers'
import { allOrCancel, waitForPrices, waitForTarget } from './waitForData'

const TIMESTAMP = UnixTime.fromDate(new Date('2026-10-23T12:00:00Z'))

describe(waitForTarget.name, () => {
  it('returns at once when the target is ready', async () => {
    const logger = mockObject<Logger>({ info: mockFn().returns(undefined) })

    const result = await waitForTarget(async () => 123, {
      logger,
      chain: 'ethereum',
      timestamp: TIMESTAMP,
    })

    expect(result).toEqual(123)
    expect(logger.info).not.toHaveBeenCalled()
  })

  it('waits while the tip has not passed the target', async () => {
    const logger = mockObject<Logger>({ info: mockFn().returns(undefined) })
    const resolve = mockFn<() => Promise<number>>()
      .rejectsWithOnce(new TargetNotReadyError(TIMESTAMP, 100, TIMESTAMP - 30))
      .rejectsWithOnce(new TargetNotReadyError(TIMESTAMP, 110, TIMESTAMP - 10))
      .resolvesToOnce(123)

    const result = await withFakeTimers(() =>
      waitForTarget(resolve, {
        logger,
        chain: 'ethereum',
        timestamp: TIMESTAMP,
      }),
    )

    expect(result).toEqual(123)
    expect(resolve).toHaveBeenCalledTimes(3)
    expect(logger.info).toHaveBeenNthCalledWith(
      1,
      'Target not ready, waiting',
      {
        chain: 'ethereum',
        timestamp: TIMESTAMP,
        tipTimestamp: TIMESTAMP - 30,
        lagSeconds: 30,
        attempt: 1,
      },
    )
    expect(logger.info).toHaveBeenNthCalledWith(
      2,
      'Target not ready, waiting',
      {
        chain: 'ethereum',
        timestamp: TIMESTAMP,
        tipTimestamp: TIMESTAMP - 10,
        lagSeconds: 10,
        attempt: 2,
      },
    )
    expect(logger.info).toHaveBeenNthCalledWith(3, 'Target ready after wait', {
      chain: 'ethereum',
      timestamp: TIMESTAMP,
      waitedMs: expect.a(Number),
      attempts: 2,
    })
  })

  it('uses the tip once the chain has stalled for an hour past the target', async () => {
    const logger = mockObject<Logger>({
      info: mockFn().returns(undefined),
      warn: mockFn().returns(undefined),
    })
    const timestamp = UnixTime.now() - UnixTime.HOUR
    const resolve = mockFn<() => Promise<number>>().rejectsWithOnce(
      new TargetNotReadyError(timestamp, 100, timestamp - 30),
    )

    const result = await waitForTarget(resolve, {
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
    const logger = mockObject<Logger>({ info: mockFn().returns(undefined) })

    await expect(
      waitForTarget(() => Promise.reject(new Error('RPC error')), {
        logger,
        chain: 'ethereum',
        timestamp: TIMESTAMP,
      }),
    ).toBeRejectedWith('RPC error')
  })
})

describe(waitForPrices.name, () => {
  it('waits while CoinGecko has not published the hour', async () => {
    const logger = mockObject<Logger>({ info: mockFn().returns(undefined) })
    const fetch = mockFn<() => Promise<number[]>>()
      .rejectsWithOnce(new DataNotReadyError('Not published'))
      .resolvesToOnce([1])

    const result = await withFakeTimers(() =>
      waitForPrices(fetch, { logger, priceId: 'ethereum' }),
    )

    expect(result).toEqual([1])
    expect(logger.info).toHaveBeenOnlyCalledWith(
      'Price not published, waiting',
      { priceId: 'ethereum', attempt: 1 },
    )
  })
})

describe(allOrCancel.name, () => {
  it('stops waiting for the other prices once one fails', async () => {
    const logger = mockObject<Logger>({ info: mockFn().returns(undefined) })
    const unpublished = mockFn<() => Promise<number[]>>().rejectsWith(
      new DataNotReadyError('Not published'),
    )

    const batch = withFakeTimers(() =>
      allOrCancel(['ethereum', 'bitcoin'], (priceId, signal) =>
        priceId === 'ethereum'
          ? waitForPrices(unpublished, { logger, priceId, signal })
          : Promise.reject(new Error('HTTP error')),
      ),
    )

    await expect(batch).toBeRejectedWith('HTTP error')
    expect(unpublished).toHaveBeenCalledTimes(1)
  })
})
