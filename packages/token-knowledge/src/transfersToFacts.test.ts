import { expect } from 'earl'
import { transfersToFacts } from './transfersToFacts'
import type { InteropTransferRecord } from '@l2beat/database'

function makeTransfer(
  overrides: Partial<InteropTransferRecord>,
): InteropTransferRecord {
  return {
    plugin: 'testPlugin',
    bridgeType: undefined,
    transferId: 'tx1',
    type: 'transfer',
    duration: undefined,
    timestamp: 0,
    srcTime: undefined,
    srcChain: 'ethereum',
    srcTxHash: undefined,
    srcLogIndex: undefined,
    srcEventId: undefined,
    srcTokenAddress: '0xSRC',
    srcRawAmount: undefined,
    srcWasBurned: undefined,
    srcAbstractTokenId: undefined,
    srcSymbol: undefined,
    srcAmount: undefined,
    srcPrice: undefined,
    srcValueUsd: undefined,
    dstTime: undefined,
    dstChain: 'base',
    dstTxHash: undefined,
    dstLogIndex: undefined,
    dstEventId: undefined,
    dstTokenAddress: '0xDST',
    dstRawAmount: undefined,
    dstWasMinted: undefined,
    dstAbstractTokenId: undefined,
    dstSymbol: undefined,
    dstAmount: undefined,
    dstPrice: undefined,
    dstValueUsd: undefined,
    isProcessed: false,
    ...overrides,
  }
}

describe(transfersToFacts.name, () => {
  it('produces a Clingo fact for a transfer', () => {
    const transfers = [
      makeTransfer({
        srcChain: 'ethereum',
        srcTokenAddress: '0xA0b8',
        dstChain: 'base',
        dstTokenAddress: '0x833',
        plugin: 'hop',
        bridgeType: 'lockAndMint',
      }),
    ]

    const result = transfersToFacts(transfers)
    expect(result).toEqual(
      'transfer("ethereum","0xA0b8","base","0x833","hop","lockAndMint").\n',
    )
  })

  it('skips transfers missing token addresses', () => {
    const transfers = [
      makeTransfer({ srcTokenAddress: undefined }),
    ]

    const result = transfersToFacts(transfers)
    expect(result).toEqual('')
  })

  it('uses "unknown" for missing bridge type', () => {
    const transfers = [
      makeTransfer({ bridgeType: undefined }),
    ]

    const result = transfersToFacts(transfers)
    expect(result).toInclude('"unknown"')
  })

  it('handles multiple transfers', () => {
    const transfers = [
      makeTransfer({ transferId: 'a', dstChain: 'base' }),
      makeTransfer({ transferId: 'b', dstChain: 'arbitrum' }),
    ]

    const lines = transfersToFacts(transfers).trim().split('\n')
    expect(lines.length).toEqual(2)
  })
})
