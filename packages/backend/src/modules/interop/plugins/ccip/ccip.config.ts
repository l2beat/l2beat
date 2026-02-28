import type { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import { EthereumAddress } from '@l2beat/shared-pure'
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
  // v1.6+ per-chain OnRamp
  onRamp?: EthereumAddress
  // v1.6+ per-chain OffRamp
  offRamp?: EthereumAddress
}

export const CCIPConfig = defineConfig<CCIPNetwork[]>('ccip')
// Maps chain selectors to readable names for chains not tracked by L2Beat
export const CCIPSelectorNames = defineConfig<Record<string, string>>(
  'ccip-selector-names',
)

const CHAINS_URL =
  'https://raw.githubusercontent.com/smartcontractkit/documentation/main/src/config/data/ccip/v1_2_0/mainnet/chains.json'
const LANES_URL =
  'https://raw.githubusercontent.com/smartcontractkit/documentation/main/src/config/data/ccip/v1_2_0/mainnet/lanes.json'

// Map Chainlink's chain names to L2Beat chain names
// Only includes chains supported by ChainSpecificAddress
const CHAINLINK_TO_L2BEAT: Record<string, string> = {
  // Ethereum
  mainnet: 'ethereum',
  // L2s on Ethereum
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
  // Other L1s
  'avalanche-mainnet': 'avalanche',
  'bsc-mainnet': 'bsc',
  'matic-mainnet': 'polygonpos',
  'celo-mainnet': 'celo',
  'gnosis-mainnet': 'gnosis',
  'metis-mainnet': 'metis',
  'soneium-mainnet': 'soneium',
}

function toL2BeatChainName(chainlinkName: string): string | undefined {
  return CHAINLINK_TO_L2BEAT[chainlinkName]
}

// Derive a human-readable chain name from Chainlink's naming convention.
// e.g. "solana-mainnet" → "Solana", "ethereum-mainnet-ronin-1" → "Ronin", "sonic-mainnet" → "Sonic"
function toReadableChainName(chainlinkName: string): string {
  // Pattern: "<host>-mainnet-<chain>-<N>" → extract <chain>
  const subchainMatch = chainlinkName.match(/^.+-mainnet-(.+?)-\d+$/)
  if (subchainMatch) {
    return capitalize(subchainMatch[1])
  }
  // Pattern: "<chain>-mainnet" or "<chain>-testnet" → extract <chain>
  const mainnetMatch = chainlinkName.match(/^(.+?)-(mainnet|testnet)$/)
  if (mainnetMatch) {
    return capitalize(mainnetMatch[1])
  }
  return chainlinkName
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
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
  provides = [CCIPConfig, CCIPSelectorNames]

  constructor(
    private chains: { name: string }[],
    private store: InteropConfigStore,
    protected logger: Logger,
    private http: HttpClient,
    intervalMs: number,
  ) {
    super({ intervalMs })
    this.logger = logger.for(this)
  }

  async run() {
    const latest = await this.getLatestNetworks()

    const previous = this.store.get(CCIPConfig)
    const reconciled = reconcileNetworks(previous, latest.networks)

    if (reconciled.removed.length > 0) {
      this.logger.error('Networks removed', {
        plugin: CCIPConfig.key,
        removed: reconciled.removed,
      })
    }

    if (reconciled.updated.length > 0) {
      this.logger.info('Networks updated', {
        plugin: CCIPConfig.key,
        count: reconciled.updated.length,
      })
      this.store.set(CCIPConfig, reconciled.updated)
    }

    this.store.set(CCIPSelectorNames, latest.selectorNames)
  }

  async getLatestNetworks(): Promise<{
    networks: CCIPNetwork[]
    selectorNames: Record<string, string>
  }> {
    const [chainsResponse, lanesResponse] = await Promise.all([
      this.http.fetchRaw(CHAINS_URL, { timeout: 10_000 }),
      this.http.fetchRaw(LANES_URL, { timeout: 10_000 }),
    ])

    const chainsJson: ChainsJson = await chainsResponse.json()
    const lanes: LanesJson = await lanesResponse.json()

    // Build selector → readable name map for ALL chains (including untracked)
    const selectorNames: Record<string, string> = {}
    for (const [chainlinkChain, chainConfig] of Object.entries(chainsJson)) {
      const l2beat = toL2BeatChainName(chainlinkChain)
      const name = l2beat ?? `Unknown_${toReadableChainName(chainlinkChain)}`
      selectorNames[chainConfig.chainSelector] = name
    }

    // Only include chains that l2beat tracks
    const trackedChainNames = new Set(this.chains.map((c) => c.name))

    const networks: CCIPNetwork[] = []

    for (const [chainlinkChain, chainConfig] of Object.entries(chainsJson)) {
      const l2beatChain = toL2BeatChainName(chainlinkChain)
      if (!l2beatChain) continue
      if (!trackedChainNames.has(l2beatChain)) continue

      const outboundLanes: Record<string, EthereumAddress> = {}
      const inboundLanes: Record<string, EthereumAddress> = {}
      let onRamp: EthereumAddress | undefined
      let offRamp: EthereumAddress | undefined

      // lanes[chainA][chainB] contains:
      // - onRamp: contract on chainA for sending TO chainB
      // - offRamp: contract on chainA for receiving FROM chainB
      const thisChainLanes = lanes[chainlinkChain]
      if (thisChainLanes) {
        for (const [otherChainlink, laneConfig] of Object.entries(
          thisChainLanes,
        )) {
          const otherL2beat = toL2BeatChainName(otherChainlink)
          // For unsupported chains, derive a readable name from Chainlink's naming
          const chainName =
            otherL2beat ?? `Unknown_${toReadableChainName(otherChainlink)}`

          // Outbound: this chain -> other chain (onRamp)
          if (laneConfig.onRamp?.address) {
            try {
              const addr = EthereumAddress(laneConfig.onRamp.address)
              if (laneConfig.onRamp.version?.startsWith('1.6')) {
                // v1.6+ uses a single per-chain OnRamp contract
                onRamp = addr
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
                // v1.6+ uses a single per-chain OffRamp contract
                offRamp = addr
              } else {
                inboundLanes[chainName] = addr
              }
            } catch {
              // Invalid address, skip
            }
          }
        }
      }

      // Only add if we have at least one lane or v1.6 contract
      if (
        Object.keys(outboundLanes).length > 0 ||
        Object.keys(inboundLanes).length > 0 ||
        onRamp ||
        offRamp
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
        })
      }
    }

    return { networks, selectorNames }
  }
}
