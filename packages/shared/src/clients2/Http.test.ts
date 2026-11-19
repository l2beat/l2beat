import type { Logger } from '@l2beat/backend-tools'
import { expect, mockObject } from 'earl'
import type { FetchInit } from '../clients/http/fetchWithTimeout'
import {
  UNCATEGORIZED_METRICS_LABEL,
  withRpcMetricsContext,
} from '../clients/rpc/RpcMetricsContext'
import { withServer } from '../test/withServer'
import { Http, type HttpResponse, makeHttpResponse } from './Http'

// Replaces the network call; keeps the rate limiter and metrics paths intact.
class StubHttp extends Http {
  protected override async _fetch(
    _url: string,
    _init: FetchInit,
    label: string,
  ): Promise<HttpResponse> {
    this._trackMetrics(label, 10, 100)
    return makeHttpResponse(200, '{}')
  }
}

describe(Http.name, () => {
  // Why: this client hands a 429 back to its caller instead of throwing,
  // so nothing upstream would tell the limiter to wait
  it('holds the next call back for as long as a refusal asks', async () => {
    const http = new Http({ maxCallsPerMinute: 100_000 })
    let calls = 0

    await withServer(
      (_, res) =>
        ++calls === 1
          ? res.writeHead(429, { 'Retry-After': '0.05' }).end()
          : res.end('{}'),
      async (url) => {
        const refused = await http.fetch(url, { method: 'POST' })
        const refusedAt = Date.now()
        await http.fetch(url, { method: 'POST' })

        expect(refused.status).toEqual(429)
        expect(Date.now() - refusedAt).toBeGreaterThanOrEqual(45)
      },
    )
  })

  it('attributes metrics and limiter waits to the active rpc metrics context', async () => {
    const logger = mockObject<Logger>({ info: () => {} })
    const http = new StubHttp({
      logger,
      metricsEnabled: true,
      metricsFlushIntervalMs: 10,
      maxCallsPerMinute: 100_000,
    })

    await withRpcMetricsContext({ coreFeature: 'tvs.amount' }, () =>
      http.fetch('https://rpc.url', { method: 'POST' }),
    )
    await http.fetch('https://rpc.url', { method: 'POST' })
    // let the unref'd flush interval fire
    await new Promise((resolve) => setTimeout(resolve, 40))

    expect(logger.info).toHaveBeenCalledWith(
      'Http metrics',
      expect.subset({
        label: 'tvs.amount',
        count: 1,
        durationTotal: 10,
        sizeTotal: 100,
        waitMax: expect.a(Number),
        callsPerMinute: 100_000,
      }),
    )
    expect(logger.info).toHaveBeenCalledWith(
      'Http metrics',
      expect.subset({ label: UNCATEGORIZED_METRICS_LABEL, count: 1 }),
    )
  })
})
