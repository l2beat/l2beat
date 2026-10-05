import type { DaLayerThroughput } from '@l2beat/config'
import type { DaFlowsData } from '~/server/features/data-availability/flows/getDaFlows'
import type { DaFlowsProject } from '~/server/features/data-availability/flows/getDaFlowsProjects'
import { buildDaFlowsGraph } from '../buildDaFlowsGraph'

export const BLOB_BYTES = 128 * 1024
export const SLOT_SECONDS = 12
export const DAY_SECONDS = 24 * 60 * 60
export const SLOTS_PER_DAY = DAY_SECONDS / SLOT_SECONDS

/** A project that posted blobs over the day, with everything a variant draws */
export interface LabPoster {
  id: string
  name: string
  iconUrl: string | undefined
  href: string | undefined
  /** Brand color, as given. Run it through `readableColor` before drawing */
  color: string
  /** Bytes posted over the day */
  posted: number
  /** Of everything posted over the day, 0–1 */
  share: number
  /** Blobs posted over the day */
  blobs: number
  /** Blobs posted in each hour of the day, oldest first */
  blobsHourly: number[]
  /** On average, a batch of `blobsPerBatch` blobs every `interval` seconds */
  cadence: { interval: number; blobsPerBatch: number }
  /**
   * Whether liveness measured how often it sends batches. When it did not,
   * the cadence is a guess of one blob at a time
   */
  cadenceMeasured: boolean
  /** 0 for the largest poster */
  rank: number
}

export interface LabData {
  daLayer: DaFlowsProject
  /** Largest first */
  posters: LabPoster[]
  totalPosted: number
  totalBlobs: number
  usedSevenDaysAgo: number
  /** The day played back, unix seconds [from, to) */
  range: [number, number]
  /** Blobs a block aims for. Above it the blob fee rises */
  targetBlobsPerBlock: number
  /** Blobs a block can hold at most */
  maxBlobsPerBlock: number
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

export function toLabData(
  daLayer: DaFlowsProject,
  projects: DaFlowsProject[],
  data: DaFlowsData,
  limits: BlockLimits,
): LabData {
  // the graph already knows how to name posters and size their batches. The
  // size of its ring does not matter, only its list of every poster is used
  const graph = buildDaFlowsGraph(
    daLayer,
    projects,
    data,
    Number.POSITIVE_INFINITY,
    BLOB_BYTES,
  )
  const colors = new Map(projects.map((p) => [p.id, p.color]))
  const hours = Math.round((data.range[1] - data.range[0]) / 3600)

  const posters = graph.posters.map((poster, rank): LabPoster => {
    const blobs = poster.posted / BLOB_BYTES
    const hourly = data.postedHourly[poster.id]
    const blobsHourly = hourly
      ? hourly.map((bytes) => bytes / BLOB_BYTES)
      : Array(hours).fill(blobs / hours)
    return {
      id: poster.id,
      name: poster.name,
      iconUrl: poster.iconUrl,
      href: poster.href,
      color: colors.get(poster.id) ?? '#8A8F9C',
      posted: poster.posted,
      share: poster.share,
      blobs,
      blobsHourly,
      cadence: poster.batch
        ? {
            interval: poster.batch.interval,
            blobsPerBatch: poster.batch.size / BLOB_BYTES,
          }
        : { interval: DAY_SECONDS / Math.max(blobs, 1), blobsPerBatch: 1 },
      cadenceMeasured: poster.batch !== undefined,
      rank,
    }
  })

  return {
    daLayer,
    posters,
    totalPosted: graph.totalPosted,
    totalBlobs: graph.totalPosted / BLOB_BYTES,
    usedSevenDaysAgo: data.usedSevenDaysAgo,
    range: data.range,
    ...limits,
  }
}
