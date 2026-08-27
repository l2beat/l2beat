import { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import { expect, mockFn, mockObject } from 'earl'
import { GetRequestsResponse, RelayApiClient } from './RelayApiClient'

describe('GetRequestsResponse', () => {
  it('normalizes null app fee fields', () => {
    const result = GetRequestsResponse.parse(RESPONSE_WITH_NULL_APP_FEES)

    expect(result.requests[0]?.data.appFees).toEqual([EMPTY_APP_FEE])
    expect(result.requests[0]?.data.paidAppFees).toEqual([EMPTY_APP_FEE])
  })
})

const EMPTY_APP_FEE = {
  recipient: undefined,
  bps: undefined,
  amount: undefined,
  amountUsd: undefined,
  amountUsdCurrent: undefined,
}

const RESPONSE_WITH_NULL_APP_FEES = {
  requests: [
    {
      id: '0x7dccf8381df9cd420b00f2cb336997a37ff68909dbee198fb9cecd7fecd957f8',
      data: {
        appFees: [
          {
            recipient: null,
            bps: null,
            amount: null,
            amountUsd: null,
            amountUsdCurrent: null,
          },
        ],
        paidAppFees: [
          {
            recipient: null,
            bps: null,
            amount: null,
            amountUsd: null,
            amountUsdCurrent: null,
          },
        ],
      },
      createdAt: '2026-08-18T17:51:19.308Z',
      updatedAt: '2026-08-18T17:52:03.279Z',
    },
  ],
}

describe(RelayApiClient.name, () => {
  describe(RelayApiClient.prototype.getAllRequests.name, () => {
    it('returns pages fetched before a failure', async () => {
      const httpClient = mockObject<HttpClient>({
        fetch: mockFn()
          .resolvesToOnce(page(['a', 'b'], 'cursor-1'))
          .rejectsWithOnce(new Error('network timeout')),
      })
      const client = new RelayApiClient(httpClient, Logger.SILENT)

      const result = await client.getAllRequests({ limit: 500 })

      expect(result.requests.map((r) => r.id)).toEqual(['a', 'b'])
      expect(result.continuation).toEqual('cursor-1')
      expect(httpClient.fetch).toHaveBeenCalledTimes(2)
    })

    it('throws when the first page fails', async () => {
      const httpClient = mockObject<HttpClient>({
        fetch: mockFn().rejectsWith(new Error('network timeout')),
      })
      const client = new RelayApiClient(httpClient, Logger.SILENT)

      await expect(client.getAllRequests({ limit: 500 })).toBeRejectedWith(
        'network timeout',
      )
    })

    it('paginates until the limit is reached', async () => {
      const httpClient = mockObject<HttpClient>({
        fetch: mockFn()
          .resolvesToOnce(page(['a'], 'cursor-1'))
          .resolvesToOnce(page(['b'], undefined)),
      })
      const client = new RelayApiClient(httpClient, Logger.SILENT)

      const result = await client.getAllRequests({ limit: 500 })

      expect(result.requests.map((r) => r.id)).toEqual(['a', 'b'])
      expect(result.continuation).toEqual(undefined)
    })

    it('reports the cursor when the limit stops the walk', async () => {
      const httpClient = mockObject<HttpClient>({
        fetch: mockFn().resolvesToOnce(page(['a'], 'cursor-1')),
      })
      const client = new RelayApiClient(httpClient, Logger.SILENT)

      const result = await client.getAllRequests({ limit: 1 })

      expect(result.requests.map((r) => r.id)).toEqual(['a'])
      expect(result.continuation).toEqual('cursor-1')
    })

    it('always sorts by updatedAt ascending', async () => {
      const httpClient = mockObject<HttpClient>({
        fetch: mockFn().resolvesTo(page(['a'], undefined)),
      })
      const client = new RelayApiClient(httpClient, Logger.SILENT)

      await client.getAllRequests({ limit: 500 })

      const url = httpClient.fetch.calls[0]?.args[0] as string
      expect(url).toInclude('sortBy=updatedAt')
      expect(url).toInclude('sortDirection=asc')
    })
  })
})

function page(ids: string[], continuation: string | undefined) {
  return {
    requests: ids.map((id) => ({
      id,
      data: {},
      createdAt: '2026-08-24T15:03:00.000Z',
      updatedAt: '2026-08-24T15:03:00.000Z',
    })),
    continuation,
  }
}
