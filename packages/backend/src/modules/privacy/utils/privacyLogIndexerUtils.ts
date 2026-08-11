import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { BlockProvider } from '@l2beat/shared'
import {
  assert,
  type EthereumAddress,
  type Log,
  UnixTime,
  unique,
} from '@l2beat/shared-pure'
import type { Configuration } from '../../../tools/uif/multi/types'

interface PrivacyLogIndexerConfig {
  address: EthereumAddress
  event: string
}

export async function resolvePrivacyBlockRange(
  repository: Database['privacyBlockTimestamp'],
  chain: string,
  from: number,
  to: number,
): Promise<{ blockFrom: number; blockTo: number }> {
  const adjustedFrom = UnixTime.toStartOf(from, 'hour')
  const adjustedTo = UnixTime.toEndOf(to, 'hour')
  const [blockFrom, blockTo] = await Promise.all([
    repository.findBlockNumberByChainAndTimestamp(chain, adjustedFrom),
    repository.findBlockNumberByChainAndTimestamp(chain, adjustedTo),
  ])

  assert(
    blockFrom !== undefined,
    `Missing block timestamp mapping for ${chain}: from=${adjustedFrom}`,
  )
  assert(
    blockTo !== undefined,
    `Missing block timestamp mapping for ${chain}: to=${adjustedTo}`,
  )

  return { blockFrom, blockTo }
}

export async function buildPrivacyBlockTimestampLookup(
  logs: Log[],
  blockProvider: BlockProvider,
  logger: Logger,
): Promise<Map<number, UnixTime>> {
  const logsWithoutTimestamps = logs.filter(
    (log) => log.blockTimestamp === undefined,
  )
  const logsWithTimestamps = logs
    .map((log) => [log.blockNumber, log.blockTimestamp])
    .filter((entry): entry is [number, number] => entry[1] !== undefined)

  const lookup = new Map<number, UnixTime>(logsWithTimestamps)

  if (logsWithoutTimestamps.length === 0) {
    return lookup
  }

  logger.info('Fetching block timestamps for logs without timestamps', {
    logsWithTimestamps: logsWithTimestamps.length,
    logsWithoutTimestamps: logsWithoutTimestamps.length,
    blocksWithTimestamps: unique(logsWithTimestamps.map((log) => log[0]))
      .length,
    blocksWithoutTimestamps: unique(
      logsWithoutTimestamps.map((log) => log.blockNumber),
    ).length,
  })

  const timestamps = await blockProvider.getBlockTimestamps(
    unique(logsWithoutTimestamps.map((log) => log.blockNumber)),
  )
  for (const [blockNumber, timestamp] of timestamps) {
    lookup.set(blockNumber, timestamp)
  }

  return lookup
}

export function buildPrivacyLogFilter<T extends PrivacyLogIndexerConfig>(
  configurations: Configuration<T>[],
): { addresses: string[]; events: string[] } {
  const addresses = Array.from(
    new Set(configurations.map((c) => c.properties.address.toString())),
  )
  const events = Array.from(
    new Set(configurations.map((c) => c.properties.event)),
  )

  return { addresses, events }
}

export function buildPrivacyLogConfigMap<T extends PrivacyLogIndexerConfig>(
  configurations: Configuration<T>[],
): Map<string, Configuration<T>[]> {
  const configMap = new Map<string, Configuration<T>[]>()

  for (const configuration of configurations) {
    const key = getPrivacyLogConfigKey(
      configuration.properties.address.toString(),
      configuration.properties.event,
    )
    const existing = configMap.get(key) ?? []
    existing.push(configuration)
    configMap.set(key, existing)
  }

  return configMap
}

export function getPrivacyLogConfigKey(
  address: string,
  event: string | undefined,
): string {
  return `${address.toLowerCase()}:${event?.toLowerCase() ?? ''}`
}
