import type { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import { TimeLoop } from '../../../tools/TimeLoop'
import {
  defineConfig,
  type InteropConfigPlugin,
  type InteropConfigStore,
} from '../engine/config/InteropConfigStore'
import { reconcileNetworks } from '../engine/config/reconcileNetworks'
import { findChain } from './types'

export interface HyperlaneNetwork {
  chain: string
  domain: number
  chainId?: number
}

export const HyperlaneConfig = defineConfig<HyperlaneNetwork[]>('hyperlane')

export type HyperlaneWarpRouteMap = Record<string, string>

export const HyperlaneWarpRoutesConfig = defineConfig<HyperlaneWarpRouteMap>(
  'hyperlane-warp-routes',
)

const HYPERLANE_METADATA_URL =
  'https://raw.githubusercontent.com/hyperlane-xyz/hyperlane-registry/main/chains/metadata.yaml'
const HYPERLANE_WARP_ROUTES_URL =
  'https://raw.githubusercontent.com/hyperlane-xyz/hyperlane-registry/main/deployments/warp_routes/warpRouteConfigs.yaml'

const HYPERLANE_CHAIN_NAME_OVERRIDES = {
  polygon: 'polygonpos',
  solanamainnet: 'solana',
  zksync: 'zksync2',
} as const

interface HyperlaneRegistryEntry {
  name: string
  domain: number
  chainId?: number
  isTestnet: boolean
}

export interface HyperlaneWarpRouteRegistryEntry {
  chain: string
  router: string
  standard: string
}

function getHyperlaneChainNameOverride(name: string) {
  return HYPERLANE_CHAIN_NAME_OVERRIDES[
    name as keyof typeof HYPERLANE_CHAIN_NAME_OVERRIDES
  ]
}

function normalizeHyperlaneChainName(name: string) {
  return getHyperlaneChainNameOverride(name) ?? name
}

function parseNumberField(line: string, prefix: string): number | undefined {
  if (!line.startsWith(prefix)) return

  const parsed = Number(line.slice(prefix.length))
  if (!Number.isSafeInteger(parsed)) return

  return parsed
}

function parseStringField(line: string, prefix: string): string | undefined {
  if (!line.startsWith(prefix)) return
  return line.slice(prefix.length)
}

function unquoteYamlString(value: string): string {
  const trimmed = value.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

export function hyperlaneWarpRouteKey(chain: string, router: string): string {
  return `${chain}:${router.toLowerCase()}`
}

export function parseHyperlaneWarpRouteRegistry(
  yaml: string,
): HyperlaneWarpRouteRegistryEntry[] {
  const entries: HyperlaneWarpRouteRegistryEntry[] = []
  let currentRouter: string | undefined
  let currentChain: string | undefined
  let currentStandard: string | undefined

  const pushCurrent = () => {
    if (!currentRouter || !currentChain || !currentStandard) return
    entries.push({
      chain: normalizeHyperlaneChainName(currentChain),
      router: currentRouter,
      standard: currentStandard,
    })
  }

  for (const line of yaml.split('\n')) {
    const router = parseStringField(line, '    - addressOrDenom: ')
    if (router !== undefined) {
      pushCurrent()
      currentRouter = unquoteYamlString(router)
      currentChain = undefined
      currentStandard = undefined
      continue
    }

    if (!currentRouter) continue

    const chain = parseStringField(line, '      chainName: ')
    if (chain !== undefined) {
      currentChain = unquoteYamlString(chain)
      continue
    }

    const standard = parseStringField(line, '      standard: ')
    if (standard !== undefined) {
      currentStandard = unquoteYamlString(standard)
    }
  }

  pushCurrent()
  return entries
}

export function buildHyperlaneWarpRouteMap(
  entries: HyperlaneWarpRouteRegistryEntry[],
): HyperlaneWarpRouteMap {
  const result: HyperlaneWarpRouteMap = {}

  for (const entry of entries) {
    if (!/^0x[0-9a-fA-F]{40}$/.test(entry.router)) continue

    const key = hyperlaneWarpRouteKey(entry.chain, entry.router)
    const previousStandard = result[key]
    if (previousStandard && previousStandard !== entry.standard) {
      throw new Error(
        `Conflicting Hyperlane warp route standards for ${key}: ${previousStandard} and ${entry.standard}`,
      )
    }
    result[key] = entry.standard
  }

  return result
}

export function mergeHyperlaneWarpRouteMaps(
  previous: HyperlaneWarpRouteMap | undefined,
  latest: HyperlaneWarpRouteMap,
): HyperlaneWarpRouteMap {
  return { ...previous, ...latest }
}

function areHyperlaneWarpRouteMapsEqual(
  a: HyperlaneWarpRouteMap | undefined,
  b: HyperlaneWarpRouteMap,
): boolean {
  if (!a) return false
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  return (
    aKeys.length === bKeys.length && bKeys.every((key) => a[key] === b[key])
  )
}

export function parseHyperlaneRegistryMetadata(
  yaml: string,
): HyperlaneRegistryEntry[] {
  const entries: HyperlaneRegistryEntry[] = []

  let currentTopLevelName: string | undefined
  let currentName: string | undefined
  let currentDomain: number | undefined
  let currentChainId: number | undefined
  let currentIsTestnet = false

  const pushCurrent = () => {
    if (!currentTopLevelName || currentDomain === undefined) return

    entries.push({
      name: currentName ?? currentTopLevelName,
      domain: currentDomain,
      chainId: currentChainId,
      isTestnet: currentIsTestnet,
    })
  }

  for (const line of yaml.split('\n')) {
    if (line.length === 0 || line.startsWith('#')) continue

    if (!line.startsWith(' ')) {
      pushCurrent()

      currentTopLevelName = line.endsWith(':') ? line.slice(0, -1) : undefined
      currentName = currentTopLevelName
      currentDomain = undefined
      currentChainId = undefined
      currentIsTestnet = false
      continue
    }

    if (!currentTopLevelName) continue

    const name = parseStringField(line, '  name: ')
    if (name !== undefined) {
      currentName = name
      continue
    }

    const chainId = parseNumberField(line, '  chainId: ')
    if (chainId !== undefined) {
      currentChainId = chainId
      continue
    }

    const domain = parseNumberField(line, '  domainId: ')
    if (domain !== undefined) {
      currentDomain = domain
      continue
    }

    if (line === '  isTestnet: true') {
      currentIsTestnet = true
    }
  }

  pushCurrent()

  return entries
}

export function buildHyperlaneBootstrapNetworks(
  chains: { id: number; name: string }[],
): HyperlaneNetwork[] {
  const result: HyperlaneNetwork[] = []
  const seen = new Set<string>()

  for (const chain of chains) {
    if (seen.has(chain.name)) continue

    result.push({
      chain: chain.name,
      chainId: chain.id,
      domain: chain.id,
    })
    seen.add(chain.name)
  }

  return result
}

function toHyperlaneNetwork(
  entry: HyperlaneRegistryEntry,
  bootstrapChainNamesByChainId: Map<number, string>,
  chainIdCounts: Map<number, number>,
): HyperlaneNetwork {
  const override = getHyperlaneChainNameOverride(entry.name)
  const canonicalName =
    entry.chainId !== undefined && chainIdCounts.get(entry.chainId) === 1
      ? bootstrapChainNamesByChainId.get(entry.chainId)
      : undefined

  return {
    chain: override ?? canonicalName ?? entry.name,
    domain: entry.domain,
    chainId: entry.chainId,
  }
}

export function findHyperlaneChain(
  networks: HyperlaneNetwork[],
  domain: number,
): string {
  return findChain(networks, (x) => x.domain, domain)
}

export class HyperlaneConfigPlugin
  extends TimeLoop
  implements InteropConfigPlugin
{
  provides = [HyperlaneConfig, HyperlaneWarpRoutesConfig]

  private readonly bootstrapNetworks: HyperlaneNetwork[]
  private readonly bootstrapChainNamesByChainId: Map<number, string>

  constructor(
    chains: { id: number; name: string }[],
    private store: InteropConfigStore,
    protected logger: Logger,
    private http: HttpClient,
    intervalMs: number,
  ) {
    super({ intervalMs })
    this.logger = logger.for(this).tag({ tag: HyperlaneConfig.key })
    this.bootstrapNetworks = buildHyperlaneBootstrapNetworks(chains)
    this.bootstrapChainNamesByChainId = new Map(
      this.bootstrapNetworks
        .filter((network) => network.chainId !== undefined)
        .map((network) => [network.chainId as number, network.chain]),
    )
  }

  async run() {
    const previous = this.store.get(HyperlaneConfig)
    const previousWarpRoutes = this.store.get(HyperlaneWarpRoutesConfig)
    const [latest, latestWarpRoutes] = await Promise.all([
      this.getLatestNetworks(),
      this.getLatestWarpRoutes(),
    ])

    const reconciled = reconcileNetworks(previous, latest)

    if (reconciled.removed.length > 0) {
      this.logger.info('Upstream networks removed', {
        plugin: HyperlaneConfig.key,
        removed: reconciled.removed,
      })
    }

    if (reconciled.updated.length > 0) {
      this.logger.info('Networks updated', {
        plugin: HyperlaneConfig.key,
      })
      await this.store.set(HyperlaneConfig, reconciled.updated)
    }

    const removedWarpRoutes = previousWarpRoutes
      ? Object.keys(previousWarpRoutes).filter(
          (key) => latestWarpRoutes[key] === undefined,
        )
      : []
    if (removedWarpRoutes.length > 0) {
      this.logger.info('Upstream warp routes removed', {
        plugin: HyperlaneWarpRoutesConfig.key,
        removed: removedWarpRoutes,
      })
    }

    const mergedWarpRoutes = mergeHyperlaneWarpRouteMaps(
      previousWarpRoutes,
      latestWarpRoutes,
    )
    if (!areHyperlaneWarpRouteMapsEqual(previousWarpRoutes, mergedWarpRoutes)) {
      this.logger.info('Warp routes updated', {
        plugin: HyperlaneWarpRoutesConfig.key,
      })
      await this.store.set(HyperlaneWarpRoutesConfig, mergedWarpRoutes)
    }
  }

  async getLatestNetworks(): Promise<HyperlaneNetwork[]> {
    const response = await this.http.fetchRaw(HYPERLANE_METADATA_URL, {
      timeout: 10_000,
    })

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`)
    }

    const yaml = await response.text()
    const entries = parseHyperlaneRegistryMetadata(yaml).filter(
      (entry) => !entry.isTestnet,
    )

    const chainIdCounts = new Map<number, number>()
    for (const entry of entries) {
      if (entry.chainId === undefined) continue
      chainIdCounts.set(
        entry.chainId,
        (chainIdCounts.get(entry.chainId) ?? 0) + 1,
      )
    }

    const networks = entries.map((entry) =>
      toHyperlaneNetwork(
        entry,
        this.bootstrapChainNamesByChainId,
        chainIdCounts,
      ),
    )

    const seenChains = new Set(networks.map((network) => network.chain))
    for (const network of this.bootstrapNetworks) {
      if (seenChains.has(network.chain)) continue
      networks.push(network)
    }

    return networks.sort((a, b) => a.chain.localeCompare(b.chain))
  }

  async getLatestWarpRoutes(): Promise<HyperlaneWarpRouteMap> {
    const response = await this.http.fetchRaw(HYPERLANE_WARP_ROUTES_URL, {
      timeout: 10_000,
    })

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`)
    }

    const yaml = await response.text()
    return buildHyperlaneWarpRouteMap(parseHyperlaneWarpRouteRegistry(yaml))
  }
}
