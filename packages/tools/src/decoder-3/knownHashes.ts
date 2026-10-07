import type { Hex } from 'viem'

export interface KnownHash {
  id: string
  hash: Hex
  address: Hex
  chainId: number
  nonce: string
  path: string
  anchor: string
  nearbyHashes?: { nonce: string; hash: Hex }[]
}

export type KnownHashMatch = KnownHash & { matchedNonce?: string }

// A hash match identifies the exact transaction, regardless of the name of
// the argument referring to it. Keep every occurrence, including duplicates.
export function findKnownHashes(
  entries: KnownHash[],
  hash: Hex,
  chainId: number | undefined,
): KnownHashMatch[] {
  if (!/^0x[\da-f]{64}$/i.test(hash)) return []
  const matches: KnownHashMatch[] = []
  for (const entry of entries) {
    if (entry.chainId !== chainId) continue
    if (entry.hash.toLowerCase() === hash.toLowerCase()) {
      matches.push(entry)
      continue
    }
    const nearby = entry.nearbyHashes?.find(
      (candidate) => candidate.hash.toLowerCase() === hash.toLowerCase(),
    )
    if (nearby) matches.push({ ...entry, matchedNonce: nearby.nonce })
  }
  return matches
}
