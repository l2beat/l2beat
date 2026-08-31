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
  transferCount: number
  sampleTransferId: string
  sampleSrcTxHash: string | undefined
  sampleDstTxHash: string | undefined
  token: TokenAddress
  otherToken: TokenAddress | undefined
}

export interface InteropTransferIndex {
  findInvolving(address: TokenAddress): InteropTransferMatch[]
}

/** Per-plugin summary of the transfers involving an address: the total count
 * and one sample transfer's tx hashes, so a researcher can jump from the
 * ingestion trace to an explorer. */
export interface TransferPluginEvidence {
  plugin: string
  transferCount: number
  sampleSrcTxHash: string | undefined
  sampleDstTxHash: string | undefined
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
      transferCount: route.transferCount,
      sampleTransferId: route.sampleTransferId,
      sampleSrcTxHash: route.sampleSrcTxHash,
      sampleDstTxHash: route.sampleDstTxHash,
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

export function summarizeTransferPlugins(
  matches: InteropTransferMatch[],
): TransferPluginEvidence[] {
  const byPlugin = new Map<
    string,
    { transferCount: number; sample: InteropTransferMatch }
  >()

  for (const match of matches) {
    const entry = byPlugin.get(match.plugin)
    if (!entry) {
      byPlugin.set(match.plugin, {
        transferCount: match.transferCount,
        sample: match,
      })
      continue
    }
    entry.transferCount += match.transferCount
    if (isBetterSample(match, entry.sample)) {
      entry.sample = match
    }
  }

  return Array.from(byPlugin.entries())
    .map(([plugin, { transferCount, sample }]) => ({
      plugin,
      transferCount,
      sampleSrcTxHash: sample.sampleSrcTxHash,
      sampleDstTxHash: sample.sampleDstTxHash,
    }))
    .sort(
      (a, b) =>
        b.transferCount - a.transferCount || a.plugin.localeCompare(b.plugin),
    )
}

/** A sample with at least one tx hash beats one without (non-EVM sides may
 * lack hashes); among equally hashed samples the busier route wins. */
function isBetterSample(
  candidate: InteropTransferMatch,
  current: InteropTransferMatch,
): boolean {
  const candidateHasHash =
    candidate.sampleSrcTxHash !== undefined ||
    candidate.sampleDstTxHash !== undefined
  const currentHasHash =
    current.sampleSrcTxHash !== undefined ||
    current.sampleDstTxHash !== undefined
  if (candidateHasHash !== currentHasHash) return candidateHasHash
  return candidate.transferCount > current.transferCount
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

export function normalizeTransferSide(
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
