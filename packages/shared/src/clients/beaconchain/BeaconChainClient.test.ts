import { Logger } from '@l2beat/backend-tools'
import { expect, mockObject } from 'earl'
import { withServer } from '../../test/withServer'
import { HttpClient } from '../http/HttpClient'
import { BeaconChainClient } from './BeaconChainClient'

describe(BeaconChainClient.name, () => {
  describe(BeaconChainClient.prototype.getBlockSidecar.name, async () => {
    it('should call rpc and return result', async () => {
      const kzg_commitment = 'commitment'
      const blob = 'blob'
      const expected = [
        {
          kzg_commitment,
          blob,
        },
      ]
      const http = mockObject<HttpClient>({
        fetch: async () => ({
          data: expected,
        }),
      })

      const client = mockClient({
        http,
        beaconApiUrl: 'example.com/',
      })

      const result = await client.getBlockSidecar('root')

      expect(http.fetch.calls[0].args[0]).toEqual(
        'example.com/eth/v1/beacon/blob_sidecars/root',
      )
      expect(result).toEqual([
        {
          kzg_commitment,
          data: blob,
        },
      ])
    })
  })

  describe(BeaconChainClient.prototype.getValidatorsInfo.name, () => {
    it('streams a raw native fetch response and sums balances', async () => {
      const body = JSON.stringify({
        execution_optimistic: false,
        data: [
          { index: '0', balance: '32000000000', status: 'active_ongoing' },
          { index: '1', balance: '31000000000', status: 'active_ongoing' },
        ],
      })

      const result = await withServer(
        (req, res) => {
          expect(req.url).toEqual(
            '/eth/v1/beacon/states/head/validators?status=active',
          )
          res.setHeader('Content-Type', 'application/json')
          res.end(body)
        },
        (url) => {
          const client = mockClient({
            http: new HttpClient(),
            beaconApiUrl: `${url}/`,
          })
          return client.getValidatorsInfo({
            stateId: 'head',
            status: ['active'],
          })
        },
      )

      expect(result).toEqual({
        totalStake: 63_000_000_000_000_000_000n,
        numberOfValidators: 2,
      })
    })
  })

  describe(BeaconChainClient.prototype.call.name, () => {
    it('should call beacon api and return result', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({ result: 'result' }),
      })
      const client = mockClient({ http, beaconApiUrl: 'BEACON_API_URL' })

      const result = await client.call('/eth/blob')

      expect(result).toEqual({ result: 'result' })
      expect(http.fetch.calls[0].args[0]).toEqual('BEACON_API_URL/eth/blob')
    })

    it('should throw on beacon error', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({
          code: -32000,
          message: 'RPC Error',
        }),
      })
      const client = mockClient({ http })

      await expect(client.call('/eth/blob')).toBeRejectedWith(
        'Response validation failed',
      )
    })
  })

  describe(BeaconChainClient.prototype.validateResponse.name, () => {
    it('handles beacon error', () => {
      const client = mockClient({})
      const isValid = client.validateResponse({
        code: 2137,
        message: 'Error',
      })

      expect(isValid).toEqual({ success: false })
    })
  })
})

function mockClient(deps: {
  http?: HttpClient
  beaconApiUrl?: string
  generateId?: () => string
  timeout?: number
}) {
  return new BeaconChainClient({
    beaconApiUrl: deps.beaconApiUrl ?? 'BEACON_API_URL',
    http: deps.http ?? mockObject<HttpClient>({}),
    callsPerMinute: 100_000,
    retryStrategy: 'TEST',
    logger: Logger.SILENT,
    timeout: deps.timeout,
    generateId: deps.generateId,
    sourceName: 'test',
  })
}
