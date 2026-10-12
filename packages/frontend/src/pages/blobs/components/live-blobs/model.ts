import type { DaLayerThroughput } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import type { BlobPoster } from '~/server/features/data-availability/live-blobs/getBlobPosters'
import type { Posted } from '~/server/features/data-availability/live-blobs/LiveBlobsFeed'
import { getThroughputInForce } from '~/server/features/data-availability/throughput/utils/getThroughputInForce'

const BLOB_BYTES = 128 * 1024

/** Or the stand-in for blobs nobody claims */
export interface LivePoster {
  id: string
  name: string
  iconUrl: string | undefined
  href: string | undefined
  /** As given. Run it through `readableColor` before drawing */
  color: string
}

export const UNKNOWN_ID = 'unknown'

/** The unknown stand-in goes last. Batches point into this list by index */
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

export interface PosterTotal {
  poster: LivePoster
  blobs: number
  batches: number
  lastSlot: number
  lastBlobs: number
  buckets: number[]
}

/**
 * Blobs of a project the page does not know of, an archived one's included,
 * go to the unknown poster, as the belt draws them
 */
export function totalByPoster(posted: Posted[], posters: LivePoster[]) {
  const byId = new Map(posters.map((poster) => [poster.id, poster]))
  const totals = new Map<string, PosterTotal>()
  let blobs = 0
  for (const p of posted) {
    blobs += p.blobs
    const poster = byId.get(p.projectId ?? UNKNOWN_ID) ?? byId.get(UNKNOWN_ID)
    if (!poster) continue
    const total = totals.get(poster.id)
    if (!total) {
      totals.set(poster.id, { poster, ...p, buckets: [...p.buckets] })
      continue
    }
    total.blobs += p.blobs
    total.batches += p.batches
    p.buckets.forEach((bucket, i) => {
      total.buckets[i] = (total.buckets[i] ?? 0) + bucket
    })
    if (p.lastSlot > total.lastSlot) {
      total.lastSlot = p.lastSlot
      total.lastBlobs = p.lastBlobs
    } else if (p.lastSlot === total.lastSlot) {
      total.lastBlobs += p.lastBlobs
    }
  }
  return {
    posters: [...totals.values()].sort((a, b) => b.blobs - a.blobs),
    blobs,
  }
}

export type PosterTotals = ReturnType<typeof totalByPoster>

export interface BlockLimits {
  targetBlobsPerBlock: number
  maxBlobsPerBlock: number
}

/** In blobs per block */
export function getBlockLimits(
  throughputs: DaLayerThroughput[],
  now = UnixTime.now(),
): BlockLimits {
  const inForce = getThroughputInForce(throughputs, now)
  const max =
    inForce && inForce.size !== 'NO_CAP' ? inForce.size / BLOB_BYTES : 21
  const target = inForce?.target ? inForce.target / BLOB_BYTES : (max * 2) / 3
  return {
    targetBlobsPerBlock: Math.round(target),
    maxBlobsPerBlock: Math.round(max),
  }
}

export function nextLimitsIn(
  throughputs: DaLayerThroughput[],
  now: number,
): number | undefined {
  const next = throughputs
    .map((t) => t.sinceTimestamp)
    .filter((since) => since > now)
    .sort((a, b) => a - b)[0]
  return next === undefined ? undefined : next - now
}
