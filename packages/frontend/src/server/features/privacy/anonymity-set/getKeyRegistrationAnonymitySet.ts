import type { ProjectPrivacyKeyRegistrationAnonymitySet } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import {
  ANONYMITY_SET_WINDOW_DAYS,
  countSendersByDuration,
  countSendersInWindows,
  type PrivacyAnonymitySetHistoryPoint,
  type PrivacyAnonymitySetHoldingDurationPoint,
} from './calculateAnonymitySets'
import keyRegistrations from './keyRegistrations.json'
import { HOLDING_DURATIONS } from './loadAnonymitySetCharts'

export const KEY_REGISTRATION_ANONYMITY_SET_LABEL = 'Registered recipients'

/** Written by `pnpm privacy-key-registrations` in packages/backend. */
const KEY_REGISTRATIONS: Partial<
  Record<
    string,
    {
      toBlock: number
      toTimestamp: number
      registrations: { timestamp: number; registrant: string }[]
    }
  >
> = keyRegistrations

export interface KeyRegistrationAnonymitySet {
  /** Distinct registrants during the window before `syncedUntil`. */
  value: number
  history: PrivacyAnonymitySetHistoryPoint[]
  holdingDuration: PrivacyAnonymitySetHoldingDurationPoint[]
  /** Start of the UTC day after the last complete day of collected data. */
  syncedUntil: UnixTime
}

export function getKeyRegistrationAnonymitySet(
  projectId: string,
  config: ProjectPrivacyKeyRegistrationAnonymitySet,
): KeyRegistrationAnonymitySet | undefined {
  const data = KEY_REGISTRATIONS[projectId]
  if (data === undefined) return undefined

  // History starts one window after collection, so its first point is a full
  // window count rather than a partial one that would look like a rise.
  const firstEndpoint = UnixTime(
    UnixTime.toStartOf(config.sinceTimestamp, 'day') +
      ANONYMITY_SET_WINDOW_DAYS * UnixTime.DAY,
  )
  const syncedUntil = UnixTime.toStartOf(data.toTimestamp, 'day')
  if (syncedUntil < firstEndpoint) return undefined

  const rows = data.registrations.map(({ registrant, timestamp }) => ({
    sender: registrant,
    timestamp,
  }))
  const endpoints = generateTimestamps([firstEndpoint, syncedUntil], 'day')
  const values = countSendersInWindows(rows, endpoints)
  const holdingValues = countSendersByDuration(
    rows,
    syncedUntil,
    HOLDING_DURATIONS,
  )

  return {
    value: values.at(-1) ?? 0,
    history: endpoints.map((timestamp, index) => [
      timestamp,
      values[index] ?? 0,
    ]),
    holdingDuration: HOLDING_DURATIONS.map((days, index) => [
      days,
      holdingValues[index] ?? 0,
    ]),
    syncedUntil,
  }
}
