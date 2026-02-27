import type { InteropTransferRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { toInteropProtocolTransferDetailsItem } from './getInteropProtocolTransfers'

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
