import { formatSeconds } from '@l2beat/shared-pure'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatBlobs } from '../../../daFlowsUnit'
import {
  DAY_SECONDS,
  type LabData,
  type LabPoster,
  SLOT_SECONDS,
  SLOTS_PER_DAY,
} from '../../model'

// Ethereum's beacon chain started at this unix second, with slot 0
const BEACON_GENESIS = 1606824023

/**
 * Ethereum's number for the slot of a block of the day. The day's blocks
 * start at midnight while Ethereum's slots run from its genesis, so the two
 * are a little apart: a block is named by the slot of its middle.
 */
export function getSlotNumber(dayStart: number, step: number): number {
  const middle =
    dayStart + mod(step, SLOTS_PER_DAY) * SLOT_SECONDS + SLOT_SECONDS / 2
  return Math.floor((middle - BEACON_GENESIS) / SLOT_SECONDS)
}

/** "11:42", in UTC, at `seconds` of playback into a day starting at `dayStart` */
export function formatClockTime(dayStart: number, seconds: number): string {
  const date = new Date((dayStart + mod(seconds, DAY_SECONDS)) * 1000)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`
}

/** 96 → "1.6 minutes": how much of the day goes by in a second of playback */
export function formatTimeScale(seconds: number): string {
  if (seconds < 60) return `${seconds} seconds`
  return `${Math.round((seconds / 60) * 10) / 10} minutes`
}

/** "Hemi, Lighter, Blast and 24 more" */
export function describeMembers(members: LabPoster[]): string {
  const named = members.slice(0, 3).map((p) => p.name)
  const more = members.length - named.length
  if (more > 0) return `${named.join(', ')} and ${more} more`
  return named.join(', ').replace(/, ([^,]*)$/, ' and $1')
}

/** What the canvas shows, for those who cannot see it */
export function describeSequencer(data: LabData): string {
  const [first, ...rest] = data.posters
  const intro =
    'A step sequencer replaying a day of blob batches on Ethereum: a row per project, a column per 12-second block and a note per batch, with batch timing simulated from hourly totals.'
  if (!first) return intro
  const cadence = (p: LabPoster) =>
    `${formatBlobs(p.cadence.blobsPerBatch)} every ${formatSeconds(p.cadence.interval, { fullUnit: true })}`
  const parts = [
    `${first.name} posts the most, ${formatPercent(first.share)} of the data, ${cadence(first)}`,
    ...rest
      .slice(0, 2)
      .map((p) => `${p.name} ${formatPercent(p.share)}, ${cadence(p)}`),
  ]
  return `${intro} ${parts.join('; ')}.`
}

function mod(value: number, by: number): number {
  return ((value % by) + by) % by
}
