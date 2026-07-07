import type { InteropTokenRouteRecord } from '@l2beat/database'
import { Address32, type InteropBridgeType } from '@l2beat/shared-pure'
import { InteropTransferClassifier } from '../../../shared/build'

export interface TokenAddress {
  chain: string
  address: string
}

export interface InteropTransferMatch {
  plugin: string
  bridgeType: InteropBridgeType
  sourceWasBurned: boolean
  destinationWasMinted: boolean
  transferCount: number
  sampleTransferId: string
  token: TokenAddress
  otherToken: TokenAddress | undefined
  sourceToken: TokenAddress | undefined
  destinationToken: TokenAddress | undefined
}

export interface InteropTransferIndex {
  findInvolving(address: TokenAddress): InteropTransferMatch[]
}

export function buildInteropTransferIndex(
  routes: InteropTokenRouteRecord[],
): InteropTransferIndex {
  const map = new Map<string, InteropTransferMatch[]>()

  for (const route of routes) {
    const src = normalizeTransferSide(route.srcChain, route.srcTokenAddress)
    const dst = normalizeTransferSide(route.dstChain, route.dstTokenAddress)
    const base = {
      plugin: route.plugin,
      bridgeType:
        route.bridgeType ?? InteropTransferClassifier.inferBridgeType(route),
      sourceWasBurned: route.srcWasBurned ?? false,
      destinationWasMinted: route.dstWasMinted ?? false,
      transferCount: route.transferCount,
      sampleTransferId: route.sampleTransferId,
      sourceToken: src,
      destinationToken: dst,
    }

    if (src) addMatch(map, src, { ...base, token: src, otherToken: dst })
    if (dst) addMatch(map, dst, { ...base, token: dst, otherToken: src })
  }

  return {
    findInvolving(address) {
      return map.get(getTokenKey(address)) ?? []
    },
  }
}

export function normalizeInteropTokenAddress(
  address: string,
): string | undefined {
  const lower = address.toLowerCase()

  if (lower === 'native') {
    return lower
  }
  if (lower === '0x' || lower === Address32.ZERO) {
    return undefined
  }
  if (lower.startsWith('0x')) {
    return Address32.cropToEthereumAddress(Address32.from(lower)).toLowerCase()
  }

  return lower
}

export function getTokenKey(address: TokenAddress): string {
  return `${address.chain}:${address.address.toLowerCase()}`
}

function normalizeTransferSide(
  chain: string,
  address: string | undefined,
): TokenAddress | undefined {
  if (!address) return undefined

  const normalizedAddress = normalizeInteropTokenAddress(address)
  if (!normalizedAddress) return undefined

  return {
    chain,
    address: normalizedAddress,
  }
}

function addMatch(
  map: Map<string, InteropTransferMatch[]>,
  address: TokenAddress,
  match: InteropTransferMatch,
) {
  const key = getTokenKey(address)
  const matches = map.get(key)
  if (matches) {
    matches.push(match)
  } else {
    map.set(key, [match])
  }
}
