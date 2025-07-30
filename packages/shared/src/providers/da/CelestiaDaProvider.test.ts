import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { CelestiaRpcClient } from '../../clients'
import { CelestiaDaProvider } from './CelestiaDaProvider'

describe(CelestiaDaProvider.name, () => {
  describe(CelestiaDaProvider.prototype.getBlobs.name, () => {
    it('fetches blobs from multiple blocks with different timestamps', async () => {
      const rpcClientMock = createMockRpcClient()
      const provider = new CelestiaDaProvider(rpcClientMock, 'celestia')
      const blobs = await provider.getBlobs(1, 2)

      expect(blobs).toEqual([
        {
          type: 'celestia',
          daLayer: 'celestia',
          namespace: 'namespace1',
          blockTimestamp: UnixTime.fromDate(new Date('2024-01-01T12:00:00Z')),
          blockNumber: 1,
          size: BigInt(100),
        },
        {
          type: 'celestia',
          daLayer: 'celestia',
          namespace: 'namespace2',
          blockTimestamp: UnixTime.fromDate(new Date('2024-01-01T12:00:00Z')),
          blockNumber: 1,
          size: BigInt(200),
        },
        {
          type: 'celestia',
          daLayer: 'celestia',
          namespace: 'namespace3',
          blockTimestamp: UnixTime.fromDate(new Date('2024-01-02T12:00:00Z')),
          blockNumber: 2,
          size: BigInt(300),
        },
        {
          type: 'celestia',
          daLayer: 'celestia',
          namespace: 'namespace4',
          blockTimestamp: UnixTime.fromDate(new Date('2024-01-02T12:00:00Z')),
          blockNumber: 2,
          size: BigInt(400),
        },
      ])
    })
  })
})

function createMockRpcClient() {
  return mockObject<CelestiaRpcClient>({
    getBlockResult: async (blockNumber: number) => ({
      height: '100',
      txs_results: [
        {
          events: [
            {
              type: 'celestia.blob.v1.EventPayForBlobs',
              attributes: [
                {
                  key: 'namespaces',
                  value:
                    blockNumber === 1
                      ? '["namespace1", "namespace2"]'
                      : '["namespace3", "namespace4"]',
                },
                {
                  key: 'blob_sizes',
                  value: blockNumber === 1 ? '[100, 200]' : '[300, 400]',
                },
              ],
            },
            {
              type: 'otherEvent',
              attributes: [
                {
                  key: 'other-key',
                  value: 'different-value',
                },
              ],
            },
          ],
        },
      ],
    }),
    getBlockTimestamp: async (blockNumber: number) =>
      UnixTime.fromDate(
        new Date(
          blockNumber === 1 ? '2024-01-01T12:00:00Z' : '2024-01-02T12:00:00Z',
        ),
      ),
  })
}
