import { INTEROP_ONE_SIDED_CHAINS } from '@l2beat/config'
import type {
  Database,
  InteropEventCounterpartVolumeRecord,
  InteropTransferPluginVolumeRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'

// Most events expire a day after they happen, so a longer window would
// compare a day of events with more days of transfers
const COVERAGE_WINDOW = UnixTime.DAY
const PRICES_WINDOW = 7 * UnixTime.DAY

// Plugins report a chain they can't name as `Unknown_<id>`, where the id is in
// the plugin's own id space. Ids are named from the configs the config plugins
// store (they list upstream chains, not only ours), then from verified ids no
// config lists.
interface IdSpace {
  label: string
  plugins: string[]
  fromConfigs: { key: string; field: string; path?: 'networks' }[]
  names: Record<string, string>
  // EVM chains usually reuse their chain id as the domain
  fallbackToChainId?: boolean
}

const ID_SPACES: IdSpace[] = [
  {
    label: 'CCTP domain',
    plugins: ['cctp-v1', 'cctp-v2', 'circle-gateway', 'mayan-mctp-fast'],
    fromConfigs: [
      { key: 'cctp-v1', field: 'domain' },
      { key: 'cctp-v2', field: 'domain' },
    ],
    // https://developers.circle.com/cctp/cctp-supported-blockchains
    names: {
      '0': 'ethereum',
      '1': 'avalanche',
      '2': 'optimism',
      '3': 'arbitrum',
      '4': 'noble',
      '5': 'solana',
      '6': 'base',
      '7': 'polygonpos',
      '8': 'sui',
      '9': 'aptos',
      '10': 'unichain',
      '11': 'linea',
      '12': 'codex',
      '13': 'sonic',
      '14': 'worldchain',
      '15': 'monad',
      '16': 'sei',
      '17': 'bsc',
      '18': 'xdc',
      '19': 'hyperevm',
      '21': 'ink',
      '22': 'plume',
      '25': 'starknet',
      '26': 'arc',
      '27': 'stellar',
      '28': 'edge',
      '29': 'injective',
      '30': 'morph',
      '31': 'pharos',
      '32': 'cronos',
      '33': 'plasma',
      '37': 'xlayer',
    },
  },
  {
    label: 'LayerZero eid',
    plugins: ['layerzero-v2', 'layerzero-v2-ofts', 'stargate'],
    fromConfigs: [{ key: 'layerzero-v2', field: 'eid' }],
    names: {},
  },
  {
    label: 'Hyperlane domain',
    plugins: [
      'hyperlane',
      'hyperlane-hwr',
      'hyperlane-eco',
      'hyperlane-merkly-tokenbridge',
      'hyperlane-simple-apps',
    ],
    fromConfigs: [{ key: 'hyperlane', field: 'domain' }],
    names: { '88188': 'atoshi' },
    fallbackToChainId: true,
  },
  {
    label: 'Wormhole chain id',
    plugins: [
      'wormhole',
      'wormhole-ntt',
      'wormhole-token-bridge',
      'wormhole-relayer',
      'mayan-forwarder',
      'mayan-swift',
      'mayan-swift-settlement',
    ],
    fromConfigs: [{ key: 'wormhole', field: 'wormholeChainId' }],
    names: {},
  },
  {
    label: 'CCIP selector',
    plugins: ['ccip'],
    fromConfigs: [{ key: 'ccip', field: 'chainSelector', path: 'networks' }],
    names: {},
  },
  {
    label: 'Agglayer network',
    plugins: ['agglayer'],
    fromConfigs: [],
    names: {},
  },
  {
    label: 'chain id',
    plugins: [],
    fromConfigs: [
      'across',
      'relay',
      'gaszip',
      'layerzero-v2',
      'hyperlane',
      'cctp-v2',
      'wormhole',
    ].map((key) => ({ key, field: 'chainId' })),
    names: {
      '1151111081099710': 'solana',
      '1672': 'pharos',
      '1776': 'injective',
      '5042': 'arc',
      '728126428': 'tron',
      '792703809': 'solana',
    },
  },
]
const CHAIN_ID_SPACE = ID_SPACES[ID_SPACES.length - 1]

export type IdNames = Map<IdSpace, Map<string, string>>

export function buildIdNames(configs: Record<string, unknown>): IdNames {
  return new Map(
    ID_SPACES.map((space) => {
      const names = new Map<string, string>()
      for (const source of space.fromConfigs) {
        for (const entry of getConfigEntries(
          configs[source.key],
          source.path,
        )) {
          const id = entry[source.field]
          const chain = entry.chain
          if (
            (typeof id === 'number' || typeof id === 'string') &&
            String(id) !== '0' &&
            typeof chain === 'string' &&
            !names.has(String(id))
          ) {
            names.set(String(id), normalizeChainName(chain))
          }
        }
      }
      for (const [id, name] of Object.entries(space.names)) {
        if (!names.has(id)) names.set(id, name)
      }
      return [space, names]
    }),
  )
}

function getConfigEntries(
  value: unknown,
  path: 'networks' | undefined,
): Record<string, unknown>[] {
  const list = path && isRecord(value) ? value[path] : value
  return Array.isArray(list) ? list.filter(isRecord) : []
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// Plugins like CCIP and Axelar keep an upstream name after `Unknown_`
function normalizeChainName(chain: string): string {
  return chain.replace(/^Unknown_/, '').toLowerCase()
}

export type InteropCoverageChainStatus =
  | 'unmapped-id'
  | 'one-sided'
  | 'one-sided-disabled'
  | 'unknown-id'
  | 'not-tracked'

export interface InteropCoverageChain {
  key: string
  label: string
  status: InteropCoverageChainStatus
  rawChains: string[]
  // Events no plugin turned into a transfer
  uncountedValueUsd: number
  uncountedEvents: number
  pricedUncountedEvents: number
  lastSeen: UnixTime
  plugins: {
    plugin: string
    supportsOneSided: boolean
    uncountedValueUsd: number
    uncountedEvents: number
  }[]
}

export interface InteropCoveragePlugin {
  plugin: string
  supportsOneSided: boolean
  coveredValueUsd: number
  transfers: number
  uncoveredValueUsd: number
  uncoveredByStatus: Record<InteropCoverageChainStatus, number>
  uncoveredEvents: number
  coveragePct: number | undefined
  topMissing: { label: string; valueUsd: number }[]
}

export interface InteropCoverageData {
  from: UnixTime
  to: UnixTime
  coveredValueUsd: number
  uncoveredValueUsd: number
  coveragePct: number | undefined
  chains: InteropCoverageChain[]
  plugins: InteropCoveragePlugin[]
}

interface CoverageChainsConfig {
  capturedChains: readonly string[]
  oneSidedChains: readonly string[]
  oneSidedPlugins: readonly string[]
}

interface ResolvedChain {
  key: string
  label: string
  isNamed: boolean
  // The plugin reported a numeric id it couldn't map to a chain
  isUnmappedId: boolean
}

export function resolveCounterpartChain(
  plugin: string,
  counterpart: string,
  idNames: IdNames,
): ResolvedChain {
  const id = counterpart.startsWith('Unknown_')
    ? counterpart.slice('Unknown_'.length)
    : undefined
  if (id === undefined || !/^\d+$/.test(id)) {
    const name = normalizeChainName(counterpart)
    return { key: name, label: name, isNamed: true, isUnmappedId: false }
  }
  const space =
    ID_SPACES.find((s) => s.plugins.includes(plugin)) ?? CHAIN_ID_SPACE
  const name =
    idNames.get(space)?.get(id) ??
    (space.fallbackToChainId ? idNames.get(CHAIN_ID_SPACE)?.get(id) : undefined)
  if (name) {
    return { key: name, label: name, isNamed: true, isUnmappedId: true }
  }
  return {
    key: `${space.label}:${id}`,
    label: `Unknown ${space.label} ${id}`,
    isNamed: false,
    isUnmappedId: true,
  }
}

// The Wormhole core plugin values only the messages Token Bridge sends, and
// the token bridge plugin turns those into transfers, so their volume
// belongs to it
const VALUED_FOR: Record<string, string> = {
  wormhole: 'wormhole-token-bridge',
}

function attributeToTransferPlugin(
  row: InteropEventCounterpartVolumeRecord,
): InteropEventCounterpartVolumeRecord[] {
  const plugin = VALUED_FOR[row.plugin]
  if (plugin === undefined || row.pricedUnmatchedEvents === 0) return [row]
  const valued = { ...row, plugin, unmatchedEvents: row.pricedUnmatchedEvents }
  const rest = row.unmatchedEvents - row.pricedUnmatchedEvents
  if (rest === 0) return [valued]
  return [
    valued,
    {
      ...row,
      unmatchedEvents: rest,
      unmatchedValueUsd: 0,
      pricedUnmatchedEvents: 0,
    },
  ]
}

export function buildInteropCoverage(
  events: InteropEventCounterpartVolumeRecord[],
  transfers: InteropTransferPluginVolumeRecord[],
  config: CoverageChainsConfig,
  range: { from: UnixTime; to: UnixTime },
  idNames: IdNames = buildIdNames({}),
): InteropCoverageData {
  const captured = new Set(config.capturedChains)
  const oneSided = new Set(config.oneSidedChains)
  const oneSidedPlugins = new Set(config.oneSidedPlugins)
  const configuredOneSided = new Set<string>(INTEROP_ONE_SIDED_CHAINS)

  const chains = new Map<string, InteropCoverageChain>()
  const pluginUncovered = new Map<
    string,
    {
      valueUsd: number
      byStatus: Record<InteropCoverageChainStatus, number>
      events: number
      byChain: Map<string, number>
    }
  >()

  for (const row of events.flatMap(attributeToTransferPlugin)) {
    if (row.counterpartChain === '') continue
    const resolved = resolveCounterpartChain(
      row.plugin,
      row.counterpartChain,
      idNames,
    )
    const isCaptured = captured.has(resolved.key)
    const isOneSided = oneSided.has(resolved.key)
    if (isCaptured && !resolved.isUnmappedId) continue

    // A tracked chain behind an id the plugin can't map is a plugin gap
    const status: InteropCoverageChainStatus =
      isCaptured || (isOneSided && resolved.isUnmappedId)
        ? 'unmapped-id'
        : isOneSided
          ? 'one-sided'
          : !resolved.isNamed
            ? 'unknown-id'
            : configuredOneSided.has(resolved.key)
              ? 'one-sided-disabled'
              : 'not-tracked'
    const key =
      status === 'unmapped-id' ? `unmapped:${resolved.key}` : resolved.key
    const chain = chains.get(key) ?? {
      key,
      label: resolved.label,
      status,
      rawChains: [],
      uncountedValueUsd: 0,
      uncountedEvents: 0,
      pricedUncountedEvents: 0,
      lastSeen: row.lastTimestamp,
      plugins: [],
    }
    const supportsOneSided = oneSidedPlugins.has(row.plugin)
    if (!chain.rawChains.includes(row.counterpartChain)) {
      chain.rawChains.push(row.counterpartChain)
    }
    chain.uncountedValueUsd += row.unmatchedValueUsd
    chain.uncountedEvents += row.unmatchedEvents
    chain.pricedUncountedEvents += row.pricedUnmatchedEvents
    chain.lastSeen = Math.max(chain.lastSeen, row.lastTimestamp) as UnixTime
    const plugin = chain.plugins.find((p) => p.plugin === row.plugin)
    if (plugin) {
      plugin.uncountedValueUsd += row.unmatchedValueUsd
      plugin.uncountedEvents += row.unmatchedEvents
    } else {
      chain.plugins.push({
        plugin: row.plugin,
        supportsOneSided,
        uncountedValueUsd: row.unmatchedValueUsd,
        uncountedEvents: row.unmatchedEvents,
      })
    }
    chains.set(key, chain)

    const uncovered = pluginUncovered.get(row.plugin) ?? {
      valueUsd: 0,
      byStatus: emptyByStatus(),
      events: 0,
      byChain: new Map<string, number>(),
    }
    uncovered.valueUsd += row.unmatchedValueUsd
    uncovered.byStatus[status] += row.unmatchedValueUsd
    uncovered.events += row.unmatchedEvents
    const label =
      status === 'unmapped-id' ? `${resolved.label} (unmapped)` : resolved.label
    uncovered.byChain.set(
      label,
      (uncovered.byChain.get(label) ?? 0) + row.unmatchedValueUsd,
    )
    pluginUncovered.set(row.plugin, uncovered)
  }

  const pluginCovered = new Map(
    transfers.map((row) => [
      row.plugin,
      { valueUsd: row.volumeUsd, transfers: row.count },
    ]),
  )

  for (const chain of chains.values()) {
    chain.rawChains.sort()
    chain.plugins.sort(
      (a, b) =>
        b.uncountedValueUsd - a.uncountedValueUsd ||
        b.uncountedEvents - a.uncountedEvents,
    )
  }

  const pluginNames = new Set([
    ...pluginCovered.keys(),
    ...pluginUncovered.keys(),
  ])
  const plugins = [...pluginNames].map((plugin): InteropCoveragePlugin => {
    const coveredValueUsd = pluginCovered.get(plugin)?.valueUsd ?? 0
    const uncovered = pluginUncovered.get(plugin)
    const uncoveredValueUsd = uncovered?.valueUsd ?? 0
    return {
      plugin,
      supportsOneSided: oneSidedPlugins.has(plugin),
      coveredValueUsd,
      transfers: pluginCovered.get(plugin)?.transfers ?? 0,
      uncoveredValueUsd,
      uncoveredByStatus: uncovered?.byStatus ?? emptyByStatus(),
      uncoveredEvents: uncovered?.events ?? 0,
      coveragePct: toPct(coveredValueUsd, uncoveredValueUsd),
      topMissing: [...(uncovered?.byChain ?? new Map()).entries()]
        .filter(([, valueUsd]) => valueUsd > 0)
        .map(([label, valueUsd]) => ({ label, valueUsd }))
        .sort((a, b) => b.valueUsd - a.valueUsd)
        .slice(0, 3),
    }
  })

  const coveredValueUsd = plugins.reduce((a, p) => a + p.coveredValueUsd, 0)
  const uncoveredValueUsd = plugins.reduce((a, p) => a + p.uncoveredValueUsd, 0)

  return {
    from: range.from,
    to: range.to,
    coveredValueUsd,
    uncoveredValueUsd,
    coveragePct: toPct(coveredValueUsd, uncoveredValueUsd),
    chains: [...chains.values()].sort(
      (a, b) =>
        b.uncountedValueUsd - a.uncountedValueUsd ||
        b.uncountedEvents - a.uncountedEvents,
    ),
    plugins: plugins.sort((a, b) => b.uncoveredValueUsd - a.uncoveredValueUsd),
  }
}

function emptyByStatus(): Record<InteropCoverageChainStatus, number> {
  return {
    'unmapped-id': 0,
    'one-sided': 0,
    'one-sided-disabled': 0,
    'unknown-id': 0,
    'not-tracked': 0,
  }
}

function toPct(covered: number, uncovered: number): number | undefined {
  const total = covered + uncovered
  return total === 0 ? undefined : (100 * covered) / total
}

export async function getInteropCoverageData(
  db: Database,
  config: CoverageChainsConfig & { maxTransferValueUsd: number },
  now = UnixTime.now(),
): Promise<InteropCoverageData> {
  const from = (now - COVERAGE_WINDOW) as UnixTime
  const [events, transfers, configs] = await Promise.all([
    db.interopEvent.getUnmatchedCounterpartVolume(
      from,
      (now - PRICES_WINDOW) as UnixTime,
      config.maxTransferValueUsd,
    ),
    db.interopTransfer.getVolumeByPlugin({ from, to: now }),
    db.interopConfig.getAllLatest(),
  ])
  const idNames = buildIdNames(
    Object.fromEntries(configs.map((config) => [config.key, config.value])),
  )
  return buildInteropCoverage(
    events,
    transfers,
    config,
    { from, to: now },
    idNames,
  )
}
