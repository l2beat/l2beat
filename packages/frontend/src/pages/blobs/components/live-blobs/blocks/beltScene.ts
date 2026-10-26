import type { LivePoster } from '../model'
import type { BlobBatch, ChainBlock } from './beaconChain'
import type { BeltLayers } from './beltLayers'
import type { BeltLayout } from './beltLayout'
import type { BeltPalette } from './beltPalette'

/** Changes only with props, size or theme */
export interface BeltScene {
  layout: BeltLayout
  palette: BeltPalette
  posters: LivePoster[]
  blocks: ReadonlyMap<number, ChainBlock>
  /** By poster index; missing until loaded */
  icons: (HTMLCanvasElement | undefined)[]
  layers: BeltLayers
  targetBlobs: number
  maxBlobs: number
}

export interface Playback {
  /** Fractional slots since genesis */
  progress: number
  /** Second each batch starts to drop, by batch key, until it settles */
  arrivals: Map<number, number>
  /** Reduced motion */
  still: boolean
  revealedAt: number | undefined
  /** Fractional between two slots; undefined while live */
  view: number | undefined
}

/** Filled in while drawing, for hit-testing */
export interface BeltFrame {
  hits: BatchHit[]
  /** Per block drawn, from the first block on the belt */
  landed: number[]
}

export interface BatchHit {
  key: number
  left: number
  top: number
  right: number
  bottom: number
}

/** A block holds at most 21 blobs, so it never gets this many batches */
const KEYS_PER_BLOCK = 64

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
