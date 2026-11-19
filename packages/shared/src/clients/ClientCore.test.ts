import { Logger } from '@l2beat/backend-tools'
import type { json } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { ClientCore } from './ClientCore'
import type { HttpClient } from './http/HttpClient'
import {
  UNCATEGORIZED_METRICS_LABEL,
  withRpcMetricsContext,
} from './rpc/RpcMetricsContext'

describe(ClientCore.name, () => {
  describe(ClientCore.prototype.fetch.name, () => {
    it('Fetches URL with params and returns response', async () => {
      const { clientCore, http } = mocks()

      const response = await clientCore.fetch('https://api.test.com/data', {
        timeout: 1,
      })

      expect(response).toEqual({ result: 'success' })
      expect(http.fetch).toHaveBeenOnlyCalledWith('https://api.test.com/data', {
        timeout: 1,
      })
    })

    it('Retries on error', async () => {
      const { clientCore, http } = mocks()
      http.fetch.rejectsWithOnce(new Error('Network error'))

      await clientCore.fetch('https://api.test.com/data', {})

      expect(http.fetch).toHaveBeenCalledTimes(2)
    })

    it('Throws on invalid response', async () => {
      const { clientCore, http } = mocks()
      http.fetch.resolvesTo(null)

      await expect(
        async () => await clientCore.fetch('https://api.test.com/data', {}),
      ).toBeRejected()
    })

    it('Labels metrics with the rpc metrics context core feature', async () => {
      const { clientCore } = mocks()

      await withRpcMetricsContext({ coreFeature: 'blockSync.fetch' }, () =>
        clientCore.fetch('https://api.test.com/data', {}),
      )
      await clientCore.fetch('https://api.test.com/data', {})

      expect(clientCore.metricsAggregator.buffer.map((m) => m.label)).toEqual([
        'blockSync.fetch',
        UNCATEGORIZED_METRICS_LABEL,
      ])
      const stats = clientCore.rateLimiter.takeStats()
      expect(Object.keys(stats.labels).sort()).toEqual([
        'blockSync.fetch',
        UNCATEGORIZED_METRICS_LABEL,
      ])
      expect(stats.labels['blockSync.fetch']?.dispatched).toEqual(1)
    })

    it('Keeps the label across retries', async () => {
      const { clientCore, http } = mocks()
      http.fetch.rejectsWithOnce(new Error('Network error'))

      await withRpcMetricsContext({ coreFeature: 'blockSync.fetch' }, () =>
        clientCore.fetch('https://api.test.com/data', {}),
      )

      expect(
        clientCore.rateLimiter.takeStats().labels['blockSync.fetch']
          ?.dispatched,
      ).toEqual(2)
    })
  })
})

describe(`${ClientCore.name} when the provider refuses a call`, () => {
  // Why: a refusal for the rate concerns every call of the client, so the
  // limiter has to hear of it: to wait out the provider's Retry-After, to
  // count it, and to lower its rate when asked to
  it('tells the limiter, with the wait the provider asked for', async () => {
    const { clientCore, http } = mocks(1_000, 0.1)
    http.fetch.rejectsWithOnce(
      new Error('HTTP error: 429 Too Many Requests', {
        cause: { status: 429, rateLimit: { 'retry-after': '0.02' } },
      }),
    )
    const startedAt = Date.now()

    await withRpcMetricsContext({ coreFeature: 'blockSync.fetch' }, () =>
      clientCore.fetch('https://api.test.com/data', {}),
    )

    // The retry waited for the 20 ms the provider asked for
    expect(Date.now() - startedAt).toBeGreaterThanOrEqual(20)
    const stats = clientCore.rateLimiter.takeStats()
    expect(stats.labels['blockSync.fetch']?.throttled).toEqual(1)
    expect(stats.effectiveCallsPerMinute).toEqual(900)
  })

  it('leaves the limiter alone on any other failure', async () => {
    const { clientCore, http } = mocks(1_000, 0.1)
    http.fetch.rejectsWithOnce(
      new Error('HTTP error: 503 Service Unavailable', {
        cause: { status: 503 },
      }),
    )

    await clientCore.fetch('https://api.test.com/data', {})

    const stats = clientCore.rateLimiter.takeStats()
    expect(
      Object.values(stats.labels).map((label) => label.throttled),
    ).toEqual([0])
    expect(stats.effectiveCallsPerMinute).toEqual(1_000)
  })
})

function mocks(callsPerMinute?: number, stepDownOnThrottle?: number) {
  const http = mockObject<HttpClient>({
    fetch: async () => ({ result: 'success' }) as json,
  })

  class TestClientCore extends ClientCore {
    validateResponse(response: unknown): {
      success: boolean
      message?: string
    } {
      return { success: !!response }
    }
  }

  const clientCore = new TestClientCore({
    http,
    callsPerMinute: callsPerMinute ?? 100_000,
    stepDownOnThrottle,
    retryStrategy: 'TEST',
    logger: Logger.SILENT,
    sourceName: 'test',
  })

  return {
    clientCore,
    http,
  }
}
