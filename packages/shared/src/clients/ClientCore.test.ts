import { type LogEntry, Logger } from '@l2beat/backend-tools'
import type { json } from '@l2beat/shared-pure'
import FakeTimers from '@sinonjs/fake-timers'
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
  // Why: the limiter can only settle on a rate the provider takes if it
  // hears of every refusal, and of nothing else
  it('tells the limiter, which steps its rate down when asked to', async () => {
    const { clientCore, http } = mocks(1_000, 0.1)
    http.fetch.rejectsWithOnce(
      new Error('HTTP error: 429 Too Many Requests', {
        cause: { status: 429 },
      }),
    )

    await clientCore.fetch('https://api.test.com/data', {})

    expect(clientCore.rateLimiter.effectiveCallsPerMinute).toEqual(900)
  })

  // Why: the rate alone cannot tell a limit that was found from a rate
  // that never moved, and metrics skip a client that went quiet. The log
  // is collected through a real logger's transport.
  it('logs each step the rate takes', async () => {
    const logged: LogEntry[] = []
    const logger = new Logger({
      level: 'WARN',
      transports: [{ log: (entry) => logged.push(entry), flush: () => {} }],
    })
    const { clientCore, http } = mocks(1_000, 0.1, logger)
    http.fetch.rejectsWithOnce(
      new Error('HTTP error', { cause: { status: 429 } }),
    )

    await clientCore.fetch('https://api.test.com/data', {})

    const steps = logged.filter((e) => e.message === 'Rate stepped down')
    expect(steps.map((e) => e.parameters)).toEqual([
      expect.subset({ from: 1_000, to: 900, atFloor: false }),
    ])
  })

  // Why: the limiter holds its rate until the provider answers a call sent
  // after the last step, and only the client knows a call was answered.
  // Each fetch here is refused once and answered on its retry, a minute
  // apart on a fake clock: the first retry is what lets the second
  // refusal count.
  it('tells the limiter of an answered call, so a later refusal counts', async () => {
    const clock = FakeTimers.install({ now: 10_000 })
    const { clientCore, http } = mocks(1_000, 0.1)
    const refusedThenAnswered = async () => {
      http.fetch.rejectsWithOnce(
        new Error('HTTP error', { cause: { status: 429 } }),
      )
      const fetched = clientCore.fetch('https://api.test.com/data', {})
      await clock.tickAsync(1_000)
      await fetched
    }

    try {
      await refusedThenAnswered()
      expect(clientCore.rateLimiter.effectiveCallsPerMinute).toEqual(900)

      await clock.tickAsync(60_000)
      await refusedThenAnswered()
      expect(clientCore.rateLimiter.effectiveCallsPerMinute).toEqual(810)
    } finally {
      clock.uninstall()
    }
  })

  // Why: some providers sit behind a CloudFront rule that answers 403, not
  // 429, once an address calls too fast (xlayer, dbk). A 403 elsewhere is
  // usually a block that no rate lifts, so it counts only where configured.
  it('takes a 403 as a refusal for the rate only from a provider configured so', async () => {
    const forbidden = () =>
      new Error('HTTP error: 403 Forbidden', { cause: { status: 403 } })
    const flagged = mocks(1_000, 0.1, Logger.SILENT, true)
    const unflagged = mocks(1_000, 0.1)
    flagged.http.fetch.rejectsWithOnce(forbidden())
    unflagged.http.fetch.rejectsWithOnce(forbidden())

    await flagged.clientCore.fetch('https://api.test.com/data', {})
    await unflagged.clientCore.fetch('https://api.test.com/data', {})

    expect(flagged.clientCore.rateLimiter.effectiveCallsPerMinute).toEqual(900)
    expect(unflagged.clientCore.rateLimiter.effectiveCallsPerMinute).toEqual(
      1_000,
    )
  })

  it('leaves the limiter alone on any other failure', async () => {
    const { clientCore, http } = mocks(1_000, 0.1)
    http.fetch.rejectsWithOnce(
      new Error('HTTP error: 503 Service Unavailable', {
        cause: { status: 503 },
      }),
    )

    await clientCore.fetch('https://api.test.com/data', {})

    expect(clientCore.rateLimiter.effectiveCallsPerMinute).toEqual(1_000)
  })
})

function mocks(
  callsPerMinute?: number,
  stepDownOnThrottle?: number,
  logger: Logger = Logger.SILENT,
  refusesRateWith403?: boolean,
) {
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
    refusesRateWith403,
    retryStrategy: 'TEST',
    logger,
    sourceName: 'test',
  })

  return {
    clientCore,
    http,
  }
}
