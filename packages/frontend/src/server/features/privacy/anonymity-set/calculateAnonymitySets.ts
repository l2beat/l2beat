import type {
  PrivacyAnonymitySetSenderDayRecord,
  PrivacyNoteRecord,
  PrivacyNoteStatusChangeRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type { PrivacyAnonymitySetSeries } from './getPrivacyAnonymitySetSeries'

/** Length of the rolling window, in UTC days. */
export const ANONYMITY_SET_WINDOW_DAYS = 30

export type PrivacyAnonymitySetHistoryPoint = [
  timestamp: number,
  ...values: number[],
]

export type PrivacyAnonymitySetHoldingDurationPoint = [
  days: number,
  ...values: number[],
]

/** Everything the calculation reads; each unit uses only its own tables. */
export interface PrivacyAnonymitySetRecords {
  senderDays: PrivacyAnonymitySetSenderDayRecord[]
  notes: PrivacyNoteRecord[]
  noteStatusChanges: PrivacyNoteStatusChangeRecord[]
}

export function calculateAnonymitySetHistory(
  records: PrivacyAnonymitySetRecords,
  series: PrivacyAnonymitySetSeries[],
  endpoints: number[],
): PrivacyAnonymitySetHistoryPoint[] {
  const valuesBySeries = series.map((item) =>
    item.unit === 'note'
      ? calculateActiveNoteHistory(records, item, endpoints)
      : calculateSeriesHistory(records.senderDays, item, endpoints),
  )

  return endpoints.map((timestamp, index) => [
    timestamp,
    ...valuesBySeries.map((values) => values[index] ?? 0),
  ])
}

export function calculateAnonymitySetHoldingDuration(
  rows: PrivacyAnonymitySetSenderDayRecord[],
  series: PrivacyAnonymitySetSeries[],
  endpoint: number,
  durations: number[],
): PrivacyAnonymitySetHoldingDurationPoint[] {
  if (durations.length === 0) return []

  const maximumDays = Math.max(...durations)
  const valuesBySeries = series.map((item) => {
    const threshold = BigInt(item.minimumAmount)
    const latestBySender = new Map<string, number>()

    for (const row of rows) {
      if (
        row.projectId !== item.projectId ||
        row.bucketId !== item.bucketId ||
        row.maximumAmount < threshold ||
        row.timestamp >= endpoint
      ) {
        continue
      }

      const current = latestBySender.get(row.sender)
      if (current === undefined || row.timestamp > current) {
        latestBySender.set(row.sender, row.timestamp)
      }
    }

    const additions = new Array<number>(maximumDays + 1).fill(0)
    for (const timestamp of latestBySender.values()) {
      const age = endpoint - timestamp
      const firstQualifyingDay = Math.ceil(age / UnixTime.DAY)
      if (firstQualifyingDay <= maximumDays) {
        const index = Math.max(1, firstQualifyingDay)
        additions[index] = (additions[index] ?? 0) + 1
      }
    }

    const result = new Array<number>(maximumDays + 1).fill(0)
    for (let day = 1; day <= maximumDays; day++) {
      result[day] = (result[day - 1] ?? 0) + (additions[day] ?? 0)
    }
    return result
  })

  return durations.map((days) => [
    days,
    ...valuesBySeries.map((values) => values[days] ?? 0),
  ])
}

function calculateSeriesHistory(
  rows: PrivacyAnonymitySetSenderDayRecord[],
  series: PrivacyAnonymitySetSeries,
  endpoints: number[],
): number[] {
  const threshold = BigInt(series.minimumAmount)
  const qualifyingRows = rows
    .filter(
      (row) =>
        row.projectId === series.projectId &&
        row.bucketId === series.bucketId &&
        row.maximumAmount >= threshold,
    )
    .sort((a, b) => a.timestamp - b.timestamp)

  const countsBySender = new Map<string, number>()
  const result: number[] = []
  let addIndex = 0
  let removeIndex = 0

  for (const endpoint of endpoints) {
    while (addIndex < qualifyingRows.length) {
      const row = qualifyingRows[addIndex]
      if (row === undefined || row.timestamp >= endpoint) break

      countsBySender.set(row.sender, (countsBySender.get(row.sender) ?? 0) + 1)
      addIndex++
    }

    const windowStart = endpoint - ANONYMITY_SET_WINDOW_DAYS * UnixTime.DAY
    while (removeIndex < addIndex) {
      const row = qualifyingRows[removeIndex]
      if (row === undefined || row.timestamp >= windowStart) break

      const remaining = (countsBySender.get(row.sender) ?? 0) - 1
      if (remaining === 0) {
        countsBySender.delete(row.sender)
      } else {
        countsBySender.set(row.sender, remaining)
      }
      removeIndex++
    }

    result.push(countsBySender.size)
  }

  return result
}

interface WindowNote {
  note: PrivacyNoteRecord
  active: boolean
}

/**
 * Replays deposits and status changes up to each endpoint, so a point never
 * sees state from after its own day. A status change for a note that is not
 * in the window cannot affect any later point, so it is ignored.
 */
function calculateActiveNoteHistory(
  records: PrivacyAnonymitySetRecords,
  series: PrivacyAnonymitySetSeries,
  endpoints: number[],
): number[] {
  const threshold = BigInt(series.minimumAmount)
  const deposits = records.notes
    .filter((note) => note.configurationId === series.configurationId)
    .toSorted((a, b) => a.timestamp - b.timestamp)
  const statusChanges = records.noteStatusChanges
    .filter((change) => change.configurationId === series.configurationId)
    .toSorted(
      (a, b) => a.blockNumber - b.blockNumber || a.logIndex - b.logIndex,
    )

  const windowNotes = new Map<number, WindowNote>()
  const result: number[] = []
  let addIndex = 0
  let statusIndex = 0
  let removeIndex = 0

  for (const endpoint of endpoints) {
    while (addIndex < deposits.length) {
      const note = deposits[addIndex]
      if (note === undefined || note.timestamp >= endpoint) break

      windowNotes.set(note.noteId, { note, active: true })
      addIndex++
    }

    while (statusIndex < statusChanges.length) {
      const change = statusChanges[statusIndex]
      if (change === undefined || change.timestamp >= endpoint) break

      const windowNote = windowNotes.get(change.noteId)
      if (windowNote !== undefined) windowNote.active = change.active
      statusIndex++
    }

    const windowStart = endpoint - ANONYMITY_SET_WINDOW_DAYS * UnixTime.DAY
    while (removeIndex < addIndex) {
      const note = deposits[removeIndex]
      if (note === undefined || note.timestamp >= windowStart) break

      windowNotes.delete(note.noteId)
      removeIndex++
    }

    let count = 0
    for (const windowNote of windowNotes.values()) {
      if (isAnonymitySetNote(windowNote, threshold, endpoint)) count++
    }
    result.push(count)
  }

  return result
}

function isAnonymitySetNote(
  { note, active }: WindowNote,
  threshold: bigint,
  endpoint: number,
): boolean {
  return active && note.amount >= threshold && note.expiresAt >= endpoint
}
