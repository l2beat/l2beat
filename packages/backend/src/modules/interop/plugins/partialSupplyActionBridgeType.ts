import type { KnownInteropBridgeType } from '@l2beat/shared-pure'

// At least one side must be undefined
type PartialSupplyActionInfo =
  | {
      srcWasBurned: boolean | undefined
      dstWasMinted: undefined
    }
  | {
      srcWasBurned: undefined
      dstWasMinted: boolean | undefined
    }

export function getBestEffortBridgeTypeFromPartialSupplyAction({
  srcWasBurned,
  dstWasMinted,
}: PartialSupplyActionInfo): KnownInteropBridgeType | undefined {
  const supplyChanged = srcWasBurned ?? dstWasMinted
  if (supplyChanged === undefined) return

  // A one-sided transfer cannot distinguish burn-and-mint from lock-and-mint,
  // or lock-and-mint from non-minting. Prefer the supply-changing type.
  return supplyChanged ? 'burnAndMint' : 'lockAndMint'
}
