import type { LivePoster } from '../model'
import type { BlobBatch, ChainBlock, PendingBlobBatch } from './beaconChain'
import type { BeltLayers } from './beltLayers'
import type { BeltLayout } from './beltLayout'
import type { BeltPalette } from './beltPalette'
import type { LaneSpot } from './lane'

/** What the belt is drawn from that changes only with props, size or theme */
export interface BeltScene {
  layout: BeltLayout
  palette: BeltPalette
  posters: LivePoster[]
  /** Recent blocks by slot, filled in as they come */
  blocks: ReadonlyMap<number, ChainBlock>
  /** Batches in the mempool by key, changed in place as they come and go */
  pending: ReadonlyMap<string, PendingBlobBatch>
  /** Round icons sized for a tile, by poster index; missing until loaded */
  icons: (HTMLCanvasElement | undefined)[]
  /** What looks the same on every frame, painted once */
  layers: BeltLayers
  targetBlobs: number
  maxBlobs: number
}

/** What moves: the chain's clock and the batches still settling in */
export interface Playback {
  /** Slots since genesis, with how far into the current one */
  progress: number
  /** Wall-clock second each batch starts to drop, by batch key, until it settles */
  arrivals: Map<number, number>
  /** The waiting lane, by the batches' keys */
  lane: Map<string, LaneSpot>
  /** Wall-clock second the lane last moved */
  laneAt: number
  /** Whether the lane changed or moved at `laneAt`, so the belt must be painted */
  laneMoving: boolean
  /** Where batches that waited in the lane leave it from, by batch key, until they settle */
  flights: Map<number, Flight>
  /** For reduced motion: blocks step in and batches appear where they rest */
  still: boolean
  /** Second the first blocks came in, to fade them in rather than pop up */
  revealedAt: number | undefined
}

/** A batch on its way from the lane to the bay */
export interface Flight {
  /** Left edge of its first tile in the lane */
  x: number
  /** From one of its tiles to the next, in the lane */
  pitch: number
}

/** Filled in while drawing, for the pointer to find batches by */
export interface BeltFrame {
  hits: BatchHit[]
  /** Tiles at rest in each block drawn, from the first block on the belt */
  landed: number[]
}

/** Where a batch's tiles rest */
export interface BatchHit {
  key: number
  left: number
  top: number
  right: number
  bottom: number
}

/** A block holds at most 21 blobs, so it never gets this many batches */
const KEYS_PER_BLOCK = 64

/** Names one batch of one block, for hovering and dropping it */
export function batchKey(slot: number, indexInBlock: number): number {
  return slot * KEYS_PER_BLOCK + indexInBlock
}

export function findBatch(
  blocks: ReadonlyMap<number, ChainBlock>,
  key: number,
): { slot: number; blockNumber: number; batch: BlobBatch } | undefined {
  const slot = Math.floor(key / KEYS_PER_BLOCK)
  const block = blocks.get(slot)
  if (block?.status !== 'proposed') return undefined
  const batch = block.batches[key - slot * KEYS_PER_BLOCK]
  return batch && { slot, blockNumber: block.blockNumber, batch }
}
