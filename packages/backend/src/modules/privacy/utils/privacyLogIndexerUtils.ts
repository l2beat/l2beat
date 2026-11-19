import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type {
  BlockProvider,
  IRpcClient,
  LogsProvider,
  LogsTopicFilter,
} from '@l2beat/shared'
import {
  assert,
  type EthereumAddress,
  type Log,
  UnixTime,
  unique,
} from '@l2beat/shared-pure'
import chunk from 'lodash/chunk'
import type { Configuration } from '../../../tools/uif/multi/types'
import type { PrivacyLogTopicFilter, PrivacyRpcContext } from '../types'
import { ReceiptLogCache } from './ReceiptLogCache'

// Receipt-based extractors make several RPC requests per log.
const EXTRACTION_BATCH_SIZE = 20

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

  const groups = await queryPrivacyLogs(configurations, (addresses, topics) =>
    deps.logsProvider.getLogs(blockFrom, blockTo, addresses, topics),
  )

  const blockTimestampLookup = await buildPrivacyBlockTimestampLookup(
    groups.flatMap((group) => group.logs),
    deps.blockProvider,
    deps.logger,
  )
  return groups.flatMap((group) =>
    matchPrivacyLogs(group.configurations, group.logs, blockTimestampLookup),
  )
}

/**
 * eth_getLogs ORs the values at a topic position, so configurations that
 * filter the same positions share a query and logs are matched by topics.
 */
export function queryPrivacyLogs<T extends PrivacyLogIndexerConfig>(
  configurations: Configuration<T>[],
  getLogs: (addresses: string[], topics: LogsTopicFilter) => Promise<Log[]>,
): Promise<{ configurations: Configuration<T>[]; logs: Log[] }[]> {
  return Promise.all(
    groupPrivacyLogFilters(configurations).map(async (group) => ({
      configurations: group.configurations,
      logs: await getLogs(group.addresses, group.topics),
    })),
  )
}

/** The `eth_getLogs` filters that find the logs of the configurations, each with the configurations it is for */
export function groupPrivacyLogFilters<T extends PrivacyLogIndexerConfig>(
  configurations: Configuration<T>[],
): {
  configurations: Configuration<T>[]
  addresses: string[]
  topics: LogsTopicFilter
}[] {
  return groupByTopicPositions(configurations).map((group) => {
    const { addresses, events } = buildPrivacyLogFilter(group)
    return {
      configurations: group,
      addresses,
      topics: [events, ...mergeTopics(group)],
    }
  })
}

/** Pairs each log with the configurations whose address, event and topics it has */
export function matchPrivacyLogs<T extends PrivacyLogIndexerConfig>(
  configurations: Configuration<T>[],
  logs: Log[],
  blockTimestamps: Map<number, UnixTime>,
): PrivacyLogMatch<T>[] {
  const configMap = buildPrivacyLogConfigMap(configurations)
  const matches: PrivacyLogMatch<T>[] = []

  for (const log of logs) {
    const key = getPrivacyLogKey(log)
    const matching = (configMap.get(key) ?? []).filter((configuration) =>
      hasTopics(log, configuration.properties.topics),
    )
    if (matching.length === 0) continue

    const timestamp = blockTimestamps.get(log.blockNumber)
    assert(timestamp, `Missing block timestamp for block ${log.blockNumber}`)

    for (const configuration of matching) {
      matches.push({ log, timestamp, configuration })
    }
  }

  return matches
}

/**
 * Runs `extract` over the matches a batch at a time, with one context shared
 * by the whole update, and drops the matches it returns undefined for.
 */
export async function extractPrivacyLogMatches<
  T extends PrivacyLogIndexerConfig,
  R,
>(
  matches: PrivacyLogMatch<T>[],
  rpc: IRpcClient,
  extract: (
    match: PrivacyLogMatch<T>,
    context: PrivacyRpcContext,
  ) => Promise<R | undefined>,
  receipts = new ReceiptLogCache(rpc),
): Promise<R[]> {
  const context = { rpc, receipts }
  const results: R[] = []
  for (const batch of chunk(matches, EXTRACTION_BATCH_SIZE)) {
    const extracted = await Promise.all(
      batch.map((match) => extract(match, context)),
    )
    results.push(...extracted.filter((result) => result !== undefined))
  }
  return results
}

function groupByTopicPositions<T extends PrivacyLogIndexerConfig>(
  configurations: Configuration<T>[],
): Configuration<T>[][] {
  const groups = new Map<string, Configuration<T>[]>()
  for (const configuration of configurations) {
    const key = (configuration.properties.topics ?? [])
      .map((topic) => (topic === null ? '_' : 'x'))
      .join('')
    const group = groups.get(key) ?? []
    group.push(configuration)
    groups.set(key, group)
  }
  return Array.from(groups.values())
}

function mergeTopics<T extends PrivacyLogIndexerConfig>(
  group: Configuration<T>[],
): (string[] | null)[] {
  const positions = group[0]?.properties.topics ?? []
  return positions.map((_, i) => {
    const values = group.flatMap((c) => c.properties.topics?.[i] ?? [])
    return values.length > 0 ? unique(values) : null
  })
}

function hasTopics(log: Log, topics: PrivacyLogTopicFilter = []): boolean {
  return topics.every(
    (topic, i) =>
      topic === null ||
      log.topics[i + 1]?.toLowerCase() === topic.toLowerCase(),
  )
}

/** The blocks whose logs an update of these hours reads, both ends included */
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
