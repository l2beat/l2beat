import type { LivePoster } from '../model'
import type { BlobBatch, ChainBlock } from './beaconChain'
import type { BeltLayers } from './beltLayers'
import type { BeltLayout } from './beltLayout'
import type { BeltPalette } from './beltPalette'

/** What the belt is drawn from that changes only with props, size or theme */
export interface BeltScene {
  layout: BeltLayout
  palette: BeltPalette
  posters: LivePoster[]
  /** Recent blocks by slot, filled in as they come */
  blocks: ReadonlyMap<number, ChainBlock>
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
  /** For reduced motion: blocks step in and batches appear where they rest */
  still: boolean
  /** Second the first blocks came in, to fade them in rather than pop up */
  revealedAt: number | undefined
  /**
   * Where the belt stands while looking back through the hour: the slot in
   * the bay, fractional on the way between two. Undefined while live
   */
  view: number | undefined
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
