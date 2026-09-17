import type { Logger } from '@l2beat/backend-tools'
import { describe, expect, it, vi } from 'vitest'
import type { FetchInit } from '../clients/http/fetchWithTimeout'
import {
  UNCATEGORIZED_METRICS_LABEL,
  withRpcMetricsContext,
} from '../clients/rpc/RpcMetricsContext'
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
  it('attributes metrics and limiter waits to the active rpc metrics context', async () => {
    const logger = { info: vi.fn(() => {}) } as unknown as Logger
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
      expect.objectContaining({
        label: 'tvs.amount',
        count: 1,
        durationTotal: 10,
        sizeTotal: 100,
        waitMax: expect.any(Number),
        callsPerMinute: 100_000,
      }),
    )
    expect(logger.info).toHaveBeenCalledWith(
      'Http metrics',
      expect.objectContaining({ label: UNCATEGORIZED_METRICS_LABEL, count: 1 }),
    )
  })
})
