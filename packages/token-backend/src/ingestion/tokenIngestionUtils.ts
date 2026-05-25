import type { InteropTransferRecord } from '@l2beat/database'
import { Address32 } from '@l2beat/shared-pure'

export interface TokenAddress {
  chain: string
  address: string
}

export interface InteropTransferMatch {
  transfer: InteropTransferRecord
  token: TokenAddress
  otherToken: TokenAddress | undefined
}

export interface InteropTransferIndex {
  findInvolving(address: TokenAddress): InteropTransferMatch[]
}

export function buildInteropTransferIndex(
  transfers: InteropTransferRecord[],
): InteropTransferIndex {
  const map = new Map<string, InteropTransferMatch[]>()

  for (const transfer of transfers) {
    const src = normalizeTransferSide(
      transfer.srcChain,
      transfer.srcTokenAddress,
    )
    const dst = normalizeTransferSide(
      transfer.dstChain,
      transfer.dstTokenAddress,
    )

    if (src) addMatch(map, src, { transfer, token: src, otherToken: dst })
    if (dst) addMatch(map, dst, { transfer, token: dst, otherToken: src })
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
