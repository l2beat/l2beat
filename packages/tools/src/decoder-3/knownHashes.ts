import type { Hex } from 'viem'

export interface KnownHash {
  id: string
  hash: Hex
  address: Hex
  chainId: number
  nonce: string
  path: string
  anchor: string
}

// A hash match identifies the exact transaction, regardless of the name of
// the argument referring to it. Keep every occurrence, including duplicates.
export function findKnownHashes(
  entries: KnownHash[],
  hash: Hex,
  chainId: number | undefined,
): KnownHash[] {
  if (!/^0x[\da-f]{64}$/i.test(hash)) return []
  return entries.filter(
    (entry) =>
      entry.chainId === chainId &&
      entry.hash.toLowerCase() === hash.toLowerCase(),
  )
}
