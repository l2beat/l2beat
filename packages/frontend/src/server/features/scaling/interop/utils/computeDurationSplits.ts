import type { CommonInteropData } from '../types'

export function computeDurationSplits(
  current: CommonInteropData,
  direction: 'in' | 'out' | null,
  record: {
    transferCount: number | undefined
    totalDurationSum: number | undefined
  },
): Pick<
  CommonInteropData,
  'inTransferCount' | 'inDurationSum' | 'outTransferCount' | 'outDurationSum'
> {
  const transferCount = record.transferCount ?? 0
  const durationSum = record.totalDurationSum ?? 0

  return {
    inTransferCount:
      current.inTransferCount + (direction === 'in' ? transferCount : 0),
    inDurationSum:
      current.inDurationSum + (direction === 'in' ? durationSum : 0),
    outTransferCount:
      current.outTransferCount + (direction === 'out' ? transferCount : 0),
    outDurationSum:
      current.outDurationSum + (direction === 'out' ? durationSum : 0),
  }
}
