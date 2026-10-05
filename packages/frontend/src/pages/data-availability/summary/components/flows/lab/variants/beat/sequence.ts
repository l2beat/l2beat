import {
  DAY_SECONDS,
  type LabData,
  type LabPoster,
  SLOT_SECONDS,
  SLOTS_PER_DAY,
} from '../../model'
import type { LabBatch } from '../../schedule'

export const EVERYONE_ELSE_ID = 'everyone-else'

/** A row of the sequencer: one project, or all the ones too small for a row */
export interface Track {
  id: string
  /** What the row stands for in tooltips. For everyone else, its members added up */
  poster: LabPoster
  /** Whose batches play on the row, largest first */
  members: LabPoster[]
  isEveryoneElse: boolean
}

/** What one row plays in one block */
export interface Hit {
  track: number
  /** Mostly one. Now and then a project sends two batches into the same block */
  batches: LabBatch[]
  blobs: number
}

export interface Sequence {
  tracks: Track[]
  /** What plays in each block of the day, by slot of the day, by track */
  steps: Hit[][]
  /** The track each poster plays on, by poster index */
  trackOfPoster: number[]
}

/**
 * Lays the day out for the sequencer: a row for each of the largest posters
 * and one for everyone else, and every batch filed under the block it landed
 * in. Ethereum takes data only once a block, so a block is a step.
 */
export function buildSequence(
  data: LabData,
  batches: LabBatch[],
  maxTracks: number,
): Sequence {
  const { posters } = data
  // a lone leftover project is better shown than summed into a row of one
  const ownTracks =
    posters.length <= maxTracks ? posters.length : Math.max(1, maxTracks - 1)
  const tracks: Track[] = posters.slice(0, ownTracks).map((poster) => ({
    id: poster.id,
    poster,
    members: [poster],
    isEveryoneElse: false,
  }))
  const rest = posters.slice(ownTracks)
  if (rest.length > 0) {
    tracks.push({
      id: EVERYONE_ELSE_ID,
      poster: addUpPosters(rest),
      members: rest,
      isEveryoneElse: true,
    })
  }

  const trackOfPoster = posters.map((_, i) => Math.min(i, ownTracks))
  const steps: Hit[][] = Array.from({ length: SLOTS_PER_DAY }, () => [])
  for (const batch of batches) {
    const step = steps[batch.slot]
    const track = trackOfPoster[batch.posterIndex]
    if (!step || track === undefined) continue
    let hit = step.find((h) => h.track === track)
    if (!hit) {
      hit = { track, batches: [], blobs: 0 }
      step.push(hit)
    }
    hit.batches.push(batch)
    hit.blobs += batch.blobs
  }
  for (const step of steps) step.sort((a, b) => a.track - b.track)

  return { tracks, steps, trackOfPoster }
}

/**
 * Visits every block that starts in [from, to), both in seconds of playback.
 * Playback runs on past the end of the day by starting it over, so the step
 * index keeps growing while `steps` is read for the block of the day.
 */
export function forEachStepBetween(
  from: number,
  to: number,
  visit: (step: number, time: number) => void,
) {
  for (
    let step = Math.ceil(from / SLOT_SECONDS);
    step * SLOT_SECONDS < to;
    step++
  ) {
    visit(step, step * SLOT_SECONDS)
  }
}

export function getStepHits(sequence: Sequence, step: number): Hit[] {
  const slot = ((step % SLOTS_PER_DAY) + SLOTS_PER_DAY) % SLOTS_PER_DAY
  return sequence.steps[slot] ?? []
}

/** One batch of a row in a step, as picked out by the pointer */
export function getBatchAt(
  sequence: Sequence,
  { track, step, batch }: { track: number; step?: number; batch?: number },
): LabBatch | undefined {
  if (step === undefined || batch === undefined) return undefined
  return getStepHits(sequence, step).find((hit) => hit.track === track)
    ?.batches[batch]
}

/** The tail of small posters as one, for the row and tooltip that stand for them */
function addUpPosters(members: LabPoster[]): LabPoster {
  const sum = (value: (p: LabPoster) => number) =>
    members.reduce((total, p) => total + value(p), 0)
  const blobs = sum((p) => p.blobs)
  // each sends DAY / interval batches a day; together they send the sum
  const batchesPerDay = sum((p) => DAY_SECONDS / p.cadence.interval)
  const hours = members[0]?.blobsHourly.length ?? 24
  return {
    id: EVERYONE_ELSE_ID,
    name: 'Everyone else',
    iconUrl: undefined,
    href: undefined,
    color: '#8A8F9C',
    posted: sum((p) => p.posted),
    share: sum((p) => p.share),
    blobs,
    blobsHourly: Array.from({ length: hours }, (_, hour) =>
      sum((p) => p.blobsHourly[hour] ?? 0),
    ),
    cadence: {
      interval: DAY_SECONDS / Math.max(batchesPerDay, 1),
      blobsPerBatch: blobs / Math.max(batchesPerDay, 1),
    },
    cadenceMeasured: false,
    rank: members[0]?.rank ?? 0,
  }
}
