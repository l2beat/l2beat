import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import type {
  IndexerConfigurationRecord,
  PrivacyAnonymitySetSenderDayRecord,
} from '@l2beat/database'
import { UnixTime, unique } from '@l2beat/shared-pure'
import type { PrivacyAnonymitySetSeries } from './getPrivacyAnonymitySetSeries'

/**
 * Prototype: reads anonymity set events from the JSON files written by the
 * backend instead of PrivacyAnonymitySetEvent:
 * - Starknet (STRK-20) deposits, by StarknetPrivacyAnonymitySetIndexer /
 *   `pnpm privacy:starknet-anonymity-set`
 * - key registrations (Umbra), by PrivacyKeyRegistrationIndexer /
 *   `pnpm privacy:key-registration-anonymity-set`
 * The files are committed next to the frontend so its Docker image, which
 * does not include the backend package, contains them.
 */
const JSON_FILES = [
  process.env.PRIVACY_STARKNET_ANONYMITY_SET_FILE ??
    resolve(process.cwd(), 'data/privacy/privacy-starknet-anonymity-set.json'),
  process.env.PRIVACY_KEY_REGISTRATION_ANONYMITY_SET_FILE ??
    resolve(
      process.cwd(),
      'data/privacy/privacy-key-registration-anonymity-set.json',
    ),
]

interface JsonAnonymitySetEvent {
  configurationId: string
  projectId: string
  bucketId: string
  timestamp: number
  sender: string
  amount: string
}

const cache = new Map<
  string,
  { mtimeMs: number; events: JsonAnonymitySetEvent[] }
>()

function readEvents(): JsonAnonymitySetEvent[] {
  return JSON_FILES.flatMap(readFileEvents)
}

function readFileEvents(file: string): JsonAnonymitySetEvent[] {
  if (!existsSync(file)) return []
  const { mtimeMs } = statSync(file)
  let cached = cache.get(file)
  if (cached?.mtimeMs !== mtimeMs) {
    cached = { mtimeMs, events: JSON.parse(readFileSync(file, 'utf8')) }
    cache.set(file, cached)
  }
  return cached.events
}

/** JSON equivalent of PrivacyAnonymitySetEventRepository.getSenderDaysByProjectIds. */
export function getJsonSenderDaysByProjectIds(
  projectIds: string[],
  fromInclusive: UnixTime,
  toExclusive: UnixTime,
): PrivacyAnonymitySetSenderDayRecord[] {
  const projects = new Set(projectIds)
  const senderDays = new Map<string, PrivacyAnonymitySetSenderDayRecord>()

  for (const event of readEvents()) {
    if (
      !projects.has(event.projectId) ||
      event.timestamp < fromInclusive ||
      event.timestamp >= toExclusive
    ) {
      continue
    }

    const timestamp = UnixTime.toStartOf(UnixTime(event.timestamp), 'day')
    const key = `${event.projectId}:${event.bucketId}:${event.sender}:${timestamp}`
    const amount = BigInt(event.amount)
    const current = senderDays.get(key)
    if (current === undefined) {
      senderDays.set(key, {
        projectId: event.projectId,
        bucketId: event.bucketId,
        timestamp,
        sender: event.sender,
        maximumAmount: amount,
      })
    } else if (amount > current.maximumAmount) {
      current.maximumAmount = amount
    }
  }

  return Array.from(senderDays.values()).sort(
    (a, b) => a.timestamp - b.timestamp,
  )
}

/**
 * Stand-in for the indexer configuration records used to decide sync status.
 * The file carries no indexer state, so series present in it are treated as
 * synced up to `target`; series absent from it (e.g. EVM projects) stay
 * syncing.
 */
export function getJsonAnonymitySetConfigurations(
  series: PrivacyAnonymitySetSeries[],
  target: UnixTime,
): IndexerConfigurationRecord[] {
  const available = new Set(readEvents().map((event) => event.configurationId))
  return unique(series.map((item) => item.configurationId))
    .filter((id) => available.has(id))
    .map((id) => ({
      id,
      indexerId: 'privacy_starknet_anonymity_set_json',
      properties: '{}',
      currentHeight: target,
      minHeight: 0,
      maxHeight: null,
    }))
}
