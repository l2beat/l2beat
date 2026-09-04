import type { Logger } from '@l2beat/backend-tools'
import type {
  CallParameters,
  HttpClient,
  IRpcClient,
  MulticallV3Response,
} from '@l2beat/shared'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import {
  decodeFunctionResult,
  encodeFunctionData,
  type Hex,
  parseAbi,
} from 'viem'
import { TimeLoop } from '../../../../tools/TimeLoop'
import {
  defineConfig,
  type InteropConfigPlugin,
  type InteropConfigStore,
} from '../../engine/config/InteropConfigStore'
import { reconcileNetworks } from '../../engine/config/reconcileNetworks'

export interface CCIPNetwork {
  chain: string
  chainSelector: string
  router?: EthereumAddress
  // Outbound lanes: chain -> onRamp address (v1.0-v1.5 per-lane)
  outboundLanes: Record<string, EthereumAddress>
  // Inbound lanes: chain -> offRamp address (v1.0-v1.5 per-lane)
  inboundLanes: Record<string, EthereumAddress>
  // v1.6 per-chain OnRamp
  onRamp?: EthereumAddress
  // v1.6 per-chain OffRamp
  offRamp?: EthereumAddress
  // v2.0 per-chain OnRamp (deployed alongside v1.6)
  onRampV2?: EthereumAddress
  // v2.0 per-chain OffRamp (deployed alongside v1.6)
  offRampV2?: EthereumAddress
  // All documented and Router-selected OnRamps seen for each destination.
  // Addresses are retained across refreshes so historical resyncs still know
  // both the ramp and its destination after a route migration.
  onRampsByDestination?: Record<string, EthereumAddress[]>
  // Flattened historical union used by selector-bearing per-chain signatures.
  // Optional for backwards compatibility with persisted configs and sealed snapshots.
  onRamps?: EthereumAddress[]
}

export interface CCIPConfigData {
  networks: CCIPNetwork[]
  // Maps CCIP chain selectors (uint64) to readable chain names for all chains (including untracked)
  chainSelectorToName: Record<string, string>
}

export const CCIPConfig = defineConfig<CCIPConfigData>('ccip')

const CHAINS_URL =
  'https://raw.githubusercontent.com/smartcontractkit/documentation/main/src/config/data/ccip/v1_2_0/mainnet/chains.json'
const LANES_URL =
  'https://raw.githubusercontent.com/smartcontractkit/documentation/main/src/config/data/ccip/v1_2_0/mainnet/lanes.json'

const ROUTER_ABI = parseAbi([
  'function getOnRamp(uint64 destChainSelector) view returns (address)',
])

// Map Chainlink's chain names to L2Beat chain names
// Only includes chains supported by ChainSpecificAddress
const CHAINLINK_TO_L2BEAT: Record<string, string> = {
  // Ethereum
  mainnet: 'ethereum',
  // L2s on Ethereum
  'abstract-mainnet': 'abstract',
  'ethereum-mainnet-arbitrum-1': 'arbitrum',
  'ethereum-mainnet-base-1': 'base',
  'ethereum-mainnet-optimism-1': 'optimism',
  'ethereum-mainnet-linea-1': 'linea',
  'ethereum-mainnet-mantle-1': 'mantle',
  'ethereum-mainnet-mode-1': 'mode',
  'ethereum-mainnet-scroll-1': 'scroll',
  'ethereum-mainnet-zksync-1': 'zksync2',
  'ethereum-mainnet-blast-1': 'blast',
  'ethereum-mainnet-zircuit-1': 'zircuit',
  'ethereum-mainnet-worldchain-1': 'worldchain',
  'ethereum-mainnet-ink-1': 'ink',
  'ethereum-mainnet-unichain-1': 'unichain',
  'ethereum-mainnet-polygon-zkevm-1': 'polygonzkevm',
  'ethereum-mainnet-taiko-1': 'taiko',
  'ethereum-mainnet-xlayer-1': 'xlayer',
  'polygon-mainnet-katana': 'katana',
  'robinhood-mainnet': 'robinhood',
  // Other L1s
  'avalanche-mainnet': 'avalanche',
  'bsc-mainnet': 'bsc',
  'matic-mainnet': 'polygonpos',
  'celo-mainnet': 'celo',
  // Chainlink still uses Gnosis Chain's former xDai name in its CCIP config.
  'xdai-mainnet': 'gnosis',
  // Keep the current name as an alias in case the upstream config migrates.
  'gnosis-mainnet': 'gnosis',
  'metis-mainnet': 'metis',
  'soneium-mainnet': 'soneium',
  'hyperliquid-mainnet': 'hyperevm',
  'monad-mainnet': 'monad',
  'megaeth-mainnet': 'megaeth',
  'plasma-mainnet': 'plasma',
  'tempo-mainnet': 'tempo',
}

// Maps a Chainlink chain name to an L2Beat chain name, or derives a readable
// "Unknown_<name>" fallback from the Chainlink naming convention.
// e.g. "ethereum-mainnet-base-1" → "base", "solana-mainnet" → "Unknown_solana"
export function toChainName(chainlinkName: string): string {
  const l2beat = CHAINLINK_TO_L2BEAT[chainlinkName]
  if (l2beat) return l2beat

  // Pattern: "<host>-mainnet-<chain>-<N>" → extract <chain>
  const subchainMatch = chainlinkName.match(/^.+-mainnet-(.+?)-\d+$/)
  if (subchainMatch) return `Unknown_${subchainMatch[1]}`

  // Pattern: "<chain>-mainnet" or "<chain>-testnet" → extract <chain>
  const mainnetMatch = chainlinkName.match(/^(.+?)-(mainnet|testnet)$/)
  if (mainnetMatch) return `Unknown_${mainnetMatch[1]}`

  return `Unknown_${chainlinkName}`
}

interface ChainConfig {
  router?: { address: string; version: string }
  chainSelector: string
  feeTokens?: string[]
  armProxy?: { address: string; version: string }
  tokenAdminRegistry?: { address: string; version: string }
}

interface LaneConfig {
  onRamp?: { address: string; version: string }
  offRamp?: { address: string; version: string }
}

type ChainsJson = Record<string, ChainConfig>
type LanesJson = Record<string, Record<string, LaneConfig>>

export class CCIPConfigPlugin extends TimeLoop implements InteropConfigPlugin {
  provides = [CCIPConfig]

  constructor(
    private chains: { name: string }[],
    private store: InteropConfigStore,
    protected logger: Logger,
    private http: HttpClient,
    private rpcs: Map<string, IRpcClient>,
    intervalMs: number,
  ) {
    super({ intervalMs })
    this.logger = logger.for(this)
  }

  async run() {
    const previous = this.store.get(CCIPConfig)?.networks
    const latest = await this.getLatestNetworks(previous)
    const reconciled = reconcileNetworks(previous, latest.networks)

    if (reconciled.removed.length > 0) {
      this.logger.info('Upstream networks removed', {
        plugin: CCIPConfig.key,
        removed: reconciled.removed,
      })
    }

    if (reconciled.updated.length > 0 || !previous) {
      this.logger.info('Networks updated', {
        plugin: CCIPConfig.key,
        count: reconciled.updated.length,
      })
      this.store.set(CCIPConfig, {
        networks: reconciled.updated,
        chainSelectorToName: latest.chainSelectorToName,
      })
    }
  }

  async getLatestNetworks(previousNetworks?: CCIPNetwork[]): Promise<{
    networks: CCIPNetwork[]
    chainSelectorToName: Record<string, string>
  }> {
    const [chainsResponse, lanesResponse] = await Promise.all([
      this.http.fetchRaw(CHAINS_URL, { timeout: 10_000 }),
      this.http.fetchRaw(LANES_URL, { timeout: 10_000 }),
    ])

    const chainsJson: ChainsJson = await chainsResponse.json()
    const lanes: LanesJson = await lanesResponse.json()

    // Build selector → readable name map for ALL chains (including untracked)
    const chainSelectorToName: Record<string, string> = {}
    for (const [chainlinkChain, chainConfig] of Object.entries(chainsJson)) {
      chainSelectorToName[chainConfig.chainSelector] =
        toChainName(chainlinkChain)
    }

    // Only include chains that l2beat tracks
    const trackedChainNames = new Set(this.chains.map((c) => c.name))

    const networks: CCIPNetwork[] = []
    const routerRoutes = new Map<string, Map<string, string>>()

    for (const [chainlinkChain, chainConfig] of Object.entries(chainsJson)) {
      const l2beatChain = CHAINLINK_TO_L2BEAT[chainlinkChain]
      if (!l2beatChain) continue
      if (!trackedChainNames.has(l2beatChain)) continue

      const outboundLanes: Record<string, EthereumAddress> = {}
      const inboundLanes: Record<string, EthereumAddress> = {}
      let onRamp: EthereumAddress | undefined
      let offRamp: EthereumAddress | undefined
      let onRampV2: EthereumAddress | undefined
      let offRampV2: EthereumAddress | undefined

      // lanes[chainA][chainB] contains:
      // - onRamp: contract on chainA for sending TO chainB
      // - offRamp: contract on chainA for receiving FROM chainB
      const thisChainLanes = lanes[chainlinkChain]
      if (thisChainLanes) {
        for (const [otherChainlink, laneConfig] of Object.entries(
          thisChainLanes,
        )) {
          const chainName = toChainName(otherChainlink)
          const otherChainSelector = chainsJson[otherChainlink]?.chainSelector
          if (otherChainSelector !== undefined) {
            const routes = routerRoutes.get(l2beatChain) ?? new Map()
            routes.set(chainName, otherChainSelector)
            routerRoutes.set(l2beatChain, routes)
          }

          // Outbound: this chain -> other chain (onRamp)
          if (laneConfig.onRamp?.address) {
            try {
              const addr = EthereumAddress(laneConfig.onRamp.address)
              if (laneConfig.onRamp.version?.startsWith('1.6')) {
                // v1.6 uses a single per-chain OnRamp contract
                onRamp = addr
              } else if (laneConfig.onRamp.version?.startsWith('2.0')) {
                // v2.0 is deployed alongside v1.6 on the same chain.
                onRampV2 = addr
              } else {
                outboundLanes[chainName] = addr
              }
            } catch {
              // Invalid address, skip
            }
          }

          // Inbound: other chain -> this chain (offRamp)
          if (laneConfig.offRamp?.address) {
            try {
              const addr = EthereumAddress(laneConfig.offRamp.address)
              if (laneConfig.offRamp.version?.startsWith('1.6')) {
                // v1.6 uses a single per-chain OffRamp contract
                offRamp = addr
              } else if (laneConfig.offRamp.version?.startsWith('2.0')) {
                // v2.0 is deployed alongside v1.6 on the same chain.
                offRampV2 = addr
              } else {
                inboundLanes[chainName] = addr
              }
            } catch {
              // Invalid address, skip
            }
          }
        }
      }

      // Only add if we have at least one lane or per-chain contract
      if (
        Object.keys(outboundLanes).length > 0 ||
        Object.keys(inboundLanes).length > 0 ||
        onRamp ||
        offRamp ||
        onRampV2 ||
        offRampV2
      ) {
        networks.push({
          chain: l2beatChain,
          chainSelector: chainConfig.chainSelector,
          router: chainConfig.router?.address
            ? EthereumAddress(chainConfig.router.address)
            : undefined,
          outboundLanes,
          inboundLanes,
          onRamp,
          offRamp,
          onRampV2,
          offRampV2,
        })
      }
    }

    const resolvedNetworks = await Promise.all(
      networks.map(async (network) => {
        const previous = previousNetworks?.find(
          (candidate) => candidate.chain === network.chain,
        )
        const rpc = this.rpcs.get(network.chain)
        if (rpc === undefined || network.router === undefined) {
          return withOnRampHistory(network, previous, {})
        }

        const routes = [...(routerRoutes.get(network.chain) ?? [])]
          .map(([destinationChain, destChainSelector]) => ({
            destinationChain,
            destChainSelector,
          }))
          .sort((a, b) => a.destinationChain.localeCompare(b.destinationChain))

        try {
          const currentRouterOnRamps = await getRouterOnRampRoutes(
            rpc,
            network.router,
            routes,
          )
          return withOnRampHistory(network, previous, currentRouterOnRamps)
        } catch (error) {
          this.logger.debug('Failed to resolve CCIP ramps from Router', {
            chain: network.chain,
            error,
          })
          return withOnRampHistory(network, previous, {})
        }
      }),
    )

    return { networks: resolvedNetworks, chainSelectorToName }
  }
}

interface RouterRoute {
  destinationChain: string
  destChainSelector: string
}

async function getRouterOnRampRoutes(
  rpc: Pick<
    IRpcClient,
    'call' | 'getLatestBlockNumber' | 'isMulticallDeployed' | 'multicall'
  >,
  router: EthereumAddress,
  routes: RouterRoute[],
): Promise<Record<string, EthereumAddress>> {
  if (routes.length === 0) return {}

  const latestBlockNumber = await rpc.getLatestBlockNumber()
  const calls = routes.map(
    (route): CallParameters => ({
      to: router,
      input: Bytes.fromHex(
        encodeFunctionData({
          abi: ROUTER_ABI,
          functionName: 'getOnRamp',
          args: [BigInt(route.destChainSelector)],
        }),
      ),
    }),
  )

  const results = await callRouter(rpc, calls, latestBlockNumber)

  const onRamps: Record<string, EthereumAddress> = {}
  for (const [index, result] of results.entries()) {
    if (!result.success || result.data.toString() === '0x') continue
    const route = routes[index]
    if (route === undefined) continue
    const decoded = EthereumAddress(
      decodeFunctionResult({
        abi: ROUTER_ABI,
        functionName: 'getOnRamp',
        data: result.data.toString() as Hex,
      }),
    )
    if (decoded !== EthereumAddress.ZERO) {
      onRamps[route.destinationChain] = decoded
    }
  }

  return onRamps
}

async function callRouter(
  rpc: Pick<IRpcClient, 'call' | 'isMulticallDeployed' | 'multicall'>,
  calls: CallParameters[],
  blockNumber: number,
): Promise<MulticallV3Response[]> {
  if (rpc.isMulticallDeployed(blockNumber)) {
    return await rpc.multicall(calls, blockNumber)
  }

  const results: MulticallV3Response[] = []
  for (const call of calls) {
    try {
      const data = await rpc.call(call, blockNumber)
      results.push({ success: true, data })
    } catch (error) {
      if (!isCallRevertedError(error)) {
        throw error
      }
      results.push({ success: false, data: Bytes.EMPTY })
    }
  }
  return results
}

function isCallRevertedError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false
  }

  const message = error.message.toLowerCase()
  return message.includes('revert') || message.includes('call_exception')
}

function sortUnique(addresses: EthereumAddress[]): EthereumAddress[] {
  return [...new Set(addresses)].sort()
}

function withOnRampHistory(
  network: CCIPNetwork,
  previous: CCIPNetwork | undefined,
  currentRouterOnRamps: Record<string, EthereumAddress>,
): CCIPNetwork {
  const onRampsByDestination = mergeOnRampRoutes(
    previous,
    network.outboundLanes,
    currentRouterOnRamps,
  )
  const onRamps = sortUnique([
    ...[network.onRamp, network.onRampV2].filter(
      (address) => address !== undefined,
    ),
    ...[previous?.onRamp, previous?.onRampV2].filter(
      (address) => address !== undefined,
    ),
    ...(previous?.onRamps ?? []),
    ...Object.values(onRampsByDestination).flat(),
  ])

  return {
    ...network,
    onRampsByDestination,
    onRamps,
  }
}

function mergeOnRampRoutes(
  previous: CCIPNetwork | undefined,
  documentedOnRamps: Record<string, EthereumAddress>,
  currentRouterOnRamps: Record<string, EthereumAddress>,
): Record<string, EthereumAddress[]> {
  const routes = new Map<string, Set<EthereumAddress>>()

  const add = (destinationChain: string, address: EthereumAddress) => {
    const addresses = routes.get(destinationChain) ?? new Set()
    addresses.add(address)
    routes.set(destinationChain, addresses)
  }

  for (const [destinationChain, addresses] of Object.entries(
    previous?.onRampsByDestination ?? {},
  )) {
    for (const address of addresses) add(destinationChain, address)
  }
  for (const [destinationChain, address] of Object.entries(
    previous?.outboundLanes ?? {},
  )) {
    add(destinationChain, address)
  }
  for (const [destinationChain, address] of Object.entries(documentedOnRamps)) {
    add(destinationChain, address)
  }
  for (const [destinationChain, address] of Object.entries(
    currentRouterOnRamps,
  )) {
    add(destinationChain, address)
  }

  return Object.fromEntries(
    [...routes.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([destinationChain, addresses]) => [
        destinationChain,
        sortUnique([...addresses]),
      ]),
  )
}

export function getOnRampsByDestination(
  network: CCIPNetwork,
): Record<string, EthereumAddress[]> {
  return mergeOnRampRoutes(network, network.outboundLanes, {})
}

export function getKnownOnRamps(network: CCIPNetwork): EthereumAddress[] {
  return sortUnique([
    ...(network.onRamps ?? []),
    ...[network.onRamp, network.onRampV2].filter(
      (address) => address !== undefined,
    ),
    ...Object.values(getOnRampsByDestination(network)).flat(),
  ])
}
