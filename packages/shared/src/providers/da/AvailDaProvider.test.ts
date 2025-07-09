import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { PolkadotRpcClient } from '../../clients'
import { AvailDaProvider } from './AvailDaProvider'
import type { AvailBlob } from './types'

describe(AvailDaProvider.name, () => {
  describe(AvailDaProvider.prototype.getBlobs.name, () => {
    it('return blobs for given block range', async () => {
      const mockRpc = mockObject<PolkadotRpcClient>({
        getBlock: mockFn()
          .resolvesToOnce(mockBlockResponse([1, 2]))
          .resolvesToOnce(mockBlockResponse([])),
      })

      const provider = new AvailDaProvider(mockRpc, 'avail')

      const result = await provider.getBlobs(1, 2)

      expect(result).toEqual([
        {
          type: 'avail',
          daLayer: 'avail',
          appId: '1',
          blockTimestamp: UnixTime(1720092420),
          blockNumber: 291,
          size: 64n,
        } as AvailBlob,
        {
          type: 'avail',
          daLayer: 'avail',
          appId: '2',
          blockTimestamp: UnixTime(1720092420),
          blockNumber: 291,
          size: 77n,
        } as AvailBlob,
      ])
    })

    it('return no blobs if no extrinsics', async () => {
      const mockRpc = mockObject<PolkadotRpcClient>({
        getBlock: mockFn().resolvesTo(mockBlockResponse([1, 2], [])),
      })

      const provider = new AvailDaProvider(mockRpc, 'avail')

      const result = await provider.getBlobs(1, 2)

      expect(result).toEqual([])
    })

    it('return no blobs if no apps', async () => {
      const mockRpc = mockObject<PolkadotRpcClient>({
        getBlock: mockFn().resolvesTo(mockBlockResponse([])),
      })

      const provider = new AvailDaProvider(mockRpc, 'avail')

      const result = await provider.getBlobs(1, 2)

      expect(result).toEqual([])
    })
  })
})

function mockBlockResponse(appIds: number[], extrinsics?: string[]): any {
  return {
    header: {
      parentHash: '0x123',
      number: '0x123',
      stateRoot: '0x123',
      extrinsicsRoot: '0x123',
      extension: {
        V3: {
          appLookup: {
            size: 123,
            index: appIds.map((appId) => ({
              appId,
              start: 0,
            })),
          },
          commitment: {
            rows: 1,
            cols: 1,
            commitment: [],
            dataRoot: '0x123',
          },
        },
      },
    },
    extrinsics: extrinsics ?? [
      '0x280403000b80991dd39401',
      '0x55028400a2f7b73f907cd569c51001f0644d04c9661bf8f98ed624f6c135f7170180d74001caeb2d3c6e8304f49fe2dd0590abc35a06cadb1ca85e608c9a98705a5c28dd7c55c5becb2011bc5d2b4be5eb0ce82f97fd4e5d9b8f3989e13f467f7f72f4678ce40100000006030000d6fb2b0c83e1bbf6938265912d900f57c9bee67bd8a8cb18ec50fefbf479311740d4d08b710841e813',
      '0x8e4c0700840042ddd31a9c9a7313634a024b6993767b6c44acb6235abf440bb33066e688d335016c78fadcaf0d53c0637f5e295c5b71706073856c9c60b40c78e9d90a5eb62c59b0a75f26ada2e4c2c07fda550bb8e5a044c5c055a19ecabc97f4ef7d123f4f8300cd2a004c1d01d64a0700001d8bbdb748cac63d4d280fa513f13f4400000001d29d78daacb083779deff7047a4e7262dbb66d35b66ddbb6d1d8361a348d6d36b693c6361a3b77f5f3fdddfb17dc67bdeb5dfbd9cfecd933d30177',
      '0xc65d19008400a891d6a177f2cf5fa2128b53f8e932cc72f02b275e943fb554c5ab1ec5bbe84b01ce118276d825199b7d909812696d897797b5a517d4210fa252239ecb0dcd885873d30a5715b2f2863693754668b80444051e99751bb8ffb2f3028ff59a23df8e00c200010000441d01065c1900000000000000000000000000010656f004259e900d6b6c4fa122d0608c1db4fa818eb568239d14203f5021ca6ce8f01e2ef31f0901ded52c4d3c090e4136716e2a',
    ],
  }
}
