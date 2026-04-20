import type { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import { v } from '@l2beat/validate'
import { TimeLoop } from '../../../../tools/TimeLoop'
import {
  defineConfig,
  type InteropConfigPlugin,
  type InteropConfigStore,
} from '../../engine/config/InteropConfigStore'
import { reconcileNetworks } from '../../engine/config/reconcileNetworks'

export interface RelayNetwork {
  chain: string
  chainId: number
  relayName: string
}

export const RelayConfig = defineConfig<RelayNetwork[]>('relay')

const CHAINS_URL = 'https://api.relay.link/chains'

const ChainsResponse = v.object({
  chains: v.array(
    v.object({
      id: v.number(),
      name: v.string(),
      disabled: v.boolean().optional(),
    }),
  ),
})

const RELAY_CHAIN_NAME_OVERRIDES = {
  b3: 'b3',
  'manta-pacific': 'mantapacific',
  polygon: 'polygonpos',
  swellchain: 'swell',
  'world-chain': 'worldchain',
  'zero-network': 'zeronetwork',
  zksync: 'zksync2',
} as const

const RELAY_ONE_SIDED_CHAIN_FALLBACKS = [
  { chain: 'bitcoin', chainId: 8_253_038, relayName: 'bitcoin' },
  { chain: 'solana', chainId: 792_703_809, relayName: 'solana' },
  { chain: 'tron', chainId: 728_126_428, relayName: 'tron' },
] as const satisfies RelayNetwork[]

export function normalizeRelayChainName(relayName: string) {
  const normalized = relayName.toLowerCase()

  const override =
    RELAY_CHAIN_NAME_OVERRIDES[
      normalized as keyof typeof RELAY_CHAIN_NAME_OVERRIDES
    ]

  return override ?? normalized
}

function toRelayNetwork(
  chain: { id: number; name: string },
  chainsById: Map<number, string>,
): RelayNetwork {
  return {
    chain: chainsById.get(chain.id) ?? normalizeRelayChainName(chain.name),
    chainId: chain.id,
    relayName: chain.name,
  }
}

export function buildRelayFallbackNetworks(
  chains: { id: number; name: string }[],
  oneSidedChains: string[],
): RelayNetwork[] {
  const result = new Map<number, RelayNetwork>()

  for (const chain of chains) {
    result.set(chain.id, {
      chain: chain.name,
      chainId: chain.id,
      relayName: chain.name,
    })
  }

  for (const chain of RELAY_ONE_SIDED_CHAIN_FALLBACKS) {
    if (!oneSidedChains.includes(chain.chain)) continue
    result.set(chain.chainId, chain)
  }

  return [...result.values()]
}

export class RelayConfigPlugin extends TimeLoop implements InteropConfigPlugin {
  provides = [RelayConfig]

  private readonly fallbackNetworks: RelayNetwork[]

  constructor(
    chains: { id: number; name: string }[],
    oneSidedChains: string[],
    private store: InteropConfigStore,
    protected logger: Logger,
    private http: HttpClient,
    intervalMs: number,
  ) {
    super({ intervalMs })
    this.logger = logger.for(this).tag({ tag: RelayConfig.key })
    this.fallbackNetworks = buildRelayFallbackNetworks(chains, oneSidedChains)
  }

  async run() {
    const previous = this.store.get(RelayConfig)
    const latest = await this.getLatestNetworks()

    const reconciled = reconcileNetworks(previous, latest)

    if (reconciled.removed.length > 0) {
      this.logger.info('Upstream networks removed', {
        plugin: RelayConfig.key,
        removed: reconciled.removed,
      })
    }

    if (reconciled.updated.length > 0) {
      this.logger.info('Networks updated', {
        plugin: RelayConfig.key,
      })
      await this.store.set(RelayConfig, reconciled.updated)
    }
  }

  async getLatestNetworks(): Promise<RelayNetwork[]> {
    const response = await this.http.fetch(CHAINS_URL, { timeout: 10_000 })
    const parsed = ChainsResponse.parse(response)

    const chainsById = new Map(
      this.fallbackNetworks.map((network) => [network.chainId, network.chain]),
    )

    return parsed.chains
      .filter((chain) => !chain.disabled)
      .map((chain) => toRelayNetwork(chain, chainsById))
  }
}
