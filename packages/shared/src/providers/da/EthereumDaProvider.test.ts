import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { BlobScanClient } from '../../clients'
import { type EthereumBlob, EthereumDaProvider } from './EthereumDaProvider'

describe(EthereumDaProvider.name, () => {
  describe(EthereumDaProvider.prototype.getBlobs.name, () => {
    it('return blobs for given block range', async () => {
      const mockDate = new Date()

      const mockCLient = mockObject<BlobScanClient>({
        getBlobs: mockFn().resolvesTo([
          {
            blockTimestamp: mockDate.toISOString(),
            transaction: {
              to: '0xto1',
              from: '0xfrom1',
            },
          },
          {
            blockTimestamp: mockDate.toISOString(),
            transaction: {
              to: '0xto2',
              from: '0xfrom2',
            },
          },
        ]),
      })

      const provider = new EthereumDaProvider(mockCLient)

      const result = await provider.getBlobs(1, 2)

      expect(result).toEqual([
        {
          inbox: '0xto1',
          sequencer: '0xfrom1',
          blockTimestamp: UnixTime.fromDate(mockDate),
          size: 131072n,
        } as EthereumBlob,
        {
          inbox: '0xto2',
          sequencer: '0xfrom2',
          blockTimestamp: UnixTime.fromDate(mockDate),
          size: 131072n,
        } as EthereumBlob,
      ])
    })
  })
})
