import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import {
  InteropTransferAnalyzer,
  type InteropTransferAnalyzerRecord,
} from './InteropTransferAnalyzer'
import type { InteropNotifier } from './notifications/InteropNotifier'

describe(InteropTransferAnalyzer.name, () => {
  it('notifies extreme mismatches whose larger side reaches the threshold', () => {
    const notifier = mockObject<InteropNotifier>({
      notifySuspiciousTransfers: mockFn().returns(undefined),
    } as any)
    const analyzer = new InteropTransferAnalyzer(notifier)

    analyzer.handleProcessedTransfers(
      [
        transfer({
          transferId: 'msg1',
          srcValueUsd: 600_000,
          dstValueUsd: 100_000,
        }),
        transfer({
          transferId: 'msg2',
          srcValueUsd: 200_000,
          dstValueUsd: 100_000,
        }),
        transfer({
          transferId: 'msg3',
          srcValueUsd: 50,
          dstValueUsd: 500_000,
        }),
        transfer({
          transferId: 'msg4',
          srcValueUsd: 10,
          dstValueUsd: 99_000,
        }),
        transfer({
          transferId: 'msg5',
          srcValueUsd: 0,
          dstValueUsd: 200_000,
        }),
      ],
      UnixTime(2_000_000),
    )

    expect(notifier.notifySuspiciousTransfers).toHaveBeenCalledTimes(1)
    const suspiciousTransfers =
      notifier.notifySuspiciousTransfers.calls[0]?.args[1]

    expect(
      suspiciousTransfers?.map(({ transferId, valueRatio, dominantSide }) => ({
        transferId,
        valueRatio,
        dominantSide,
      })),
    ).toEqual([
      { transferId: 'msg1', valueRatio: 6, dominantSide: 'src' },
      { transferId: 'msg3', valueRatio: 10_000, dominantSide: 'dst' },
      {
        transferId: 'msg5',
        valueRatio: Number.POSITIVE_INFINITY,
        dominantSide: 'dst',
      },
    ])
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
