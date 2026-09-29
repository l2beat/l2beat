import type { Log } from '@l2beat/shared-pure'
import { bytesToHex, type Hex, hexToBytes, keccak256 } from 'viem'

/** Bloom of a block without logs. */
export const EMPTY_LOGS_BLOOM = `0x${'0'.repeat(512)}`

const BLOOM_BYTES = 256

/**
 * Builds the Ethereum logs bloom of the given logs. Every log address and
 * topic sets three bits, picked from the first six bytes of its keccak256.
 */
export function computeLogsBloom(logs: Log[]): string {
  const bloom = new Uint8Array(BLOOM_BYTES)
  for (const log of logs) {
    for (const item of [log.address, ...log.topics]) {
      setBloomBits(bloom, item)
    }
  }
  return bytesToHex(bloom)
}

/** Combines the blooms of several blocks into one, as a settled range does. */
export function mergeLogsBlooms(blooms: string[]): string {
  const merged = new Uint8Array(BLOOM_BYTES)
  for (const bloom of blooms) {
    const bytes = hexToBytes(bloom as Hex)
    for (let i = 0; i < BLOOM_BYTES; i++) {
      merged[i] |= bytes[i]
    }
  }
  return bytesToHex(merged)
}

function setBloomBits(bloom: Uint8Array, item: string) {
  const hash = hexToBytes(keccak256(item as Hex))
  for (let i = 0; i < 6; i += 2) {
    const bit = ((hash[i] << 8) | hash[i + 1]) & 2047
    bloom[BLOOM_BYTES - 1 - Math.floor(bit / 8)] |= 1 << (bit % 8)
  }
}
