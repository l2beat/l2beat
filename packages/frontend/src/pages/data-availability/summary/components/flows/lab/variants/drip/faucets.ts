import { DAY_SECONDS, type LabData, type LabPoster } from '../../model'
import type { LabBatch } from '../../schedule'

export const OTHERS_ID = 'others'
export const OTHERS_COLOR = '#8A8F9C'

/**
 * A spout on the rail. Each of the largest posters gets one; everyone past
 * them shares the last one, so the drawing still holds the whole day.
 */
export interface Faucet {
  id: string
  /** What the tooltip tells. Made up as a sum for the shared spout */
  poster: LabPoster
  /** Posters dripping from it: one, or the whole tail */
  members: LabPoster[]
  isOthers: boolean
  /** Its batches over the day, by time */
  timeline: FaucetBatch[]
}

export interface FaucetBatch {
  /** Seconds into the day, or on the looping playback clock once looked up */
  time: number
  blobs: number
  posterIndex: number
}

export interface FaucetSet {
  faucets: Faucet[]
  /** The faucet each poster drips from, by its index in `LabData.posters` */
  faucetOfPoster: Int16Array
}

export function buildFaucets(
  data: LabData,
  batches: LabBatch[],
  topCount: number,
): FaucetSet {
  // a shared spout for a single poster would hide its name for nothing
  const ownCount =
    data.posters.length <= topCount + 1 ? data.posters.length : topCount
  const top = data.posters.slice(0, ownCount)
  const tail = data.posters.slice(ownCount)
  const faucetCount = top.length + (tail.length > 0 ? 1 : 0)

  const faucetOfPoster = new Int16Array(data.posters.length)
  data.posters.forEach((_, i) => {
    faucetOfPoster[i] = Math.min(i, faucetCount - 1)
  })

  const timelines: FaucetBatch[][] = Array.from(
    { length: faucetCount },
    () => [],
  )
  for (const batch of batches) {
    const faucet = faucetOfPoster[batch.posterIndex] ?? faucetCount - 1
    timelines[faucet]?.push({
      time: batch.time,
      blobs: batch.blobs,
      posterIndex: batch.posterIndex,
    })
  }

  const faucets: Faucet[] = top.map((poster, i) => ({
    id: poster.id,
    poster,
    members: [poster],
    isOthers: false,
    timeline: timelines[i] ?? [],
  }))
  if (tail.length > 0) {
    const timeline = timelines[faucetCount - 1] ?? []
    faucets.push({
      id: OTHERS_ID,
      poster: sumPosters(tail, timeline.length, ownCount),
      members: tail,
      isOthers: true,
      timeline,
    })
  }
  return { faucets, faucetOfPoster }
}

/** The faucet's first batch after `time`, a time on the looping playback clock */
export function batchAfter(
  timeline: FaucetBatch[],
  time: number,
): FaucetBatch | undefined {
  const first = timeline[0]
  if (!first) return undefined
  const dayStart = Math.floor(time / DAY_SECONDS) * DAY_SECONDS
  const index = firstAfter(timeline, time - dayStart)
  const batch = timeline[index]
  return batch
    ? { ...batch, time: dayStart + batch.time }
    : { ...first, time: dayStart + DAY_SECONDS + first.time }
}

/** The faucet's last batch at or before `time`, a time on the looping playback clock */
export function batchAtOrBefore(
  timeline: FaucetBatch[],
  time: number,
): FaucetBatch | undefined {
  const last = timeline.at(-1)
  if (!last) return undefined
  const dayStart = Math.floor(time / DAY_SECONDS) * DAY_SECONDS
  const index = firstAfter(timeline, time - dayStart) - 1
  const batch = timeline[index]
  return batch
    ? { ...batch, time: dayStart + batch.time }
    : { ...last, time: dayStart - DAY_SECONDS + last.time }
}

function firstAfter(timeline: FaucetBatch[], timeOfDay: number) {
  let low = 0
  let high = timeline.length
  while (low < high) {
    const middle = (low + high) >>> 1
    if ((timeline[middle]?.time ?? Number.POSITIVE_INFINITY) <= timeOfDay)
      low = middle + 1
    else high = middle
  }
  return low
}

/** The tail as one poster, so the shared spout reads like any other */
function sumPosters(
  tail: LabPoster[],
  batchCount: number,
  rank: number,
): LabPoster {
  const blobs = tail.reduce((sum, p) => sum + p.blobs, 0)
  const hours = tail[0]?.blobsHourly.length ?? 24
  return {
    id: OTHERS_ID,
    name: 'Others',
    iconUrl: undefined,
    href: undefined,
    color: OTHERS_COLOR,
    posted: tail.reduce((sum, p) => sum + p.posted, 0),
    share: tail.reduce((sum, p) => sum + p.share, 0),
    blobs,
    blobsHourly: Array.from({ length: hours }, (_, hour) =>
      tail.reduce((sum, p) => sum + (p.blobsHourly[hour] ?? 0), 0),
    ),
    cadence: {
      interval: DAY_SECONDS / Math.max(batchCount, 1),
      blobsPerBatch: blobs / Math.max(batchCount, 1),
    },
    // the batches of many projects together have no measured rhythm
    cadenceMeasured: false,
    rank,
  }
}
