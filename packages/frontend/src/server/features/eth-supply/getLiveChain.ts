import { SLOT_SECONDS, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import type { LiveChain, SlotStatus } from './types'

const SLOTS_PER_EPOCH = 32
const SLOT_COUNT = 32
const STALE_AFTER_SLOTS = 5
// Every open page polls each slot, so the beacon API is asked at most this often.
const FINALITY_TTL_MS = 15_000

interface Finality {
  finalizedEpoch: number
  justifiedEpoch: number
}

let cachedFinality: (Finality & { fetchedAt: number }) | undefined

/**
 * The latest slots the live blobs indexer stored, with finality from the
 * beacon API. Undefined when that API is not configured.
 */
export async function getLiveChain(): Promise<LiveChain | undefined> {
  const beaconApiUrl = env.ETHEREUM_BEACON_API_URL
  if (env.MOCK || !beaconApiUrl) return undefined

  const db = getDb()
  const head = await db.liveBlock.findHead()
  if (!head) throw new Error('No live blocks')

  const firstSlot = head.slot - SLOT_COUNT + 1
  const [blocks, finality] = await Promise.all([
    db.liveBlock.getBySlotRange(firstSlot, head.slot),
    getFinality(beaconApiUrl),
  ])

  return {
    headSlot: head.slot,
    finalityLagEpochs:
      Math.floor(head.slot / SLOTS_PER_EPOCH) - finality.finalizedEpoch,
    live: UnixTime.now() - head.timestamp < STALE_AFTER_SLOTS * SLOT_SECONDS,
    slots: getSlotStatuses({
      firstSlot,
      headSlot: head.slot,
      blockSlots: new Set(blocks.map((b) => b.slot)),
      finality,
    }),
  }
}

/**
 * A checkpoint is the block at its epoch's first slot, so it settles that
 * slot and the ones before it.
 */
export function getSlotStatuses({
  firstSlot,
  headSlot,
  blockSlots,
  finality,
}: {
  firstSlot: number
  headSlot: number
  blockSlots: Set<number>
  finality: Finality
}): LiveChain['slots'] {
  const slots: LiveChain['slots'] = []
  for (let slot = firstSlot; slot <= headSlot; slot++) {
    let status: SlotStatus = 'proposed'
    if (!blockSlots.has(slot)) status = 'missed'
    else if (slot <= finality.finalizedEpoch * SLOTS_PER_EPOCH) {
      status = 'finalized'
    } else if (slot <= finality.justifiedEpoch * SLOTS_PER_EPOCH) {
      status = 'justified'
    }
    slots.push({ slot, status })
  }
  return slots
}

const FinalityCheckpoints = v.object({
  data: v.object({
    finalized: v.object({ epoch: v.string() }),
    current_justified: v.object({ epoch: v.string() }),
  }),
})

async function getFinality(beaconApiUrl: string): Promise<Finality> {
  if (
    cachedFinality &&
    Date.now() - cachedFinality.fetchedAt < FINALITY_TTL_MS
  ) {
    return cachedFinality
  }
  const response = await fetch(
    `${beaconApiUrl.replace(/\/$/, '')}/eth/v1/beacon/states/head/finality_checkpoints`,
    { signal: AbortSignal.timeout(2_000) },
  )
  if (!response.ok) {
    throw new Error('Beacon API error', {
      cause: { status: response.status },
    })
  }
  const { data } = FinalityCheckpoints.parse(await response.json())
  cachedFinality = {
    finalizedEpoch: Number(data.finalized.epoch),
    justifiedEpoch: Number(data.current_justified.epoch),
    fetchedAt: Date.now(),
  }
  return cachedFinality
}
