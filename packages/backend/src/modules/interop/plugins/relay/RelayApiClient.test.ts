import { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import { expect, mockFn, mockObject } from 'earl'
import { RelayApiClient } from './RelayApiClient'

describe(RelayApiClient.name, () => {
  it('rejects a non-positive rate limit', () => {
    const httpClient = mockObject<HttpClient>({ fetchRaw: mockFn() })

    expect(
      () =>
        new RelayApiClient(httpClient, Logger.SILENT, 'api-key', {
          callsPerMinute: 0,
        }),
    ).toThrow('Relay callsPerMinute must be a positive integer')
  })

  describe(RelayApiClient.prototype.getRequests.name, () => {
    it('calls v3 with an API key and normalizes the indexed fields', async () => {
      const httpClient = mockObject<HttpClient>({
        fetchRaw: mockFn().resolvesTo(
          ok(
            page(
              [
                request('a', {
                  inTxs: [
                    {
                      txHash: txHash('1'),
                      chainId: 1,
                      timestamp: 100,
                    },
                  ],
                  outTxs: [
                    {
                      txHash: txHash('2'),
                      chainId: 10,
                      timestamp: 200,
                    },
                  ],
                  route: {
                    quoted: {
                      origin: {
                        inputCurrency: amount('quoted-in', '0xquoted'),
                      },
                      destination: {
                        outputCurrency: amount('quoted-out', '0xquoted'),
                      },
                    },
                    actual: {
                      origin: {
                        inputCurrency: amount('actual-in', '0xsource'),
                      },
                      destination: {
                        outputCurrency: amount('actual-out', '0xdestination'),
                      },
                    },
                  },
                }),
              ],
              undefined,
            ),
          ),
        ),
      })
      const client = createClient(httpClient)

      const result = await client.getRequests({
        startTimestamp: 100,
        endTimestamp: 200,
      })

      expect(result.requests[0]).toEqual({
        id: 'a',
        status: 'success',
        sourceTx: { hash: txHash('1'), chainId: 1, timestamp: 100 },
        destinationTx: { hash: txHash('2'), chainId: 10, timestamp: 200 },
        sourceCurrency: amount('actual-in', '0xsource'),
        destinationCurrency: amount('actual-out', '0xdestination'),
        createdAt: '2026-08-24T15:03:00.000Z',
        updatedAt: '2026-08-24T15:03:00.000Z',
      })

      const [url, init] = httpClient.fetchRaw.calls[0]?.args ?? []
      expect(url as string).toInclude('/requests/v3?')
      expect(url as string).toInclude('startTimestamp=100')
      expect(url as string).toInclude('endTimestamp=200')
      expect(init).toEqual({ headers: { 'x-api-key': 'api-key' } })
    })

    it('falls back to the quoted route when actual data is missing', async () => {
      const quotedInput = amount('quoted-in', '0xsource')
      const quotedOutput = amount('quoted-out', '0xdestination')
      const httpClient = mockObject<HttpClient>({
        fetchRaw: mockFn().resolvesTo(
          ok(
            page(
              [
                request('a', {
                  route: {
                    actual: null,
                    quoted: {
                      origin: { inputCurrency: quotedInput },
                      destination: { outputCurrency: quotedOutput },
                    },
                  },
                }),
              ],
              undefined,
            ),
          ),
        ),
      })

      const result = await createClient(httpClient).getRequests()

      expect(result.requests[0]?.sourceCurrency).toEqual(quotedInput)
      expect(result.requests[0]?.destinationCurrency).toEqual(quotedOutput)
    })

    it('keeps incomplete actual data and warns instead of merging the quote', async () => {
      const warn = mockFn().returns(undefined)
      const logger = mockObject<Logger>({
        for: mockFn().returns(mockObject<Logger>({ warn })),
      })
      const httpClient = mockObject<HttpClient>({
        fetchRaw: mockFn().resolvesTo(
          ok(
            page(
              [
                request('a', {
                  route: {
                    quoted: {
                      origin: {
                        inputCurrency: amount('quoted-in', '0xquoted'),
                      },
                    },
                    actual: {
                      origin: {
                        inputCurrency: { currency: { address: '0xsource' } },
                      },
                    },
                  },
                }),
              ],
              undefined,
            ),
          ),
        ),
      })

      const result = await createClient(httpClient, logger).getRequests()

      expect(result.requests[0]?.sourceCurrency?.amount).toEqual(undefined)
      expect(result.requests[0]?.sourceCurrency?.currency?.address).toEqual(
        '0xsource',
      )
      expect(warn).toHaveBeenOnlyCalledWith('Incomplete actual route data', {
        requests: 1,
        missingAmount: 1,
        missingAddress: 0,
        sampleIds: ['a'],
      })
    })

    it('accepts an explicitly null status', async () => {
      const httpClient = mockObject<HttpClient>({
        fetchRaw: mockFn().resolvesTo(
          ok(page([{ ...request('a'), status: null }], undefined)),
        ),
      })

      const result = await createClient(httpClient).getRequests()

      expect(result.requests[0]?.status).toEqual(undefined)
    })
  })

  describe(RelayApiClient.prototype.getAllRequests.name, () => {
    it('paginates until the response is complete', async () => {
      const httpClient = mockObject<HttpClient>({
        fetchRaw: mockFn()
          .resolvesToOnce(ok(page([request('a')], 'cursor-1')))
          .resolvesToOnce(ok(page([request('b')], undefined))),
      })
      const client = createClient(httpClient)

      const result = await client.getAllRequests({ limit: 500 })

      expect(result.requests.map((r) => r.id)).toEqual(['a', 'b'])
      expect(result.continuation).toEqual(undefined)
    })

    it('reports the cursor when the request limit is reached', async () => {
      const httpClient = mockObject<HttpClient>({
        fetchRaw: mockFn().resolvesTo(ok(page([request('a')], 'cursor-1'))),
      })
      const client = createClient(httpClient)

      const result = await client.getAllRequests({ limit: 1 })

      expect(result.requests.map((r) => r.id)).toEqual(['a'])
      expect(result.continuation).toEqual('cursor-1')
    })

    it('always sorts by updatedAt ascending', async () => {
      const httpClient = mockObject<HttpClient>({
        fetchRaw: mockFn().resolvesTo(ok(page([request('a')], undefined))),
      })
      const client = createClient(httpClient)

      await client.getAllRequests({ limit: 500 })

      const url = httpClient.fetchRaw.calls[0]?.args[0] as string
      expect(url).toInclude('sortBy=updatedAt')
      expect(url).toInclude('sortDirection=asc')
    })

    it('retries a rate-limited page at the same cursor', async () => {
      const httpClient = mockObject<HttpClient>({
        fetchRaw: mockFn()
          .resolvesToOnce(ok(page([request('a')], 'cursor-1')))
          .resolvesToOnce(httpError(429, 'Too Many Requests'))
          .resolvesToOnce(ok(page([request('b')], undefined))),
      })
      const client = createClient(httpClient)

      const result = await client.getAllRequests({ limit: 500 })

      expect(result.requests.map((r) => r.id)).toEqual(['a', 'b'])
      expect(httpClient.fetchRaw).toHaveBeenCalledTimes(3)
      const failedUrl = httpClient.fetchRaw.calls[1]?.args[0] as string
      const retriedUrl = httpClient.fetchRaw.calls[2]?.args[0] as string
      expect(failedUrl).toEqual(retriedUrl)
      expect(retriedUrl).toInclude('continuation=cursor-1')
    })

    it('throws a permanent later-page failure instead of returning a partial window', async () => {
      const httpClient = mockObject<HttpClient>({
        fetchRaw: mockFn()
          .resolvesToOnce(ok(page([request('a')], 'cursor-1')))
          .resolvesToOnce(httpError(401, 'Unauthorized')),
      })
      const client = createClient(httpClient)

      await expect(client.getAllRequests({ limit: 500 })).toBeRejectedWith(
        'Relay API error: 401 Unauthorized',
      )
      expect(httpClient.fetchRaw).toHaveBeenCalledTimes(2)
    })

    it('throws an exhausted transient later-page failure instead of returning a partial window', async () => {
      const httpClient = mockObject<HttpClient>({
        fetchRaw: mockFn()
          .resolvesToOnce(ok(page([request('a')], 'cursor-1')))
          .rejectsWith(new Error('network timeout')),
      })
      const client = createClient(httpClient)

      await expect(client.getAllRequests({ limit: 500 })).toBeRejectedWith(
        'network timeout',
      )
      expect(httpClient.fetchRaw).toHaveBeenCalledTimes(5)
    })

    it('rejects an unchanged continuation cursor', async () => {
      const httpClient = mockObject<HttpClient>({
        fetchRaw: mockFn().resolvesTo(ok(page([request('a')], 'cursor-1'))),
      })
      const client = createClient(httpClient)

      await expect(
        client.getAllRequests({ limit: 500, continuation: 'cursor-1' }),
      ).toBeRejectedWith('unchanged continuation cursor')
      expect(httpClient.fetchRaw).toHaveBeenCalledTimes(1)
    })

    it('rejects an invalid request limit before calling the API', async () => {
      const httpClient = mockObject<HttpClient>({ fetchRaw: mockFn() })
      const client = createClient(httpClient)

      await expect(client.getAllRequests({ limit: 0 })).toBeRejectedWith(
        'limit must be a positive integer',
      )
      expect(httpClient.fetchRaw).toHaveBeenCalledTimes(0)
    })
  })
})

function createClient(httpClient: HttpClient, logger: Logger = Logger.SILENT) {
  return new RelayApiClient(httpClient, logger, 'api-key', {
    callsPerMinute: 1_000_000_000,
    initialRetryDelayMs: 0,
  })
}

function page(requests: unknown[], continuation: string | undefined) {
  return { requests, continuation }
}

function ok(body: unknown) {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => body,
    text: async () => JSON.stringify(body),
  }
}

function httpError(status: number, statusText: string) {
  return {
    ok: false,
    status,
    statusText,
    json: async () => ({}),
    text: async () => `{"statusCode":${status}}`,
  }
}

function request(id: string, data: Record<string, unknown> = {}) {
  return {
    id,
    status: 'success',
    data,
    createdAt: '2026-08-24T15:03:00.000Z',
    updatedAt: '2026-08-24T15:03:00.000Z',
  }
}

function amount(value: string, address: string) {
  return {
    amount: value,
    amountFormatted: value,
    currency: { address, symbol: 'TEST' },
  }
}

function txHash(digit: string) {
  return `0x${digit.repeat(64)}`
}
