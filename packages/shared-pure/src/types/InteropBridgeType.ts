import { v } from '@l2beat/validate'

export const InteropBridgeTypeValues = [
  'lockAndMint',
  'nonMinting',
  'burnAndMint',
  'unknown',
] as const
export const InteropBridgeType = v.enum(InteropBridgeTypeValues)
export type InteropBridgeType = v.infer<typeof InteropBridgeType>

export const KnownInteropBridgeTypeValues = [
  'lockAndMint',
  'nonMinting',
  'burnAndMint',
] as const
export const KnownInteropBridgeType = v.enum(KnownInteropBridgeTypeValues)
export type KnownInteropBridgeType = v.infer<typeof KnownInteropBridgeType>

/**
 * Derives the bridge type from the observed supply-change flags. Used when a
 * transfer has no plugin-declared `bridgeType`.
 */
export function inferInteropBridgeType(transfer: {
  srcWasBurned: boolean | undefined
  dstWasMinted: boolean | undefined
}): InteropBridgeType {
  if (
    (transfer.srcWasBurned === false && transfer.dstWasMinted === true) ||
    (transfer.srcWasBurned === true && transfer.dstWasMinted === false)
  ) {
    return 'lockAndMint'
  }
  if (transfer.srcWasBurned === true && transfer.dstWasMinted === true) {
    return 'burnAndMint'
  }
  if (transfer.srcWasBurned === false && transfer.dstWasMinted === false) {
    return 'nonMinting'
  }
  return 'unknown'
}
