import { SLOT_SECONDS, slotProgressAt, slotStart } from '~/utils/beaconSlots'
import type { BeaconSource, LiveBatch, LiveBlock } from './LiveBlobsFeed'
import type { MempoolSource } from './mempool'
import type { PendingTx } from './pendingBlobs'

/** About when a real block reaches the node, into its slot */
const SEEN_INTO_SLOT = 2
const MAX_BLOBS = 21
const MAX_BATCHES = 7
const MAX_BATCH_BLOBS = 6
const MISSED_ONE_IN = 40
const UNATTRIBUTED_ONE_IN = 10
/** Each poster posts this much less than the one before, so a few post most, as on mainnet */
const POSTER_FALLOFF = 0.75
/** Batches sent privately to a builder, never seen pending */
const PRIVATE_ONE_IN = 8
/** How far ahead of its slot a batch may be broadcast; most wait about a slot on mainnet */
const MAX_LEAD = SLOT_SECONDS
const MEMPOOL_TICK_MS = 250
/** Room for every batch of a slot in its senders' nonces */
const NONCES_PER_SLOT = 64

/**
 * A beacon node for MOCK_BEACON: blocks come on the real 12-second clock, but
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

/**
 * A mempool for MOCK_BEACON, in step with the mock beacon node: each batch of
 * the next block is broadcast a few seconds before its slot, but for the
 * odd one sent privately. When each goes out follows from its slot too.
 */
export function createMockMempool(posterIds: Promise<string[]>): MempoolSource {
  // without posters there is nothing to broadcast; the block feed is the one
  // to await them and report their failing
  const pickPoster = posterIds.then(createPosterPicker, () => undefined)
  let timer: ReturnType<typeof setInterval> | undefined
  const sent = new Set<string>()
  return {
    watch(onBlobTx) {
      if (timer) return
      timer = setInterval(() => {
        void pickPoster.then(
          (pick) =>
            pick && broadcastDue(pick, Date.now() / 1000, sent, onBlobTx),
        )
      }, MEMPOOL_TICK_MS)
      timer.unref()
    },
    stop() {
      clearInterval(timer)
      timer = undefined
    },
  }
}

/**
 * Broadcasts the batches due by `now` and not sent yet: the next slot's, and
 * the slot just started's until its block is seen, as a tick may fall after
 * one of them was due but before the slot began
 */
function broadcastDue(
  pickPoster: (roll: number) => string | undefined,
  now: number,
  sent: Set<string>,
  onBlobTx: (tx: PendingTx) => void,
) {
  const current = Math.floor(slotProgressAt(now))
  const blockSeen = now >= slotStart(current) + SEEN_INTO_SLOT
  for (const slot of blockSeen ? [current + 1] : [current, current + 1]) {
    for (const { broadcastAt, tx } of mockBroadcasts(slot, pickPoster)) {
      if (now < broadcastAt || sent.has(tx.hash)) continue
      sent.add(tx.hash)
      onBlobTx(tx)
    }
  }
  // only the coming slots' batches are ever due, so older ones can go
  if (sent.size > 4 * NONCES_PER_SLOT) sent.clear()
}

/** The batches of `slot`'s block that go through the mempool, and when each is broadcast */
export function mockBroadcasts(
  slot: number,
  pickPoster: (roll: number) => string | undefined,
): { broadcastAt: number; tx: PendingTx }[] {
  const block = mockBlock(slot, pickPoster)
  if (block.status !== 'proposed') return []
  return block.batches.flatMap((batch, i) => {
    const random = seededRandom(slot * NONCES_PER_SLOT + i)
    if (Math.floor(random() * PRIVATE_ONE_IN) === 0) return []
    return [
      {
        broadcastAt: slotStart(slot) - random() * MAX_LEAD,
        tx: { ...batch, hash: `0x${batch.nonce.toString(16)}` },
      },
    ]
  })
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
    const projectId = unattributed ? undefined : pickPoster(random())
    batches.push({
      projectId,
      blobs: size,
      to: `0x${(slot * 7919 + i).toString(16).padStart(40, '0')}`,
      from: `mock:${projectId ?? 'unknown'}`,
      nonce: slot * NONCES_PER_SLOT + i,
      txHash: `0x${(slot * 7919 + i).toString(16).padStart(64, '0')}`,
    })
    blobs += size
  }
  return { slot, status: 'proposed', blockNumber: slot - 1_000_000, batches }
}

export function createPosterPicker(posterIds: string[]) {
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
