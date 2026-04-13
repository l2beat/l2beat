import type { InteropTransferRecord } from '@l2beat/database'
import { expect } from 'earl'
import { transfersToFacts } from './transfersToFacts'

const ADDR_A = '0xabcdabcd12345678abcdabcd12345678abcdabcd'
const ADDR_B = '0x33d66941465ac776c38096cb1bc496c673ae7390'

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
    srcTokenAddress: ADDR_A,
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
    dstTokenAddress: ADDR_B,
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
        srcTokenAddress: ADDR_A,
        dstChain: 'base',
        dstTokenAddress: ADDR_B,
        plugin: 'hop',
        bridgeType: 'lockAndMint',
      }),
    ]

    const result = transfersToFacts(transfers)
    expect(result).toEqual(
      `transfer("ethereum","${ADDR_A}","base","${ADDR_B}",hop,lockAndMint).\n`,
    )
  })

  it('lowercases addresses', () => {
    const transfers = [
      makeTransfer({
        srcTokenAddress: '0xABCDABCD12345678ABCDABCD12345678ABCDABCD',
        dstTokenAddress: '0x33D66941465AC776C38096CB1BC496C673AE7390',
      }),
    ]

    const result = transfersToFacts(transfers)
    expect(result).toInclude('0xabcdabcd12345678abcdabcd12345678abcdabcd')
    expect(result).toInclude('0x33d66941465ac776c38096cb1bc496c673ae7390')
  })

  it('skips transfers missing token addresses', () => {
    const transfers = [makeTransfer({ srcTokenAddress: undefined })]

    const result = transfersToFacts(transfers)
    expect(result).toEqual('')
  })

  it('uses "unknown" for missing bridge type', () => {
    const transfers = [makeTransfer({ bridgeType: undefined })]

    const result = transfersToFacts(transfers)
    expect(result).toInclude(',unknown)')
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
