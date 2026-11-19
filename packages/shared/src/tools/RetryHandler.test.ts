import { Logger } from '@l2beat/backend-tools'
import { expect, mockFn } from 'earl'
import { RetryHandler } from './RetryHandler'

describe(RetryHandler.name, () => {
  it('retries until function succeeds', async () => {
    const retryHandler = mockHandler({ maxRetries: 5 })

    const fn = mockFn()
      .rejectsWithOnce(new Error())
      .rejectsWithOnce(new Error())
      .rejectsWithOnce(new Error())
      .resolvesToOnce('success')

    await retryHandler.retry(() => fn())

    expect(fn).toHaveBeenCalledTimes(4)
  })

  it('retries until maxRetries is reached', async () => {
    const retryHandler = mockHandler({ maxRetries: 2 })

    const fn = mockFn().rejectsWith(new Error())

    await expect(() => retryHandler.retry(() => fn())).toBeRejected()

    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('schedules delay no longer than maxRetryDelay', async () => {
    const retryHandler = mockHandler({
      initialRetryDelayMs: 10_000,
      maxRetryDelayMs: 1, // without this line test would timeout
    })

    const fn = mockFn().rejectsWithOnce(new Error()).resolvesToOnce('success')

    await expect(() => retryHandler.retry(() => fn())).not.toBeRejected()
  })
})

function mockHandler(deps: {
  maxRetries?: number
  initialRetryDelayMs?: number
  maxRetryDelayMs?: number
}) {
  return new RetryHandler({
    maxRetries: deps.maxRetries ?? 10,
    initialRetryDelayMs: deps.initialRetryDelayMs ?? 1,
    maxRetryDelayMs: deps.maxRetryDelayMs ?? Number.POSITIVE_INFINITY,
    logger: Logger.SILENT,
  })
}
