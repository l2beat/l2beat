import type { InteropTokenRouteRecord } from '@l2beat/database'
import { Address32, type InteropBridgeType } from '@l2beat/shared-pure'
import { InteropTransferClassifier } from '../../../shared/build'
import type { TransferPluginEvidence } from './IngestionTrace'

export interface TokenAddress {
  chain: string
  address: string
}

export interface InteropTransferMatch {
  plugin: string
  bridgeType: InteropBridgeType
  transferCount: number
  sampleTransferId: string
  sampleSrcChain: string
  sampleSrcTxHash: string | undefined
  sampleDstChain: string
  sampleDstTxHash: string | undefined
  token: TokenAddress
  otherToken: TokenAddress | undefined
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
      transferCount: route.transferCount,
      sampleTransferId: route.sampleTransferId,
      sampleSrcChain: route.srcChain,
      sampleSrcTxHash: route.sampleSrcTxHash,
      sampleDstChain: route.dstChain,
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
      sampleSrcChain: sample.sampleSrcChain,
      sampleSrcTxHash: sample.sampleSrcTxHash,
      sampleDstChain: sample.sampleDstChain,
      sampleDstTxHash: sample.sampleDstTxHash,
    }))
    .sort(
      (a, b) =>
        b.transferCount - a.transferCount || a.plugin.localeCompare(b.plugin),
    )
}

/** A sample with more tx hashes wins (sides may lack hashes when the event
 * was never observed); among equally hashed samples the busier route wins. */
function isBetterSample(
  candidate: InteropTransferMatch,
  current: InteropTransferMatch,
): boolean {
  const candidateHashes = countSampleHashes(candidate)
  const currentHashes = countSampleHashes(current)
  if (candidateHashes !== currentHashes) return candidateHashes > currentHashes
  return candidate.transferCount > current.transferCount
}

function countSampleHashes(match: InteropTransferMatch): number {
  return (
    (match.sampleSrcTxHash !== undefined ? 1 : 0) +
    (match.sampleDstTxHash !== undefined ? 1 : 0)
  )
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
