import type { KnownInteropBridgeType } from '@l2beat/shared-pure'

export function getBestEffortBridgeTypeFromPartialSupplyAction({
  srcWasBurned,
  dstWasMinted,
}: {
  srcWasBurned: boolean | undefined
  dstWasMinted: boolean | undefined
}): KnownInteropBridgeType | undefined {
  const supplyChanged = srcWasBurned ?? dstWasMinted
  if (supplyChanged === undefined) return

  // A one-sided transfer cannot distinguish burn-and-mint from lock-and-mint,
  // or lock-and-mint from non-minting. Prefer the supply-changing type.
  return supplyChanged ? 'burnAndMint' : 'lockAndMint'
}
