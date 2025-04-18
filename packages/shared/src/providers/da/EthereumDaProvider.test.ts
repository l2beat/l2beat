import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { BlobScanClient } from '../../clients'
import { EthereumDaProvider, toEqualBatches } from './EthereumDaProvider'
import type { EthereumBlob } from './types'

describe(EthereumDaProvider.name, () => {
  describe(EthereumDaProvider.prototype.getBlobs.name, () => {
    it('return blobs for given block range', async () => {
      const mockDate = new Date()

      const mockClient = mockObject<BlobScanClient>({
        getBlobs: mockFn().resolvesTo([
          {
            type: 'ethereum',
            daLayer: 'ethereum',
            blockTimestamp: mockDate.toISOString(),
            transaction: {
              to: '0xto1',
              from: '0xfrom1',
            },
          },
          {
            type: 'ethereum',
            daLayer: 'ethereum',
            blockTimestamp: mockDate.toISOString(),
            transaction: {
              to: '0xto2',
              from: '0xfrom2',
            },
          },
        ]),
      })

      const provider = new EthereumDaProvider(mockClient, 'ethereum', 1)

      const result = await provider.getBlobs(1, 2)

      expect(result).toEqual([
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: '0xto1',
          sequencer: '0xfrom1',
          blockTimestamp: UnixTime.fromDate(mockDate),
          size: 131072n,
        } as EthereumBlob,
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: '0xto2',
          sequencer: '0xfrom2',
          blockTimestamp: UnixTime.fromDate(mockDate),
          size: 131072n,
        } as EthereumBlob,
      ])
    })
  })
})

describe(toEqualBatches.name, () => {
  it('divides a range into equal batches', () => {
    const result = toEqualBatches(1, 10, 2)

    expect(result).toEqual([
      { start: 1, end: 5 },
      { start: 6, end: 10 },
    ])
  })

  it("handles ranges that don't divide evenly", () => {
    const result = toEqualBatches(1, 10, 3)

    // 10 blocks divided by 3 batches = 4 blocks per batch (rounded up)
    expect(result).toEqual([
      { start: 1, end: 4 },
      { start: 5, end: 8 },
      { start: 9, end: 10 },
    ])
  })

  it('creates fewer batches if range is smaller than batch count', () => {
    const result = toEqualBatches(1, 3, 5)

    // Only 3 blocks, so we can only create 3 batches with 1 block each
    expect(result).toEqual([
      { start: 1, end: 1 },
      { start: 2, end: 2 },
      { start: 3, end: 3 },
    ])
  })

  it('handles single block range', () => {
    const result = toEqualBatches(5, 5, 3)

    expect(result).toEqual([{ start: 5, end: 5 }])
  })

  it('handles zero-sized range', () => {
    const result = toEqualBatches(0, 0, 3)

    expect(result).toEqual([{ start: 0, end: 0 }])
  })

  it('handles large ranges', () => {
    const result = toEqualBatches(1000, 2000, 4)

    // 1001 blocks divided by 4 batches = 251 blocks per batch (rounded up)
    expect(result).toEqual([
      { start: 1000, end: 1250 },
      { start: 1251, end: 1501 },
      { start: 1502, end: 1752 },
      { start: 1753, end: 2000 },
    ])
  })

  it('handles batch count of 1', () => {
    const result = toEqualBatches(1, 10, 1)

    expect(result).toEqual([{ start: 1, end: 10 }])
  })

  it('returns empty array for invalid range (from > to)', () => {
    const result = toEqualBatches(10, 1, 3)

    expect(result).toEqual([])
  })
})
