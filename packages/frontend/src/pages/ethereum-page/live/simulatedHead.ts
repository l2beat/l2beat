import { getSimulatedHistory, todayStart } from './simulatedHistory'
import type {
  BlockLimits,
  EthereumHead,
  HeadBlock,
  PosterBlobs,
  TodaySoFar,
} from './types'

/**
 * Stands in for the Ethereum head stream until the head indexer exists. One
 * instance per page, so every widget ticks on the same block, as the real
 * stream will make them
 */

export const HEAD_WINDOW = 64
const SLOT_SECONDS = 12
const GENESIS = 1606824023
const SLOTS_PER_EPOCH = 32
/** Block numbers ran ahead of slots before the merge, less the slots missed since */
const SLOT_TO_BLOCK = 10_727_000
/** One block in this many starts a reorg, far more often than on mainnet, so the rewind can be seen */
const REORG_EVERY = 45
/** Most reorgs rewrite one slot, a few go deeper; never past the finalized slot */
const REORG_DEPTHS = [1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 6]
const MISS_EVERY = 40

export const SIMULATED_LIMITS: BlockLimits = {
  targetBlobs: 14,
  maxBlobs: 21,
  gasLimit: 60_000_000,
  gasTarget: 30_000_000,
}

/** Rough shares of blob space, by project id, so the mix looks like mainnet */
const KNOWN_SHARES: Record<string, number> = {
  base: 0.3,
  arbitrum: 0.16,
  optimism: 0.08,
  taiko: 0.07,
  scroll: 0.06,
  linea: 0.06,
  worldchain: 0.05,
  soneium: 0.04,
  ink: 0.03,
  unichain: 0.03,
}
export const UNKNOWN_POSTER_ID = 'unknown'

export interface SimulatedPoster {
  id: string
  name: string
}

export interface SimulatedHead {
  get: () => EthereumHead
  subscribe: (listener: () => void) => () => void
  /** Rewrites the newest `depth` slots now, as a reorg would; a typical depth when omitted */
  reorg: (depth?: number) => void
  /** 1 is real time */
  setSpeed: (speed: number) => void
}

export function createSimulatedHead(posters: SimulatedPoster[]): SimulatedHead {
  const weights = toWeights(posters)
  const listeners = new Set<() => void>()
  let speed = 1
  let timer: ReturnType<typeof setTimeout> | undefined
  let state: EthereumHead = {
    status: 'connecting',
    head: undefined,
    blocks: [],
    finalizedSlot: undefined,
    finalizedBlock: undefined,
    justifiedSlot: undefined,
    lastReorg: undefined,
    today: undefined,
    supplyEth: undefined,
    stakedEth: undefined,
    activeValidators: undefined,
    nextSlotAt: undefined,
    limits: SIMULATED_LIMITS,
  }
  let slot = 0

  function emit(next: EthereumHead) {
    state = next
    for (const listener of listeners) listener()
  }

  function start() {
    const now = Date.now() / 1000
    slot = Math.floor((now - GENESIS) / SLOT_SECONDS)
    const lastDay = getSimulatedHistory(todayStart()).at(-1)
    const blocks: HeadBlock[] = []
    for (let s = slot - HEAD_WINDOW + 1; s <= slot; s++) {
      blocks.push(makeBlock(s, weights))
    }
    emit({
      ...state,
      status: 'live',
      head: blocks.at(-1),
      blocks,
      finalizedSlot: finalizedFor(slot),
      finalizedBlock: finalizedFor(slot) + SLOT_TO_BLOCK,
      justifiedSlot: finalizedFor(slot) + SLOTS_PER_EPOCH,
      today: seedToday(slot, weights),
      // picks up where the daily history ends, so today's point joins the line
      supplyEth: lastDay?.supplyEth,
      stakedEth: lastDay?.stakedEth,
      activeValidators: 1_104_212,
      nextSlotAt: nextSlotAt(),
    })
    schedule()
  }

  function nextSlotAt() {
    const slotStart = (GENESIS + (slot + 1) * SLOT_SECONDS) * 1000
    // at higher speed slots come faster than the wall clock
    if (speed === 1) return slotStart
    return Date.now() + (SLOT_SECONDS * 1000) / speed
  }

  function schedule() {
    clearTimeout(timer)
    const delay = Math.max(50, (state.nextSlotAt ?? Date.now()) - Date.now())
    timer = setTimeout(advance, delay)
  }

  function advance() {
    slot++
    if (Math.random() < 1 / REORG_EVERY) reorg()
    const block = makeBlock(slot, weights)
    const blocks = [...state.blocks, block].slice(-HEAD_WINDOW)
    const crossedEpoch = slot % SLOTS_PER_EPOCH === 0
    emit({
      ...state,
      head: block,
      blocks,
      finalizedSlot: finalizedFor(slot),
      finalizedBlock: finalizedFor(slot) + SLOT_TO_BLOCK,
      justifiedSlot: finalizedFor(slot) + SLOTS_PER_EPOCH,
      today: addToToday(state.today, block),
      supplyEth: (state.supplyEth ?? 0) + block.issuedEth - block.burnedEth,
      stakedEth: crossedEpoch
        ? (state.stakedEth ?? 0) + (Math.random() - 0.4) * 900
        : state.stakedEth,
      activeValidators: crossedEpoch
        ? (state.activeValidators ?? 0) + Math.round((Math.random() - 0.4) * 30)
        : state.activeValidators,
      nextSlotAt: nextSlotAt(),
    })
    schedule()
  }

  function reorg(requested = randomDepth()) {
    const { blocks, head } = state
    if (!head || head.status !== 'proposed') return
    const unfinalized = head.slot - (state.finalizedSlot ?? 0)
    let depth = Math.max(1, Math.min(requested, unfinalized, blocks.length - 1))
    // a fork starts from a block, so a missed slot can't be the fork point
    while (
      depth < blocks.length - 1 &&
      blocks[blocks.length - 1 - depth]?.status === 'missed'
    ) {
      depth++
    }
    const replaced = blocks.slice(-depth)
    const by = replaced.map((b, i) =>
      // the winning branch ends on a block, or there'd be no new head
      makeBlock(b.slot, weights, i === depth - 1 ? 'proposed' : undefined),
    )
    let today = state.today
    let supplyEth = state.supplyEth ?? 0
    for (const b of replaced) {
      today = removeFromToday(today, b)
      supplyEth -= b.issuedEth - b.burnedEth
    }
    for (const b of by) {
      today = addToToday(today, b)
      supplyEth += b.issuedEth - b.burnedEth
    }
    emit({
      ...state,
      head: by.at(-1),
      blocks: [...blocks.slice(0, -depth), ...by],
      lastReorg: {
        forkSlot: (replaced[0]?.slot ?? head.slot) - 1,
        depth,
        replaced,
        by,
        seenAt: Date.now(),
      },
      today,
      supplyEth,
    })
  }

  return {
    get: () => state,
    subscribe(listener) {
      listeners.add(listener)
      if (listeners.size === 1) start()
      return () => {
        listeners.delete(listener)
        if (listeners.size === 0) clearTimeout(timer)
      }
    },
    reorg,
    setSpeed(next) {
      speed = next
      if (state.status === 'live') {
        emit({ ...state, nextSlotAt: nextSlotAt() })
        schedule()
      }
    },
  }
}

function randomDepth() {
  return REORG_DEPTHS[Math.floor(Math.random() * REORG_DEPTHS.length)] ?? 1
}

function finalizedFor(slot: number) {
  // finality trails the head by about two epochs
  return (Math.floor(slot / SLOTS_PER_EPOCH) - 2) * SLOTS_PER_EPOCH
}

function toWeights(posters: SimulatedPoster[]) {
  const list = posters.map((p) => ({
    id: p.id,
    weight: KNOWN_SHARES[p.id] ?? 0.002,
  }))
  list.push({ id: UNKNOWN_POSTER_ID, weight: 0.08 })
  const total = list.reduce((sum, p) => sum + p.weight, 0)
  return list.map((p) => ({ ...p, weight: p.weight / total }))
}

type Weights = ReturnType<typeof toWeights>

function makeBlock(
  slot: number,
  weights: Weights,
  force?: 'proposed',
): HeadBlock {
  const timestamp = GENESIS + slot * SLOT_SECONDS
  const missed = force !== 'proposed' && Math.random() < 1 / MISS_EVERY
  const ethPriceUsd = 3400 + Math.sin(slot / 300) * 60 + Math.random() * 8
  if (missed) {
    return {
      slot,
      timestamp,
      status: 'missed',
      number: undefined,
      hash: undefined,
      proposerIndex: randomInt(0, 1_100_000),
      gasUsed: 0,
      gasLimit: SIMULATED_LIMITS.gasLimit,
      baseFeeGwei: 0,
      priorityFeeGwei: 0,
      txCount: 0,
      uopsCount: 0,
      blobs: [],
      blobCount: 0,
      blobBaseFeeWei: 0,
      burnedEth: 0,
      issuedEth: 0,
      ethPriceUsd,
    }
  }
  // demand drifts over the day, with bursts above target
  const demand = 0.55 + 0.2 * Math.sin(slot / 450) + (Math.random() - 0.5) * 0.5
  const gasUsed = clamp(
    SIMULATED_LIMITS.gasLimit * demand,
    4_000_000,
    SIMULATED_LIMITS.gasLimit,
  )
  const blobCount = clamp(
    Math.round(SIMULATED_LIMITS.targetBlobs * (demand + 0.25)),
    0,
    SIMULATED_LIMITS.maxBlobs,
  )
  const baseFeeGwei = 0.18 + demand * 0.6 + Math.random() * 0.08
  const blobBaseFeeWei =
    blobCount > SIMULATED_LIMITS.targetBlobs ? randomInt(2, 40) : 1
  const txCount = Math.round(gasUsed / 95_000)
  const blobs = splitBlobs(blobCount, weights)
  const burnedEth =
    (baseFeeGwei * gasUsed) / 1e9 + (blobBaseFeeWei * blobCount * 131072) / 1e18
  return {
    slot,
    timestamp,
    status: 'proposed',
    number: slot + SLOT_TO_BLOCK,
    hash: randomHash(),
    proposerIndex: randomInt(0, 1_100_000),
    gasUsed,
    gasLimit: SIMULATED_LIMITS.gasLimit,
    baseFeeGwei,
    priorityFeeGwei: 0.01 + Math.random() * 0.2,
    txCount,
    uopsCount: Math.round(txCount * 1.08),
    blobs,
    blobCount,
    blobBaseFeeWei,
    burnedEth,
    // about 2,700 ETH a day across 7,200 slots
    issuedEth: 0.36 + Math.random() * 0.03,
    ethPriceUsd,
  }
}

function splitBlobs(count: number, weights: Weights): PosterBlobs[] {
  const byId = new Map<string, number>()
  for (let i = 0; i < count; i++) {
    const id = pick(weights)
    byId.set(id, (byId.get(id) ?? 0) + 1)
  }
  return [...byId.entries()]
    .map(([posterId, blobs]) => ({ posterId, blobs }))
    .sort((a, b) => b.blobs - a.blobs)
}

function pick(weights: Weights) {
  let r = Math.random()
  for (const w of weights) {
    r -= w.weight
    if (r <= 0) return w.id
  }
  return UNKNOWN_POSTER_ID
}

function seedToday(slot: number, weights: Weights): TodaySoFar {
  const startedAt = Math.floor(Date.now() / 86_400_000) * 86_400
  const slots = Math.floor((Date.now() / 1000 - startedAt) / SLOT_SECONDS)
  let today = emptyToday(startedAt)
  // a sample scaled up stands in for the day's blocks so far
  const sample = 200
  for (let i = 0; i < sample; i++) {
    today = addToToday(today, makeBlock(slot - i, weights))
  }
  const scale = slots / sample
  return {
    startedAt,
    slots,
    blocks: Math.round(today.blocks * scale),
    missed: Math.round(today.missed * scale),
    blobs: Math.round(today.blobs * scale),
    txs: Math.round(today.txs * scale),
    uops: Math.round(today.uops * scale),
    gasUsed: today.gasUsed * scale,
    burnedEth: today.burnedEth * scale,
    issuedEth: today.issuedEth * scale,
    priorityFeesEth: today.priorityFeesEth * scale,
  }
}

function emptyToday(startedAt: number): TodaySoFar {
  return {
    startedAt,
    slots: 0,
    blocks: 0,
    missed: 0,
    blobs: 0,
    txs: 0,
    uops: 0,
    gasUsed: 0,
    burnedEth: 0,
    issuedEth: 0,
    priorityFeesEth: 0,
  }
}

function addToToday(today: TodaySoFar | undefined, b: HeadBlock): TodaySoFar {
  const dayStart = Math.floor(b.timestamp / 86_400) * 86_400
  const base =
    !today || today.startedAt !== dayStart ? emptyToday(dayStart) : today
  return applyBlock(base, b, 1)
}

function removeFromToday(
  today: TodaySoFar | undefined,
  b: HeadBlock,
): TodaySoFar | undefined {
  return today && applyBlock(today, b, -1)
}

function applyBlock(t: TodaySoFar, b: HeadBlock, sign: 1 | -1): TodaySoFar {
  const proposed = b.status === 'proposed' ? 1 : 0
  return {
    ...t,
    slots: t.slots + sign,
    blocks: t.blocks + sign * proposed,
    missed: t.missed + sign * (1 - proposed),
    blobs: t.blobs + sign * b.blobCount,
    txs: t.txs + sign * b.txCount,
    uops: t.uops + sign * b.uopsCount,
    gasUsed: t.gasUsed + sign * b.gasUsed,
    burnedEth: t.burnedEth + sign * b.burnedEth,
    issuedEth: t.issuedEth + sign * b.issuedEth,
    priorityFeesEth:
      t.priorityFeesEth + (sign * (b.priorityFeeGwei * b.gasUsed)) / 1e9,
  }
}

function randomHash() {
  let hash = '0x'
  for (let i = 0; i < 64; i++)
    hash += Math.floor(Math.random() * 16).toString(16)
  return hash
}

function randomInt(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min))
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
