import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import {
  InteropTransferAnalyzer,
  type InteropTransferAnalyzerRecord,
} from './InteropTransferAnalyzer'
import type { InteropNotifier } from './notifications/InteropNotifier'

describe(InteropTransferAnalyzer.name, () => {
  it('notifies only extreme suspicious transfers from the processed batch', () => {
    const notifier = mockObject<InteropNotifier>({
      notifySuspiciousTransfers: mockFn().returns(undefined),
    } as any)
    const analyzer = new InteropTransferAnalyzer(notifier)

    analyzer.handleProcessedTransfers(
      [
        transfer({
          transferId: 'msg1',
          srcValueUsd: 600,
          dstValueUsd: 100,
        }),
        transfer({
          transferId: 'msg2',
          srcValueUsd: 200,
          dstValueUsd: 100,
        }),
        transfer({
          transferId: 'msg3',
          srcValueUsd: 50,
          dstValueUsd: 400,
        }),
      ],
      UnixTime(2_000_000),
    )

    expect(notifier.notifySuspiciousTransfers).toHaveBeenCalledTimes(1)
    const suspiciousTransfers =
      notifier.notifySuspiciousTransfers.calls[0]?.args[1]

    expect(suspiciousTransfers).toHaveLength(1)
    expect(suspiciousTransfers?.[0]?.transferId).toEqual('msg1')
    expect(suspiciousTransfers?.[0]?.valueRatio).toEqual(6)
    expect(suspiciousTransfers?.[0]?.dominantSide).toEqual('src')
  })
})

function transfer(
  overrides: Partial<InteropTransferAnalyzerRecord>,
): InteropTransferAnalyzerRecord {
  return {
    plugin: 'plugin',
    transferId: 'transfer',
    type: 'deposit',
    timestamp: UnixTime(100),
    srcChain: 'ethereum',
    srcTxHash: undefined,
    srcTokenAddress: undefined,
    srcSymbol: 'USDC',
    srcValueUsd: 100,
    dstChain: 'arbitrum',
    dstTxHash: undefined,
    dstTokenAddress: undefined,
    dstSymbol: 'USDC',
    dstValueUsd: 100,
    ...overrides,
  }
}
