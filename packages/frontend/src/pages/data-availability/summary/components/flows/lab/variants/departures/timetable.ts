import { assert } from '@l2beat/shared-pure'
import { formatBlobs } from '../../../daFlowsUnit'
import { formatPosted } from '../../../formatPosted'
import { DAY_SECONDS, type LabPoster } from '../../model'
import { firstBatchAt, type LabBatch } from '../../schedule'
import type { FlapTone } from './flap'

/** Seconds a row keeps saying it departed, so the eye catches it leaving */
const DEPARTED_SECONDS = 3
/** Seconds before its batch goes that a row starts boarding */
const BOARDING_SECONDS = 15

export type DepartureStatus =
  | { kind: 'scheduled'; inSeconds: number }
  | { kind: 'boarding' }
  | { kind: 'departed' }

/** A poster's batch on the board: the next one, or the one that just left */
export interface Departure {
  poster: LabPoster
  /** Whole second of playback the batch goes at */
  second: number
  blobs: number
  status: DepartureStatus
}

/** Each poster's batches by time, indexed like `LabData.posters` */
export function groupBatchesByPoster(
  batches: LabBatch[],
  posterCount: number,
): LabBatch[][] {
  const schedules = Array.from({ length: posterCount }, (): LabBatch[] => [])
  for (const batch of batches) schedules[batch.posterIndex]?.push(batch)
  return schedules
}

/**
 * Every poster's place on the board at second `now` of playback, soonest
 * first. A batch that left in the last few seconds stays up as departed
 * before its poster moves on to the next one.
 */
export function getDepartures(
  posters: LabPoster[],
  schedules: LabBatch[][],
  now: number,
): Departure[] {
  const departures: Departure[] = []
  posters.forEach((poster, i) => {
    const schedule = schedules[i]
    if (!schedule || schedule.length === 0) return
    departures.push({ poster, ...getDeparture(schedule, now) })
  })
  return departures.sort(
    (a, b) => a.second - b.second || a.poster.rank - b.poster.rank,
  )
}

function getDeparture(
  schedule: LabBatch[],
  now: number,
): Omit<Departure, 'poster'> {
  let current = firstSentFrom(schedule, now - DEPARTED_SECONDS + 1)
  if (current.second > now) {
    const inSeconds = current.second - now
    return {
      second: current.second,
      blobs: current.batch.blobs,
      status:
        inSeconds <= BOARDING_SECONDS
          ? { kind: 'boarding' }
          : { kind: 'scheduled', inSeconds },
    }
  }
  // of two batches that left moments apart, the later one is the news
  for (
    let next = following(schedule, current);
    next.second <= now;
    next = following(schedule, next)
  ) {
    current = next
  }
  return {
    second: current.second,
    blobs: current.batch.blobs,
    status: { kind: 'departed' },
  }
}

/** A batch on the looping playback clock, which runs past the end of the day */
interface Sending {
  batch: LabBatch
  index: number
  day: number
  second: number
}

/** The first batch sent at or after whole second `from` of playback */
function firstSentFrom(schedule: LabBatch[], from: number): Sending {
  const day = Math.floor(from / DAY_SECONDS)
  const index = firstBatchAt(schedule, from - day * DAY_SECONDS)
  return index < schedule.length
    ? sending(schedule, index, day)
    : sending(schedule, 0, day + 1)
}

function following(schedule: LabBatch[], { index, day }: Sending): Sending {
  return index + 1 < schedule.length
    ? sending(schedule, index + 1, day)
    : sending(schedule, 0, day + 1)
}

function sending(schedule: LabBatch[], index: number, day: number): Sending {
  const batch = schedule[index]
  assert(batch, 'Only posters with batches are on the board')
  return {
    batch,
    index,
    day,
    second: day * DAY_SECONDS + Math.floor(batch.time),
  }
}

/**
 * The rows the board has room for, soonest first. A poster picked by the
 * reader keeps its row, taking the last one if it is not due soon.
 */
export function pickShown(
  departures: Departure[],
  count: number,
  pinnedId: string | undefined,
): Departure[] {
  const soonest = departures.slice(0, count)
  if (pinnedId === undefined || soonest.some((d) => d.poster.id === pinnedId)) {
    return soonest
  }
  const pinned = departures.find((d) => d.poster.id === pinnedId)
  return pinned ? [...soonest.slice(0, count - 1), pinned] : soonest
}

/**
 * The time a second of playback stands for, on the reader's own clock, as
 * digits: "115307". Playback replays the day before at this hour, so the
 * board's clock reads as the clock on the wall.
 */
export function formatTimeDigits(
  second: number,
  dayStart: number,
  withSeconds: boolean,
): string {
  const dayOffset = ((second % DAY_SECONDS) + DAY_SECONDS) % DAY_SECONDS
  const date = new Date((dayStart + dayOffset) * 1000)
  const digits = [date.getHours(), date.getMinutes(), date.getSeconds()]
    .slice(0, withSeconds ? 3 : 2)
    .map(pad)
  return digits.join('')
}

/** "Next batch of 3 blobs at 12:29:59", as the tooltip and screen readers say it */
export function describeBatch(departure: Departure, dayStart: number): string {
  const time = formatClockTime(departure.second, dayStart)
  const blobs = formatBlobs(departure.blobs)
  return departure.status.kind === 'departed'
    ? `A batch of ${blobs} left at ${time}`
    : `Next batch of ${blobs} at ${time}`
}

function formatClockTime(second: number, dayStart: number): string {
  const digits = formatTimeDigits(second, dayStart, true)
  return `${digits.slice(0, 2)}:${digits.slice(2, 4)}:${digits.slice(4)}`
}

/** " 5 BLOBS", " 1 BLOB ": counts and words each in a column of their own */
export function formatCargo(blobs: number): string {
  return `${String(blobs).padStart(2)} ${blobs === 1 ? 'BLOB ' : 'BLOBS'}`
}

/**
 * How often a poster sends a batch, rounded to what a board has room for,
 * with the number and the unit each in a column of their own: " 50 SEC",
 * "  2 MIN", "1.5 HRS". A cadence liveness did not measure is a guess, so it
 * says so with a tilde.
 */
export function formatEvery(interval: number, measured: boolean): string {
  const [amount, unit] = roundInterval(interval, measured ? 3 : 2)
  return `${`${measured ? '' : '~'}${amount}`.padStart(3)} ${unit}`
}

/** The interval in at most `digits` characters and its unit */
function roundInterval(seconds: number, digits: number): [string, string] {
  if (seconds < 99.5) return [String(Math.max(1, Math.round(seconds))), 'SEC']
  const minutes = seconds / 60
  if (minutes < 59.5) return [String(Math.round(minutes)), 'MIN']
  const hours = seconds / 3600
  const tenths = String(Math.round(hours * 10) / 10)
  const amount = tenths.length <= digits ? tenths : String(Math.round(hours))
  return [amount, amount === '1' ? 'HR' : 'HRS']
}

export function formatDayTotal(bytes: number): string {
  return formatPosted(bytes).toUpperCase()
}

export function formatStatus(status: DepartureStatus): {
  text: string
  tone: FlapTone
} {
  switch (status.kind) {
    case 'departed':
      return { text: 'DEPARTED', tone: 'amber' }
    case 'boarding':
      return { text: 'BOARDING', tone: 'amber' }
    case 'scheduled':
      return { text: `IN ${formatCountdown(status.inSeconds)}`, tone: 'plain' }
  }
}

/** 0:23, 12:05, then 4H32M for the few posters that send hours apart */
function formatCountdown(seconds: number): string {
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}:${pad(seconds % 60)}`
  }
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return hours < 10 ? `${hours}H${pad(minutes)}M` : `${hours}H`
}

/**
 * A name in the capitals a board has, cut to `length` the way boards shorten
 * destinations: whole words go from the end first, so "Robinhood Chain"
 * becomes ROBINHOOD rather than ROBINHOOD CH.
 */
export function toBoardName(name: string, length: number): string {
  const words = name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toUpperCase()
    .split(/\s+/)
    .filter(Boolean)
  while (words.length > 1 && words.join(' ').length > length) words.pop()
  return words.join(' ').slice(0, length)
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}
