import type { LogsTopicFilter } from '@l2beat/shared'
import type { Log } from '@l2beat/shared-pure'
import { utils } from 'ethers'

const BLOOM_BYTES = 256

/** A block's logs bloom, ready to be asked. Undefined when none was stored */
export function parseBloom(bloom: string | null): Uint8Array | undefined {
  if (bloom === null || !utils.isHexString(bloom, BLOOM_BYTES)) return
  return utils.arrayify(bloom)
}

/**
 * All zeros: the bloom of a block with no logs, and what a chain that does
 * not fill blooms in sends for every block
 */
export function isEmptyBloom(bloom: Uint8Array): boolean {
  return bloom.every((byte) => byte === 0)
}

/**
 * The three bits an address or a topic sets in a bloom, as [byte, mask]:
 * eleven bits of each of the first three byte pairs of its hash
 */
export function bloomBits(value: string): [number, number][] {
  const hash = utils.arrayify(utils.keccak256(value))
  return [0, 2, 4].map((i) => {
    const bit = ((hash[i] << 8) | hash[i + 1]) & 2047
    return [BLOOM_BYTES - 1 - (bit >> 3), 1 << (bit & 7)]
  })
}

function has(bloom: Uint8Array, bits: [number, number][]): boolean {
  return bits.every(([byte, mask]) => (bloom[byte] & mask) !== 0)
}

/**
 * Whether a block with the bloom can have a log the filter matches: of one
 * of the addresses, with one of the topics at every position that names any.
 * False is certain. True is not: other logs may have set the same bits
 */
export function toBloomFilter(filter: {
  addresses: string[]
  topics: LogsTopicFilter
}): (bloom: Uint8Array) => boolean {
  const groups = [
    filter.addresses,
    ...filter.topics.filter((topic) => topic !== null).map((t) => [t].flat()),
  ].map((values) => values.map(bloomBits))
  return (bloom) => groups.every((group) => group.some((b) => has(bloom, b)))
}

/** Whether the bloom has the log, as the bloom of the log's own block must */
export function isInBloom(bloom: Uint8Array, log: Log): boolean {
  return [log.address, ...log.topics].every((v) => has(bloom, bloomBits(v)))
}
