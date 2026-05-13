import {
  Address32,
  ChainSpecificAddress,
  type KnownInteropBridgeType,
} from '@l2beat/shared-pure'
import type { TokenMap } from '../engine/match/TokenMap'

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

export function getTokenFrameworkBridgeType({
  srcTokenAddress,
  dstTokenAddress,
  srcWasBurned,
  dstWasMinted,
  srcChain,
  dstChain,
  tokenMap,
  defaultBridgeType = 'burnAndMint',
}: {
  srcTokenAddress: Address32 | undefined
  dstTokenAddress: Address32 | undefined
  srcWasBurned: boolean | undefined
  dstWasMinted: boolean | undefined
  srcChain: string
  dstChain: string
  tokenMap: TokenMap
  defaultBridgeType?: 'burnAndMint' | 'nonMinting'
}): KnownInteropBridgeType | undefined {
  if (
    !srcTokenAddress ||
    !dstTokenAddress ||
    srcWasBurned === undefined ||
    dstWasMinted === undefined
  ) {
    return
  }

  // chainspecificaddress does not support 'native' so we make do without the abstract map
  if (
    srcTokenAddress === Address32.NATIVE &&
    dstTokenAddress === Address32.NATIVE
  ) {
    return 'nonMinting'
  }
  if (
    srcTokenAddress === Address32.NATIVE ||
    dstTokenAddress === Address32.NATIVE
  ) {
    return 'lockAndMint'
  }

  if (srcWasBurned && dstWasMinted) {
    return 'burnAndMint'
  }
  if (srcWasBurned || dstWasMinted) {
    return 'lockAndMint'
  }

  const srcAbstractToken = tokenMap.get(
    ChainSpecificAddress.fromLong(
      srcChain,
      Address32.cropToEthereumAddress(srcTokenAddress),
    ),
  )
  const dstAbstractToken = tokenMap.get(
    ChainSpecificAddress.fromLong(
      dstChain,
      Address32.cropToEthereumAddress(dstTokenAddress),
    ),
  )
  if (!srcAbstractToken || !dstAbstractToken) return
  if (srcAbstractToken.issuer === null || dstAbstractToken.issuer === null) {
    return defaultBridgeType
  }

  // lock + release
  return srcAbstractToken.issuer === dstAbstractToken.issuer
    ? 'nonMinting'
    : 'lockAndMint'
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
