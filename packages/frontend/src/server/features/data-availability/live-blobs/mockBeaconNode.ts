import { SLOT_SECONDS, slotProgressAt } from '~/utils/beaconSlots'
import type { BeaconSource, LiveBatch, LiveBlock } from './LiveBlobsFeed'

/** About when a real block reaches the node, into its slot */
const SEEN_INTO_SLOT = 2
const MAX_BLOBS = 21
const MAX_BATCHES = 7
const MAX_BATCH_BLOBS = 6
const MISSED_ONE_IN = 40
const UNATTRIBUTED_ONE_IN = 10
/** Each poster posts this much less than the one before, so a few post most, as on mainnet */
const POSTER_FALLOFF = 0.75

/**
 * A beacon node for mock mode: blocks come on the real 12-second clock, but
 * what each holds follows from its slot alone. Every run, and every
 * performance benchmark, then sees the same blocks without the network.
 */
export function createMockBeaconNode(
  posterIds: Promise<string[]>,
): BeaconSource {
  const pickPoster = posterIds.then(createPosterPicker)
  return {
    headSlot: () =>
      Promise.resolve(
        Math.floor(
          slotProgressAt(Date.now() / 1000) - SEEN_INTO_SLOT / SLOT_SECONDS,
        ),
      ),
    block: async (slot) => mockBlock(slot, await pickPoster),
  }
}

function mockBlock(
  slot: number,
  pickPoster: (roll: number) => string | undefined,
): LiveBlock {
  const random = seededRandom(slot)
  if (Math.floor(random() * MISSED_ONE_IN) === 0) {
    return { slot, status: 'missed' }
  }
  const batches: LiveBatch[] = []
  let blobs = 0
  const batchCount = 1 + Math.floor(random() * MAX_BATCHES)
  for (let i = 0; i < batchCount && blobs < MAX_BLOBS; i++) {
    const size = Math.min(
      MAX_BLOBS - blobs,
      1 + Math.floor(random() * MAX_BATCH_BLOBS),
    )
    const unattributed = Math.floor(random() * UNATTRIBUTED_ONE_IN) === 0
    batches.push({
      projectId: unattributed ? undefined : pickPoster(random()),
      blobs: size,
      to: `0x${(slot * 7919 + i).toString(16).padStart(40, '0')}`,
    })
    blobs += size
  }
  return { slot, status: 'proposed', blockNumber: slot - 1_000_000, batches }
}

function createPosterPicker(posterIds: string[]) {
  const weights = posterIds.map((_, rank) => POSTER_FALLOFF ** rank)
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  return (roll: number) => {
    let left = roll * totalWeight
    for (const [rank, weight] of weights.entries()) {
      left -= weight
      if (left < 0) return posterIds[rank]
    }
    return posterIds.at(-1)
  }
}

/** mulberry32: small, fast, and the same numbers for the same seed */
function seededRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32
  }
}
