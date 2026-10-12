import type { LivePoster } from '../model'
import type { BlobBatch, ChainBlock, PendingBlobBatch } from './beaconChain'
import type { BeltLayers } from './beltLayers'
import type { BeltLayout } from './beltLayout'
import type { BeltPalette } from './beltPalette'
import type { LaneSpot } from './lane'

/** Changes only with props, size or theme */
export interface BeltScene {
  layout: BeltLayout
  palette: BeltPalette
  posters: LivePoster[]
  blocks: ReadonlyMap<number, ChainBlock>
  /** Changed in place as batches come and go */
  pending: ReadonlyMap<string, PendingBlobBatch>
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
  /** The waiting lane, by the batches' keys */
  lane: Map<string, LaneSpot>
  /** Wall-clock second the lane last moved */
  laneAt: number
  /** Whether the lane changed or moved at `laneAt`, so the belt must be painted */
  laneMoving: boolean
  /** Where batches that waited in the lane leave it from, by batch key, until they settle */
  flights: Map<number, Flight>
  /** Reduced motion */
  still: boolean
  revealedAt: number | undefined
  /** Fractional between two slots; undefined while live */
  view: number | undefined
}

/** A batch on its way from the lane to the bay */
export interface Flight {
  /** Left edge of its first tile in the lane */
  x: number
  /** From one of its tiles to the next, in the lane */
  pitch: number
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
