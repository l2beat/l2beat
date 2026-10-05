import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import type {
  IndexerConfigurationRecord,
  PrivacyAnonymitySetSenderDayRecord,
} from '@l2beat/database'
import { UnixTime, unique } from '@l2beat/shared-pure'
import type { PrivacyAnonymitySetSeries } from './getPrivacyAnonymitySetSeries'

/**
 * Prototype: reads Starknet (STRK-20) anonymity set events from the JSON file
 * written by the backend's StarknetPrivacyAnonymitySetIndexer /
 * `pnpm privacy:starknet-anonymity-set`, instead of PrivacyAnonymitySetEvent.
 * The file is committed next to the frontend so its Docker image, which does
 * not include the backend package, contains it.
 */
const JSON_FILE =
  process.env.PRIVACY_STARKNET_ANONYMITY_SET_FILE ??
  resolve(process.cwd(), 'data/privacy/privacy-starknet-anonymity-set.json')

interface JsonAnonymitySetEvent {
  configurationId: string
  projectId: string
  bucketId: string
  timestamp: number
  sender: string
  amount: string
}

let cached: { mtimeMs: number; events: JsonAnonymitySetEvent[] } | undefined

function readEvents(): JsonAnonymitySetEvent[] {
  if (!existsSync(JSON_FILE)) return []
  const { mtimeMs } = statSync(JSON_FILE)
  if (cached?.mtimeMs !== mtimeMs) {
    cached = {
      mtimeMs,
      events: JSON.parse(readFileSync(JSON_FILE, 'utf8')),
    }
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
