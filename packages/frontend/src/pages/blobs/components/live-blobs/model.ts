import type { DaLayerThroughput } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import type { BlobPoster } from '~/server/features/data-availability/live-blobs/getBlobPosters'
import { getThroughputInForce } from '~/server/features/data-availability/throughput/utils/getThroughputInForce'

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
  const inForce = getThroughputInForce(throughputs, UnixTime.now())
  const max =
    inForce && inForce.size !== 'NO_CAP' ? inForce.size / BLOB_BYTES : 21
  const target = inForce?.target ? inForce.target / BLOB_BYTES : (max * 2) / 3
  return {
    targetBlobsPerBlock: Math.round(target),
    maxBlobsPerBlock: Math.round(max),
  }
}
