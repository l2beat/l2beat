import type { KnownInteropBridgeType } from '@l2beat/shared-pure'

type PartialMintInfo =
  | {
      srcWasBurned: boolean
      dstWasMinted: undefined
    }
  | {
      srcWasBurned: undefined
      dstWasMinted: boolean
    }

export function getBestEffortBridgeTypeFromPartialMintInfo({
  srcWasBurned,
  dstWasMinted,
}: PartialMintInfo): KnownInteropBridgeType {
  const wasBurnedOrMinted = srcWasBurned ?? dstWasMinted

  // A one-sided transfer cannot distinguish burn-and-mint from lock-and-mint,
  // or lock-and-mint from non-minting. Prefer the supply-changing type.
  return wasBurnedOrMinted ? 'burnAndMint' : 'lockAndMint'
}
