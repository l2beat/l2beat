import type { DaLayerThroughput } from '@l2beat/config'
import type { BlobPoster } from '~/server/features/data-availability/live-blobs/getBlobPosters'

const BLOB_BYTES = 128 * 1024

/** A project that may post blobs, or the stand-in for blobs nobody claims */
export interface LivePoster {
  id: string
  name: string
  iconUrl: string | undefined
  href: string | undefined
  /** Brand color, as given. Run it through `readableColor` before drawing */
  color: string
}

export const UNKNOWN_ID = 'unknown'

/**
 * Every project that posts to the DA layer, with blobs that match none of
 * them last. Batches point into this list by index.
 */
export function toLivePosters(projects: BlobPoster[]): LivePoster[] {
  return [
    ...projects,
    {
      id: UNKNOWN_ID,
      name: 'Unknown',
      iconUrl: undefined,
      href: undefined,
      color: '#8A8F9C',
    },
  ]
}

export interface BlockLimits {
  targetBlobsPerBlock: number
  maxBlobsPerBlock: number
}

/** The limits in force now, in blobs per block */
export function getBlockLimits(throughputs: DaLayerThroughput[]): BlockLimits {
  const latest = throughputs
    .toSorted((a, b) => a.sinceTimestamp - b.sinceTimestamp)
    .at(-1)
  const max = latest && latest.size !== 'NO_CAP' ? latest.size / BLOB_BYTES : 21
  const target = latest?.target ? latest.target / BLOB_BYTES : (max * 2) / 3
  return {
    targetBlobsPerBlock: Math.round(target),
    maxBlobsPerBlock: Math.round(max),
  }
}
