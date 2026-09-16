import { Logger } from '@l2beat/backend-tools'
import { describe, expect, it, vi } from 'vitest'
import { RetryHandler } from './RetryHandler'

describe(RetryHandler.name, () => {
  it('retries until function succeeds', async () => {
    const retryHandler = mockHandler({ maxRetries: 5 })

    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error())
      .mockRejectedValueOnce(new Error())
      .mockRejectedValueOnce(new Error())
      .mockResolvedValueOnce('success')

    await retryHandler.retry(() => fn())

    expect(fn).toHaveBeenCalledTimes(4)
  })

  it('retries until maxRetries is reached', async () => {
    const retryHandler = mockHandler({ maxRetries: 2 })

    const fn = vi.fn().mockRejectedValue(new Error())

    await expect(() => retryHandler.retry(() => fn())).rejects.toThrow()

    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('schedules delay no longer than maxRetryDelay', async () => {
    const retryHandler = mockHandler({
      initialRetryDelayMs: 10_000,
      maxRetryDelayMs: 1, // without this line test would timeout
    })

    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error())
      .mockResolvedValueOnce('success')

    await expect(retryHandler.retry(() => fn())).resolves.not.toThrow()
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
