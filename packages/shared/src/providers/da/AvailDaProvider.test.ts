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

    it('return 1 blob per id that has an avail extrinsic', async () => {
      const mockRpc = mockObject<PolkadotRpcClient>({
        getBlock: mockFn().resolvesTo(mockRealBlockData()),
      })

      const provider = new AvailDaProvider(mockRpc, 'avail')

      const result = await provider.getBlobs(1768867, 1768867)

      expect(result).toEqual([
        {
          type: 'avail',
          daLayer: 'avail',
          appId: '34',
          blockTimestamp: UnixTime(1755463940),
          blockNumber: 1768867,
          size: 478n,
        } as AvailBlob,
      ])
    })

    it('return multiple blobs per id that has an avail extrinsic', async () => {
      const mockRpc = mockObject<PolkadotRpcClient>({
        getBlock: mockFn().resolvesTo(
          mockBlockResponseForHeight(
            1768872,
            [31],
            [
              '0x8e4c0700840042ddd31a9c9a7313634a024b6993767b6c44acb6235abf440bb33066e688d335016c78fadcaf0d53c0637f5e295c5b71706073856c9c60b40c78e9d90a5eb62c59b0a75f26ada2e4c2c07fda550bb8e5a044c5c055a19ecabc97f4ef7d123f4f8300cd2a004c1d01d64a0700001d8bbdb748cac63d4d280fa513f13f4400000001d29d78daacb083779deff7047a4e7262dbb66d35b66ddbb6d1d8361a348d6d36b693c6361a3b77f5f3fdddfb17dc67bdeb5dfbd9cfecd933d30177',
              '0xc65d19008400a891d6a177f2cf5fa2128b53f8e932cc72f02b275e943fb554c5ab1ec5bbe84b01ce118276d825199b7d909812696d897797b5a517d4210fa252239ecb0dcd885873d30a5715b2f2863693754668b80444051e99751bb8ffb2f3028ff59a23df8e00c200010000441d01065c1900000000000000000000000000010656f004259e900d6b6c4fa122d0608c1db4fa818eb568239d14203f5021ca6ce8f01e2ef31f0901ded52c4d3c090e4136716e2a',
            ],
          ),
        ),
      })

      const provider = new AvailDaProvider(mockRpc, 'avail')

      const result = await provider.getBlobs(1768872, 1768872)

      expect(result).toEqual([
        {
          type: 'avail',
          daLayer: 'avail',
          appId: '31',
          blockTimestamp: UnixTime(1755464040),
          blockNumber: 1768872,
          size: 64n,
        } as AvailBlob,
        {
          type: 'avail',
          daLayer: 'avail',
          appId: '31',
          blockTimestamp: UnixTime(1755464040),
          blockNumber: 1768872,
          size: 77n,
        } as AvailBlob,
      ])
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
      '0x5502840a2f7b73f907cd569c51001f0644d04c9661bf8f98ed624f6c135f7170180d74001caeb2d3c6e8304f49fe2dd0590abc35a06cadb1ca85e608c9a98705a5c28dd7c55c5becb2011bc5d2b4be5eb0ce82f97fd4e5d9b8f3989e13f467f7f72f4678ce40100000006030000d6fb2b0c83e1bbf6938265912d900f57c9bee67bd8a8cb18ec50fefbf479311740d4d08b710841e813',
      '0x8e4c0700840042ddd31a9c9a7313634a024b6993767b6c44acb6235abf440bb33066e688d335016c78fadcaf0d53c0637f5e295c5b71706073856c9c60b40c78e9d90a5eb62c59b0a75f26ada2e4c2c07fda550bb8e5a044c5c055a19ecabc97f4ef7d123f4f8300cd2a004c1d01d64a0700001d8bbdb748cac63d4d280fa513f13f4400000001d29d78daacb083779deff7047a4e7262dbb66d35b66ddbb6d1d8361a348d6d36b693c6361a3b77f5f3fdddfb17dc67bdeb5dfbd9cfecd933d30177',
      '0xc65d19008400a891d6a177f2cf5fa2128b53f8e932cc72f02b275e943fb554c5ab1ec5bbe84b01ce118276d825199b7d909812696d897797b5a517d4210fa252239ecb0dcd885873d30a5715b2f2863693754668b80444051e99751bb8ffb2f3028ff59a23df8e00c200010000441d01065c1900000000000000000000000000010656f004259e900d6b6c4fa122d0608c1db4fa818eb568239d14203f5021ca6ce8f01e2ef31f0901ded52c4d3c090e4136716e2a',
    ],
  }
}

function mockBlockResponseForHeight(
  blockNumber: number,
  appIds: number[],
  extrinsics: string[],
): any {
  return {
    header: {
      parentHash: '0x123',
      number: `0x${blockNumber.toString(16)}`,
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
    extrinsics,
  }
}

function mockRealBlockData(): any {
  return {
    header: {
      parentHash:
        '0x38de6f3244b9f61be14b2cc55361e7d7b5bc07466e1763f47d1d7cb663162854',
      number: '0x1afda3',
      stateRoot:
        '0x8da5f87e12d6c990f0b0cf34562c7fac7b2f0b961ffcc537bb70a91078e3407a',
      extrinsicsRoot:
        '0xead5777886f4cc304c15b7e76e1b992e1cd1da8c547468d23800cf657fe727db',
      extension: {
        V3: {
          appLookup: {
            size: 20,
            index: [{ appId: 34, start: 0 }],
          },
          commitment: {
            rows: 1,
            cols: 32,
            commitment: [
              182, 33, 140, 230, 164, 217, 93, 240, 202, 164, 65, 27, 69, 32,
              200, 169, 181, 140, 63, 201, 177, 165, 2, 168, 109, 5, 217, 232,
              180, 168, 231, 93, 205, 4, 106, 57, 137, 32, 194, 31, 179, 21,
              104, 58, 194, 250, 216, 59, 182, 33, 140, 230, 164, 217, 93, 240,
              202, 164, 65, 27, 69, 32, 200, 169, 181, 140, 63, 201, 177, 165,
              2, 168, 109, 5, 217, 232, 180, 168, 231, 93, 205, 4, 106, 57, 137,
              32, 194, 31, 179, 21, 104, 58, 194, 250, 216, 59,
            ],
            dataRoot:
              '0xa033fa97b5e8e4f2f66e97d3840e855567ee97cc9b8e36c222e87bf0f540e0be',
          },
        },
      },
    },
    extrinsics: [
      '0x280403000b60c738ba9801',
      '0x45098400627541efe4ff234874b43ba2c4ec93f6719fb43af06557300f841f2c21a70f7f019aaf7f6457283c4de156afb38db8809a57bfb5ba79494e2d0def550fa79a5a3a5c571777257180cd42d6193f177d94cbac90aa2beb14a58ae5a0f52c7f285b8c0400367c010000881d018907000000000000000000000000010001d1040001f00a3119766bad471d88758c58250825ceb3663fff3bcffe9c27480b7dfb2ef200ea67776df4158eedc7db7040fde5f846e59fe0e0c5cccba0004bbd381cc276d8000000c809090000006531250126356608000000c232250126356608000000661908c35100000067890100000000000000000000000000007e9100000068890800000000000000000000000000007e920000011900b30509635e48881821e27ae50a94286415d8bcf00c5542ec96ae058b75e98e130000011b00174f7b02899bb17835ffdf9ac9903f08f8e5edfc62f3f80d011d21721125b1e80000011c00f3ff525bc5a011f7e302478eb6e48eb33c4831c0947e60631f04aeefbfe89f8a0000011d00eba7c1eefb70ccc7306b334e4f12ae9f7c93429e6cbfc160c0b57d083bb677f00000011e001ec782034119105c0d73df13f2ac1e48203e43d2a09d717ae6be43747c78314700000120005521e8c53fcb9bc3dbc8ecb15a2cec55cd2e5bc30a89a59e2f511379000c5b6800000121008c0d11bcb12b61368c5c4485aff6811c4033aabfb126824e0c42b8f94e57f1a40000012200013d2098582c1d0eb3402a33f57311090a893a747fbc8576359b7cbb227558a00000006c890800000000000000000000000000007e92',
      '0x1004270b00',
    ],
  }
}
