import type { InteropTransferRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  collectMatchedTransfersWithStats,
  toInteropProtocolTransferDetailsItem,
} from './getInteropProtocolTransfers'

describe(toInteropProtocolTransferDetailsItem.name, () => {
  it('maps transfer details with source and destination token amounts', () => {
    const result = toInteropProtocolTransferDetailsItem(
      transfer({
        srcAmount: undefined,
        dstAmount: 12.34,
        srcSymbol: undefined,
        dstSymbol: 'USDC',
        srcValueUsd: undefined,
        dstValueUsd: 12.34,
      }),
    )

    expect(result).toEqual({
      transferId: 'transfer-id',
      timestamp: 123,
      srcAmount: undefined,
      srcSymbol: undefined,
      dstAmount: 12.34,
      dstSymbol: 'USDC',
      valueUsd: 12.34,
      duration: 60,
      srcChain: 'ethereum',
      srcTxHash: '0xsrc',
      dstChain: 'arbitrum',
      dstTxHash: '0xdst',
    })
  })
})

describe(collectMatchedTransfersWithStats.name, () => {
  it('matches and sums in a single pass', () => {
    const result = collectMatchedTransfersWithStats(
      [
        transfer({
          transferId: 't0',
          plugin: 'skip',
          srcValueUsd: 5,
          dstValueUsd: 5,
        }),
        transfer({
          transferId: 't1',
          plugin: 'keep',
          srcValueUsd: 100,
          dstValueUsd: 10,
        }),
        transfer({
          transferId: 't2',
          plugin: 'keep',
          srcValueUsd: 10,
          dstValueUsd: 100,
        }),
      ],
      (transfer) => transfer.plugin === 'keep',
    )

    expect(result.items.map((x) => x.transferId)).toEqual(['t1', 't2'])
    expect(result.transferStats).toEqual({
      transferCount: 2,
      volume: 200,
    })
  })

  it('returns empty stats for no matches', () => {
    const result = collectMatchedTransfersWithStats(
      [
        transfer({
          transferId: 't1',
          plugin: 'skip',
          srcValueUsd: 100,
          dstValueUsd: 10,
        }),
      ],
      (transfer) => transfer.plugin === 'keep',
    )

    expect(result.items).toEqual([])
    expect(result.transferStats).toEqual({
      transferCount: 0,
      volume: 0,
    })
  })
})

function transfer(
  override: Partial<InteropTransferRecord> = {},
): InteropTransferRecord {
  return {
    plugin: 'plugin',
    bridgeType: 'nonMinting',
    transferId: 'transfer-id',
    type: 'deposit',
    duration: 60,
    timestamp: UnixTime(123),
    srcTime: UnixTime(100),
    srcChain: 'ethereum',
    srcTxHash: '0xsrc',
    srcLogIndex: 1,
    srcEventId: 'src-event',
    srcTokenAddress: undefined,
    srcRawAmount: 1n,
    srcWasBurned: false,
    srcAbstractTokenId: 'eth',
    srcSymbol: 'ETH',
    srcAmount: 1,
    srcPrice: 2000,
    srcValueUsd: 2000,
    dstTime: UnixTime(160),
    dstChain: 'arbitrum',
    dstTxHash: '0xdst',
    dstLogIndex: 2,
    dstEventId: 'dst-event',
    dstTokenAddress: undefined,
    dstRawAmount: 1n,
    dstWasMinted: false,
    dstAbstractTokenId: 'eth',
    dstSymbol: 'ETH',
    dstAmount: 1,
    dstPrice: 2000,
    dstValueUsd: 2000,
    isProcessed: true,
    ...override,
  }
}
