import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { BlockProvider, LogsProvider } from '@l2beat/shared'
import {
  assert,
  type EthereumAddress,
  type Log,
  UnixTime,
  unique,
} from '@l2beat/shared-pure'
import type { Configuration } from '../../../tools/uif/multi/types'
import type { PrivacyLogTopicFilter } from '../types'

interface PrivacyLogIndexerConfig {
  address: EthereumAddress
  event: string
  topics?: PrivacyLogTopicFilter
}

export interface PrivacyLogMatch<T extends PrivacyLogIndexerConfig> {
  log: Log
  timestamp: UnixTime
  configuration: Configuration<T>
}

export async function fetchPrivacyLogMatches<T extends PrivacyLogIndexerConfig>(
  configurations: Configuration<T>[],
  deps: {
    chain: string
    from: number
    to: number
    privacyBlockTimestamp: Database['privacyBlockTimestamp']
    logsProvider: LogsProvider
    blockProvider: BlockProvider
    logger: Logger
  },
): Promise<PrivacyLogMatch<T>[]> {
  if (configurations.length === 0) return []

  const { blockFrom, blockTo } = await resolvePrivacyBlockRange(
    deps.privacyBlockTimestamp,
    deps.chain,
    deps.from,
    deps.to,
  )

  // eth_getLogs ANDs the topic positions of a single filter, so
  // configurations with different indexed-arg filters cannot share a query.
  const groups = await Promise.all(
    groupByTopics(configurations).map(
      async ({ topics, configurations: group }) => {
        const { addresses, events } = buildPrivacyLogFilter(group)
        const logs = await deps.logsProvider.getLogs(
          blockFrom,
          blockTo,
          addresses,
          [events, ...topics],
        )
        return { configurations: group, logs }
      },
    ),
  )

  const blockTimestampLookup = await buildPrivacyBlockTimestampLookup(
    groups.flatMap((group) => group.logs),
    deps.blockProvider,
    deps.logger,
  )
  const matches: PrivacyLogMatch<T>[] = []

  for (const group of groups) {
    const configMap = buildPrivacyLogConfigMap(group.configurations)
    for (const log of group.logs) {
      const key = getPrivacyLogKey(log)
      const matching = configMap.get(key) ?? []
      if (matching.length === 0) continue

      const timestamp = blockTimestampLookup.get(log.blockNumber)
      assert(timestamp, `Missing block timestamp for block ${log.blockNumber}`)

      for (const configuration of matching) {
        matches.push({ log, timestamp, configuration })
      }
    }
  }

  return matches
}

function groupByTopics<T extends PrivacyLogIndexerConfig>(
  configurations: Configuration<T>[],
): { topics: PrivacyLogTopicFilter; configurations: Configuration<T>[] }[] {
  const groups = new Map<
    string,
    { topics: PrivacyLogTopicFilter; configurations: Configuration<T>[] }
  >()
  for (const configuration of configurations) {
    const topics = configuration.properties.topics ?? []
    const key = JSON.stringify(topics)
    const group = groups.get(key) ?? { topics, configurations: [] }
    group.configurations.push(configuration)
    groups.set(key, group)
  }
  return Array.from(groups.values())
}

async function resolvePrivacyBlockRange(
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

async function buildPrivacyBlockTimestampLookup(
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

function getPrivacyLogConfigKey(
  address: string,
  event: string | undefined,
): string {
  return `${address.toLowerCase()}:${event?.toLowerCase() ?? ''}`
}

export function getPrivacyLogKey(log: Pick<Log, 'address' | 'topics'>): string {
  return getPrivacyLogConfigKey(log.address, log.topics[0])
}
