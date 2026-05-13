import type { KnownInteropBridgeType } from '@l2beat/shared-pure'

const TOKEN_FRAMEWORK_BRIDGE_TYPE_FALLBACK_PRIORITY = [
  'burnAndMint',
  'lockAndMint',
] as const satisfies KnownInteropBridgeType[]

export function getBestEffortTokenFrameworkBridgeType({
  srcWasBurned,
  dstWasMinted,
}: {
  srcWasBurned: boolean | undefined
  dstWasMinted: boolean | undefined
}): KnownInteropBridgeType | undefined {
  const candidates = getBridgeTypeCandidatesFromPartialSupplyActions({
    srcWasBurned,
    dstWasMinted,
  })

  // One-sided token-framework events expose only the local supply action. Pick
  // the best display fallback from bridge types that are still possible.
  return TOKEN_FRAMEWORK_BRIDGE_TYPE_FALLBACK_PRIORITY.find((bridgeType) =>
    candidates.has(bridgeType),
  )
}

function getBridgeTypeCandidatesFromPartialSupplyActions({
  srcWasBurned,
  dstWasMinted,
}: {
  srcWasBurned: boolean | undefined
  dstWasMinted: boolean | undefined
}): Set<KnownInteropBridgeType> {
  const candidates = new Set<KnownInteropBridgeType>()
  const srcCandidates =
    srcWasBurned === undefined ? [false, true] : [srcWasBurned]
  const dstCandidates =
    dstWasMinted === undefined ? [false, true] : [dstWasMinted]

  if (srcWasBurned === undefined && dstWasMinted === undefined) {
    return candidates
  }

  for (const srcCandidate of srcCandidates) {
    for (const dstCandidate of dstCandidates) {
      if (srcCandidate && dstCandidate) {
        candidates.add('burnAndMint')
      } else if (srcCandidate || dstCandidate) {
        candidates.add('lockAndMint')
      } else {
        candidates.add('nonMinting')
      }
    }
  }

  return candidates
}
