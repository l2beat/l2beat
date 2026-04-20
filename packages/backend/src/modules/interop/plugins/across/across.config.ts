import type { Logger } from '@l2beat/backend-tools'
import type { CallParameters, IRpcClient } from '@l2beat/shared'
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

export interface AcrossNetwork {
  chain: string
  chainId: number
  spokePool?: EthereumAddress
}

export const AcrossConfig = defineConfig<AcrossNetwork[]>('across')

interface AcrossBootstrapChain {
  name: string
  id: number
  querySpokePool: boolean
}

const abi = parseAbi([
  'function crossChainContracts(uint256) view returns (address adapter, address spokePool)',
])
const HUB_POOL = EthereumAddress('0xc186fA914353c44b2E33eBE05f21846F1048bEda')

// Sourced from the official Across Swap API `/swap/chains` and Across
// "Chains & Contracts" docs on April 20, 2026.
const ACROSS_CHAIN_NAME_FALLBACKS = [
  {
    name: 'plasma',
    id: 9_745,
    querySpokePool: true,
  },
  {
    name: 'solana',
    id: 34_268_394_551_451,
    querySpokePool: false,
  },
  {
    name: 'hypercore',
    id: 1_337,
    querySpokePool: false,
  },
  {
    name: 'lighter',
    id: 2_337,
    querySpokePool: false,
  },
] as const satisfies AcrossBootstrapChain[]

export function buildAcrossBootstrapChains(
  chains: { id: number; name: string }[],
): AcrossBootstrapChain[] {
  const result: AcrossBootstrapChain[] = []
  const seen = new Set<number>()

  for (const chain of chains) {
    result.push({
      id: chain.id,
      name: chain.name,
      querySpokePool: true,
    })
    seen.add(chain.id)
  }

  for (const chain of ACROSS_CHAIN_NAME_FALLBACKS) {
    if (seen.has(chain.id)) continue
    result.push(chain)
  }

  return result
}

export class AcrossConfigPlugin
  extends TimeLoop
  implements InteropConfigPlugin
{
  provides = [AcrossConfig]
  private readonly bootstrapChains: AcrossBootstrapChain[]

  constructor(
    chains: { id: number; name: string }[],
    private store: InteropConfigStore,
    protected logger: Logger,
    private ethereumRpc: IRpcClient,
    intervalMs: number,
  ) {
    super({ intervalMs })
    this.logger = logger.for(this).tag({ tag: AcrossConfig.key })
    this.bootstrapChains = buildAcrossBootstrapChains(chains)
  }

  async run() {
    const previous = this.store.get(AcrossConfig)
    const latest = await this.getLatestNetworks()

    const reconciled = reconcileNetworks(previous, latest)

    if (reconciled.removed.length > 0) {
      this.logger.info('Upstream networks removed', {
        plugin: AcrossConfig.key,
        removed: reconciled.removed,
      })
    }

    if (reconciled.updated.length > 0) {
      this.logger.info('Networks updated', {
        plugin: AcrossConfig.key,
      })
      this.store.set(AcrossConfig, reconciled.updated)
    }
  }

  async getLatestNetworks(): Promise<AcrossNetwork[]> {
    const latest = await this.ethereumRpc.getLatestBlockNumber()

    const calls: CallParameters[] = []
    const chains = this.bootstrapChains.filter((chain) => chain.querySpokePool)

    for (const chain of chains) {
      const data = encodeFunctionData({
        abi,
        functionName: 'crossChainContracts',
        args: [BigInt(chain.id)],
      })

      calls.push({ to: HUB_POOL, data: Bytes.fromHex(data) })
    }

    const result = await this.ethereumRpc.multicall(calls, latest)

    const config = []

    for (const [i, r] of result.entries()) {
      if (!r.success) {
        this.logger.warn(`Multicall failed for id ${chains[i].id}`)
        continue
      }
      const [_, spokePool] = decodeFunctionResult({
        abi,
        functionName: 'crossChainContracts',
        data: r.data.toString() as Hex,
      })
      if (EthereumAddress(spokePool) !== EthereumAddress.ZERO) {
        config.push({
          chain: chains[i].name,
          chainId: chains[i].id,
          spokePool: EthereumAddress(spokePool),
        })
      }
    }

    for (const chain of ACROSS_CHAIN_NAME_FALLBACKS) {
      if (config.some((network) => network.chainId === chain.id)) continue
      config.push({
        chain: chain.name,
        chainId: chain.id,
      })
    }

    return config
  }
}
