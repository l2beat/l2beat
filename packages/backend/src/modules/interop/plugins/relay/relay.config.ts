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
  'arbitrum-nova': 'nova',
  ancient8: 'ancient',
  boba: 'bobanetwork',
  'manta-pacific': 'mantapacific',
  plume: 'plumenetwork',
  polygon: 'polygonpos',
  shape: 'shape',
  swellchain: 'swell',
  'world-chain': 'worldchain',
  'zero-network': 'zeronetwork',
  zksync: 'zksync2',
} as const

function getRelayChainNameOverride(normalizedRelayName: string) {
  return RELAY_CHAIN_NAME_OVERRIDES[
    normalizedRelayName as keyof typeof RELAY_CHAIN_NAME_OVERRIDES
  ]
}

export function normalizeRelayChainName(relayName: string) {
  const normalized = relayName.toLowerCase()
  return getRelayChainNameOverride(normalized) ?? normalized
}

function toRelayNetwork(
  chain: { id: number; name: string },
  chainNamesById: Map<number, string>,
): RelayNetwork {
  const relayKey = chain.name.toLowerCase()
  const override = getRelayChainNameOverride(relayKey)

  return {
    chain:
      override ??
      chainNamesById.get(chain.id) ??
      normalizeRelayChainName(chain.name),
    chainId: chain.id,
  }
}

export function buildRelayBootstrapChainNamesById(
  chains: { id: number; name: string }[],
): Map<number, string> {
  const result = new Map<number, string>()

  for (const chain of chains) {
    result.set(chain.id, chain.name)
  }

  return result
}

export class RelayConfigPlugin extends TimeLoop implements InteropConfigPlugin {
  provides = [RelayConfig]

  private readonly bootstrapChainNamesById: Map<number, string>

  constructor(
    chains: { id: number; name: string }[],
    private store: InteropConfigStore,
    protected logger: Logger,
    private http: HttpClient,
    intervalMs: number,
  ) {
    super({ intervalMs })
    this.logger = logger.for(this).tag({ tag: RelayConfig.key })
    this.bootstrapChainNamesById = buildRelayBootstrapChainNamesById(chains)
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

    return parsed.chains
      .filter((chain) => !chain.disabled)
      .map((chain) => toRelayNetwork(chain, this.bootstrapChainNamesById))
  }
}
