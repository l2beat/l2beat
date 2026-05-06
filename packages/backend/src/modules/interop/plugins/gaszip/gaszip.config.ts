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
import { defineNetworks } from '../types'

export interface GasZipChain {
  chain: string
  gaszipId: number
  chainId: number
}

export interface GasZipNetwork extends GasZipChain {
  solver: EthereumAddress
  depositEoa: EthereumAddress
  depositContract: EthereumAddress
  customGas?: boolean
}

interface GasZipNetworkInput {
  chain: string
  gaszipId: number
  chainId: number
  solver?: EthereumAddress
  depositEoa?: EthereumAddress
  depositContract?: EthereumAddress
  customGas?: boolean
}

export const DEFAULT_DEPOSIT_EOA_ADDRESS = EthereumAddress(
  '0x391E7C679d29bD940d63be94AD22A25d25b5A604',
)
export const DEFAULT_DEPOSIT_CONTRACT_ADDRESS = EthereumAddress(
  '0x2a37D63EAdFe4b4682a3c28C1c2cD4F109Cc2762',
)
export const DEFAULT_SOLVER_EOA_ADDRESS = EthereumAddress(
  '0x8C826F795466E39acbfF1BB4eEeB759609377ba1',
)
export const GasZipConfig = defineConfig<GasZipChain[]>('gaszip')

const GASZIP_CHAINS_URL = 'https://backend.gas.zip/v2/chains'

function gasZipNetwork(input: GasZipNetworkInput): GasZipNetwork {
  return {
    solver: DEFAULT_SOLVER_EOA_ADDRESS,
    depositEoa: DEFAULT_DEPOSIT_EOA_ADDRESS,
    depositContract: DEFAULT_DEPOSIT_CONTRACT_ADDRESS,
    ...input,
  }
}

// https://dev.gas.zip/gas/chain-support/outbound
// https://dev.gas.zip/gas/api/chains
// live source for chain name / chainId / short-id mapping:
// https://backend.gas.zip/v2/chains
// chainconfeeg
export const GASZIP_NETWORKS = defineNetworks<GasZipNetwork>('gaszip', [
  gasZipNetwork({
    chain: 'ethereum',
    gaszipId: 255,
    chainId: 1,
    solver: EthereumAddress('0x5baBE600b9fCD5fB7b66c0611bF4896D967b23A1'),
  }),
  gasZipNetwork({
    chain: 'arbitrum',
    gaszipId: 57,
    chainId: 42161,
  }),
  gasZipNetwork({
    chain: 'base',
    gaszipId: 54,
    chainId: 8453,
  }),
  gasZipNetwork({
    chain: 'optimism',
    gaszipId: 55,
    chainId: 10,
  }),
  gasZipNetwork({
    chain: 'apechain',
    gaszipId: 296,
    chainId: 33139,
    customGas: true,
  }),
  gasZipNetwork({
    chain: 'polygonpos',
    gaszipId: 17,
    chainId: 137,
    customGas: true,
  }),
  gasZipNetwork({
    chain: 'zksync2',
    gaszipId: 51,
    chainId: 324,
    depositContract: EthereumAddress(
      '0x252fb662e4D7435D2a5DED8EC94d8932CF76C178',
    ),
  }),
  gasZipNetwork({
    chain: 'abstract',
    gaszipId: 110,
    chainId: 2741,
    depositContract: EthereumAddress(
      '0x252fb662e4D7435D2a5DED8EC94d8932CF76C178',
    ),
  }),
  gasZipNetwork({
    chain: 'katana',
    gaszipId: 485,
    chainId: 747474,
  }),
  gasZipNetwork({
    chain: 'bsc',
    gaszipId: 14,
    chainId: 56,
    customGas: true,
  }),
  gasZipNetwork({
    chain: 'celo',
    gaszipId: 21,
    chainId: 42220,
    customGas: true,
  }),
  gasZipNetwork({
    chain: 'avalanche',
    gaszipId: 15,
    chainId: 43114,
    customGas: true,
  }),
  gasZipNetwork({
    chain: 'ink',
    gaszipId: 392,
    chainId: 57073,
  }),
  gasZipNetwork({
    chain: 'linea',
    gaszipId: 59,
    chainId: 59144,
  }),
  gasZipNetwork({
    chain: 'unichain',
    gaszipId: 362,
    chainId: 130,
  }),
  gasZipNetwork({
    chain: 'hyperevm',
    gaszipId: 430,
    chainId: 999,
  }),
  gasZipNetwork({
    chain: 'monad',
    gaszipId: 511,
    chainId: 143,
  }),
  gasZipNetwork({
    chain: 'tempo',
    gaszipId: 521,
    chainId: 4217,
  }),
])

interface GasZipApiChain {
  name: string
  chain: number
  short: number
  mainnet: boolean
}

interface GasZipApiResponse {
  chains: GasZipApiChain[]
}

function normalizeGasZipChainName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '')
}

function buildBootstrapChainNamesByChainId(
  chains: { id: number; name: string }[],
): Map<number, string> {
  const counts = new Map<number, number>()
  for (const chain of chains) {
    counts.set(chain.id, (counts.get(chain.id) ?? 0) + 1)
  }

  return new Map(
    chains
      .filter((chain) => counts.get(chain.id) === 1)
      .map((chain) => [chain.id, chain.name]),
  )
}

function toGasZipChain(
  entry: GasZipApiChain,
  bootstrapChainNamesByChainId: Map<number, string>,
): GasZipChain | undefined {
  if (
    !entry.mainnet ||
    !Number.isSafeInteger(entry.chain) ||
    !Number.isSafeInteger(entry.short) ||
    entry.short <= 0
  ) {
    return
  }

  const canonicalName = bootstrapChainNamesByChainId.get(entry.chain)
  const chain = canonicalName ?? normalizeGasZipChainName(entry.name)

  if (chain.length === 0) return

  return {
    chain,
    gaszipId: entry.short,
    chainId: entry.chain,
  }
}

export function getChainByGaszipId(
  gaszipId: number,
  configs?: InteropConfigStore,
): GasZipChain | undefined {
  return (
    configs?.get(GasZipConfig)?.find((n) => n.gaszipId === gaszipId) ??
    GASZIP_NETWORKS.find((n) => n.gaszipId === gaszipId)
  )
}

export function getChainNameByGaszipId(
  gaszipId: number,
  configs?: InteropConfigStore,
): string {
  return getChainByGaszipId(gaszipId, configs)?.chain ?? `unknown_${gaszipId}`
}

export class GasZipConfigPlugin
  extends TimeLoop
  implements InteropConfigPlugin
{
  provides = [GasZipConfig]

  private readonly bootstrapChainNamesByChainId: Map<number, string>

  constructor(
    chains: { id: number; name: string }[],
    private store: InteropConfigStore,
    protected logger: Logger,
    private http: HttpClient,
    intervalMs: number,
  ) {
    super({ intervalMs })
    this.logger = logger.for(this).tag({ tag: GasZipConfig.key })
    this.bootstrapChainNamesByChainId =
      buildBootstrapChainNamesByChainId(chains)
  }

  async run() {
    const previous = this.store.get(GasZipConfig)
    const latest = await this.getLatestNetworks()

    const reconciled = reconcileNetworks(previous, latest)

    if (reconciled.removed.length > 0) {
      this.logger.info('Upstream networks removed', {
        plugin: GasZipConfig.key,
        removed: reconciled.removed,
      })
    }

    if (reconciled.updated.length > 0) {
      this.logger.info('Networks updated', {
        plugin: GasZipConfig.key,
      })
      this.store.set(GasZipConfig, reconciled.updated)
    }
  }

  async getLatestNetworks(): Promise<GasZipChain[]> {
    const response = await this.http.fetchRaw(GASZIP_CHAINS_URL, {
      timeout: 10_000,
    })

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`)
    }

    const json: GasZipApiResponse = await response.json()
    const usedNames = new Set<string>()
    const networks: GasZipChain[] = []

    for (const entry of json.chains) {
      const network = toGasZipChain(entry, this.bootstrapChainNamesByChainId)
      if (!network) continue

      if (usedNames.has(network.chain)) {
        const uniqueChain = `${network.chain}_${network.gaszipId}`
        usedNames.add(uniqueChain)
        networks.push({
          ...network,
          chain: uniqueChain,
        })
        continue
      }

      usedNames.add(network.chain)
      networks.push(network)
    }

    networks.sort((a, b) => a.gaszipId - b.gaszipId)
    return networks
  }
}
