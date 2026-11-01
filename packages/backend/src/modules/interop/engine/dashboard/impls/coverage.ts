import { INTEROP_ONE_SIDED_CHAINS } from '@l2beat/config'
import type {
  Database,
  InteropEventCounterpartVolumeRecord,
  InteropTransfersStatsRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'

// Most events expire a day after they happen, so a longer window would
// compare a day of events with more days of transfers
const COVERAGE_WINDOW = UnixTime.DAY
const PRICES_WINDOW = 7 * UnixTime.DAY

// Plugins report a chain they can't name as `Unknown_<id>`, where the id is in
// the plugin's own id space. Names are only listed for verified ids.
const ID_SPACES: {
  label: string
  plugins: string[]
  names: Record<string, string>
}[] = [
  {
    label: 'CCTP domain',
    plugins: ['cctp-v1', 'cctp-v2', 'circle-gateway'],
    names: {
      '4': 'noble',
      '5': 'solana',
      '8': 'sui',
      '9': 'aptos',
      '26': 'arc',
      '27': 'stellar',
    },
  },
  {
    label: 'LayerZero eid',
    plugins: ['layerzero-v2', 'layerzero-v2-ofts', 'stargate'],
    names: {
      '30150': 'klaytn',
      '30212': 'conflux',
      '30292': 'etherlink',
      '30362': 'berachain',
      '30367': 'hyperevm',
      '30383': 'plasma',
      '30385': 'dinari',
      '30390': 'monad',
      '30396': 'stable',
      '30403': 'citrea',
      '30420': 'tron',
    },
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
    names: { '88188': 'atoshi' },
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
      'mayan-mctp-fast',
    ],
    names: {},
  },
  {
    label: 'CCIP selector',
    plugins: ['ccip'],
    names: {},
  },
  {
    label: 'Agglayer network',
    plugins: ['agglayer'],
    names: {},
  },
  {
    label: 'chain id',
    plugins: [],
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
const DEFAULT_ID_SPACE = ID_SPACES[ID_SPACES.length - 1]

export type InteropCoverageChainStatus =
  | 'unknown-id'
  | 'not-tracked'
  | 'one-sided-disabled'

export interface InteropCoverageChain {
  key: string
  label: string
  status: InteropCoverageChainStatus
  rawChains: string[]
  valueUsd: number
  events: number
  pricedEvents: number
  lastSeen: UnixTime
  plugins: { plugin: string; valueUsd: number; events: number }[]
}

export interface InteropCoveragePlugin {
  plugin: string
  coveredValueUsd: number
  transfers: number
  uncoveredValueUsd: number
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
}

interface ResolvedChain {
  key: string
  label: string
  isNamed: boolean
}

export function resolveCounterpartChain(
  plugin: string,
  counterpart: string,
): ResolvedChain {
  const id = counterpart.startsWith('Unknown_')
    ? counterpart.slice('Unknown_'.length)
    : undefined
  if (id === undefined) {
    return { key: counterpart, label: counterpart, isNamed: true }
  }
  if (!/^\d+$/.test(id)) {
    // Plugins like CCIP and Axelar keep the upstream name after the prefix
    const name = id.toLowerCase()
    return { key: name, label: name, isNamed: true }
  }
  const space =
    ID_SPACES.find((s) => s.plugins.includes(plugin)) ?? DEFAULT_ID_SPACE
  const name = space.names[id]
  if (name) {
    return { key: name, label: name, isNamed: true }
  }
  return {
    key: `${space.label}:${id}`,
    label: `Unknown ${space.label} ${id}`,
    isNamed: false,
  }
}

export function buildInteropCoverage(
  events: InteropEventCounterpartVolumeRecord[],
  transfers: InteropTransfersStatsRecord[],
  config: CoverageChainsConfig,
  range: { from: UnixTime; to: UnixTime },
): InteropCoverageData {
  const covered = new Set([...config.capturedChains, ...config.oneSidedChains])
  const configuredOneSided = new Set<string>(INTEROP_ONE_SIDED_CHAINS)

  const chains = new Map<string, InteropCoverageChain>()
  const pluginMissing = new Map<string, Map<string, number>>()
  const pluginUncovered = new Map<
    string,
    { valueUsd: number; events: number }
  >()

  for (const row of events) {
    if (row.counterpartChain === '') continue
    const resolved = resolveCounterpartChain(row.plugin, row.counterpartChain)
    if (covered.has(resolved.key)) continue

    const status: InteropCoverageChainStatus = !resolved.isNamed
      ? 'unknown-id'
      : configuredOneSided.has(resolved.key)
        ? 'one-sided-disabled'
        : 'not-tracked'
    const chain = chains.get(resolved.key) ?? {
      key: resolved.key,
      label: resolved.label,
      status,
      rawChains: [],
      valueUsd: 0,
      events: 0,
      pricedEvents: 0,
      lastSeen: row.lastTimestamp,
      plugins: [],
    }
    if (!chain.rawChains.includes(row.counterpartChain)) {
      chain.rawChains.push(row.counterpartChain)
    }
    chain.valueUsd += row.valueUsd
    chain.events += row.events
    chain.pricedEvents += row.pricedEvents
    chain.lastSeen = Math.max(chain.lastSeen, row.lastTimestamp) as UnixTime
    const plugin = chain.plugins.find((p) => p.plugin === row.plugin)
    if (plugin) {
      plugin.valueUsd += row.valueUsd
      plugin.events += row.events
    } else {
      chain.plugins.push({
        plugin: row.plugin,
        valueUsd: row.valueUsd,
        events: row.events,
      })
    }
    chains.set(resolved.key, chain)

    const uncovered = pluginUncovered.get(row.plugin) ?? {
      valueUsd: 0,
      events: 0,
    }
    uncovered.valueUsd += row.valueUsd
    uncovered.events += row.events
    pluginUncovered.set(row.plugin, uncovered)
    const missing = pluginMissing.get(row.plugin) ?? new Map<string, number>()
    missing.set(
      resolved.label,
      (missing.get(resolved.label) ?? 0) + row.valueUsd,
    )
    pluginMissing.set(row.plugin, missing)
  }

  const pluginCovered = new Map<
    string,
    { valueUsd: number; transfers: number }
  >()
  for (const row of transfers) {
    const current = pluginCovered.get(row.plugin) ?? {
      valueUsd: 0,
      transfers: 0,
    }
    // Transfer volume is the larger of the two sides, as on the site
    current.valueUsd += Math.max(row.srcValueSum, row.dstValueSum)
    current.transfers += row.count
    pluginCovered.set(row.plugin, current)
  }

  const pluginNames = new Set([
    ...pluginCovered.keys(),
    ...pluginUncovered.keys(),
  ])
  const plugins = [...pluginNames].map((plugin): InteropCoveragePlugin => {
    const coveredValueUsd = pluginCovered.get(plugin)?.valueUsd ?? 0
    const uncoveredValueUsd = pluginUncovered.get(plugin)?.valueUsd ?? 0
    return {
      plugin,
      coveredValueUsd,
      transfers: pluginCovered.get(plugin)?.transfers ?? 0,
      uncoveredValueUsd,
      uncoveredEvents: pluginUncovered.get(plugin)?.events ?? 0,
      coveragePct: toPct(coveredValueUsd, uncoveredValueUsd),
      topMissing: [...(pluginMissing.get(plugin) ?? new Map()).entries()]
        .map(([label, valueUsd]) => ({ label, valueUsd }))
        .sort((a, b) => b.valueUsd - a.valueUsd)
        .slice(0, 3),
    }
  })

  for (const chain of chains.values()) {
    chain.rawChains.sort()
    chain.plugins.sort((a, b) => b.valueUsd - a.valueUsd || b.events - a.events)
  }

  const coveredValueUsd = plugins.reduce((a, p) => a + p.coveredValueUsd, 0)
  const uncoveredValueUsd = plugins.reduce((a, p) => a + p.uncoveredValueUsd, 0)

  return {
    from: range.from,
    to: range.to,
    coveredValueUsd,
    uncoveredValueUsd,
    coveragePct: toPct(coveredValueUsd, uncoveredValueUsd),
    chains: [...chains.values()].sort(
      (a, b) => b.valueUsd - a.valueUsd || b.events - a.events,
    ),
    plugins: plugins.sort((a, b) => b.uncoveredValueUsd - a.uncoveredValueUsd),
  }
}

function toPct(covered: number, uncovered: number): number | undefined {
  const total = covered + uncovered
  return total === 0 ? undefined : (100 * covered) / total
}

export async function getInteropCoverageData(
  db: Database,
  config: CoverageChainsConfig,
  now = UnixTime.now(),
): Promise<InteropCoverageData> {
  const from = (now - COVERAGE_WINDOW) as UnixTime
  const [events, transfers] = await Promise.all([
    db.interopEvent.getCounterpartChainVolume(
      from,
      (now - PRICES_WINDOW) as UnixTime,
    ),
    db.interopTransfer.getStats({ from, to: now }),
  ])
  return buildInteropCoverage(events, transfers, config, { from, to: now })
}
