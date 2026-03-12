import { Logger } from '@l2beat/backend-tools'
import { expect, mockObject } from 'earl'
import type { HttpClient } from '../http/HttpClient'
import { EspressoClient } from './EspressoClient'

describe(EspressoClient.name, () => {
  describe(EspressoClient.prototype.getStakeTable.name, () => {
    it('returns stake table', async () => {
      const mockResponse = {
        epoch: 284,
        stake_table: [
          {
            stake_table_entry: {
              stake_key: 'BLS_VER_KEY~abc',
              stake_amount: '0x56bc75e2d63100000',
            },
            state_ver_key: 'SCHNORR_VER_KEY~xyz',
          },
          {
            stake_table_entry: {
              stake_key: 'BLS_VER_KEY~def',
              stake_amount: '0xad78ebc5ac6200000',
            },
            state_ver_key: 'SCHNORR_VER_KEY~uvw',
          },
        ],
      }

      const http = mockObject<HttpClient>({
        fetch: async () => mockResponse,
      })
      const client = mockClient({ http })

      const result = await client.getStakeTable()

      expect(result).toEqual(mockResponse)
      expect(http.fetch).toHaveBeenOnlyCalledWith(
        'https://query.main.net.espresso.network/v0/node/stake-table/current',
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
        error: 'something went wrong',
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

function mockClient(deps: { http?: HttpClient; timeout?: number }) {
  return new EspressoClient({
    sourceName: 'espresso',
    apiUrl:
      deps.http !== undefined
        ? 'https://query.main.net.espresso.network'
        : 'API_URL',
    http: deps.http ?? mockObject<HttpClient>({}),
    callsPerMinute: 100_000,
    retryStrategy: 'TEST',
    logger: Logger.SILENT,
    timeout: deps.timeout,
  })
}
