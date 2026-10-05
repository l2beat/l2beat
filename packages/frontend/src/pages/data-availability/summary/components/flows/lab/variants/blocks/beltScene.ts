import type { LabPoster } from '../../model'
import type { LabBatch } from '../../schedule'
import type { BeltLayers } from './beltLayers'
import type { BeltLayout } from './beltLayout'
import type { BeltPalette } from './beltPalette'
import type { DayBlocks } from './dayBlocks'

/** What the belt is drawn from that changes only with props, size or theme */
export interface BeltScene {
  layout: BeltLayout
  palette: BeltPalette
  posters: LabPoster[]
  batches: LabBatch[]
  blocks: DayBlocks
  /** Round icons sized for a tile, by poster index; missing until loaded */
  icons: (HTMLCanvasElement | undefined)[]
  /** What looks the same on every frame, painted once */
  layers: BeltLayers
  /** Index of the highlighted poster. The others step back */
  highlighted: number | undefined
  targetBlobs: number
  maxBlobs: number
}

/** What moves: the playback clock and the batches still settling in */
export interface Playback {
  /** Seconds of the day played back, going past its end as the day loops */
  time: number
  /** 1 while playing; eased to 0 while a batch is hovered, so it holds still */
  speed: number
  /** Wall-clock second each batch arrived at, by batch key, until it settles */
  arrivals: Map<number, number>
  /** Wall-clock second the bay took its block, to roll the slot number over */
  bayChangedAt: number
}

/** Filled in while drawing, for the pointer to find batches by */
export interface BeltFrame {
  hits: BatchHit[]
  /** Tiles at rest in each block drawn, from the first block on the belt */
  landed: number[]
  /** Tiles of the highlighted poster clear of the faded end of the belt */
  highlightedInView: number
}

/** Where a batch's tiles rest */
export interface BatchHit {
  key: number
  left: number
  top: number
  right: number
  bottom: number
}
