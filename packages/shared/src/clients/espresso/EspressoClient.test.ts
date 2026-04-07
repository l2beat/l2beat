import { Logger } from '@l2beat/backend-tools'
import { expect, mockObject } from 'earl'
import type { HttpClient } from '../http/HttpClient'
import { EspressoClient } from './EspressoClient'

describe(EspressoClient.name, () => {
  describe(EspressoClient.prototype.getStakeTable.name, () => {
    it('returns stake table', async () => {
      const mockResponse = {
        stake_table: [
          {
            stake_table_entry: {
              stake_amount: '0x56bc75e2d63100000',
            },
          },
          {
            stake_table_entry: {
              stake_amount: '0xad78ebc5ac6200000',
            },
          },
        ],
      }

      const http = mockObject<HttpClient>({
        fetch: async () => mockResponse,
      })
      const apiUrl = 'https://example.com'
      const client = mockClient({ http, apiUrl })

      const result = await client.getStakeTable()

      expect(result).toEqual(mockResponse)
      expect(http.fetch).toHaveBeenOnlyCalledWith(
        `${apiUrl}/v0/node/stake-table/current`,
        {
          method: 'GET',
          timeout: undefined,
        },
      )
    })

    it('throws error on invalid response', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({
          invalid: 'response',
        }),
      })
      const client = mockClient({ http })

      await expect(client.getStakeTable()).toBeRejected()
    })
  })

  describe(EspressoClient.prototype.validateResponse.name, () => {
    it('returns false when response includes error', () => {
      const client = mockClient({})
      const validationInfo = client.validateResponse({
        Custom: {
          message: 'something went wrong',
          status: 400,
        },
      })

      expect(validationInfo.success).toEqual(false)
    })

    it('returns true for response without error', () => {
      const client = mockClient({})
      const validationInfo = client.validateResponse({
        epoch: 1,
        stake_table: [],
      })

      expect(validationInfo.success).toEqual(true)
    })
  })
})

function mockClient(deps: {
  http?: HttpClient
  apiUrl?: string
  timeout?: number
}) {
  return new EspressoClient({
    sourceName: 'espresso',
    apiUrl: deps.apiUrl ?? 'API_URL',
    http: deps.http ?? mockObject<HttpClient>({}),
    callsPerMinute: 100_000,
    retryStrategy: 'TEST',
    logger: Logger.SILENT,
    timeout: deps.timeout,
  })
}
