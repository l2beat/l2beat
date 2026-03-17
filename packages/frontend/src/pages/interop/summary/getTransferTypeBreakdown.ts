import type { ProtocolEntry } from '~/server/features/scaling/interop/types'

export interface TransferTypeBreakdown {
  volume: {
    nonMinting: number
    lockAndMint: number
    burnAndMint: number
  }
  transferCount: {
    nonMinting: number
    lockAndMint: number
    burnAndMint: number
  }
}

export function getTransferTypeBreakdown(
  entries: ProtocolEntry[],
): TransferTypeBreakdown {
  return entries.reduce<TransferTypeBreakdown>(
    (acc, entry) => {
      acc.volume.nonMinting += entry.byBridgeType?.nonMinting?.volume ?? 0
      acc.volume.lockAndMint += entry.byBridgeType?.lockAndMint?.volume ?? 0
      acc.volume.burnAndMint += entry.byBridgeType?.burnAndMint?.volume ?? 0

      acc.transferCount.nonMinting +=
        entry.byBridgeType?.nonMinting?.transferCount ?? 0
      acc.transferCount.lockAndMint +=
        entry.byBridgeType?.lockAndMint?.transferCount ?? 0
      acc.transferCount.burnAndMint +=
        entry.byBridgeType?.burnAndMint?.transferCount ?? 0

      return acc
    },
    {
      volume: {
        nonMinting: 0,
        lockAndMint: 0,
        burnAndMint: 0,
      },
      transferCount: {
        nonMinting: 0,
        lockAndMint: 0,
        burnAndMint: 0,
      },
    },
  )
}
