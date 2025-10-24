import type { Logger } from '@l2beat/backend-tools'
import type { CallParameters, RpcClient } from '@l2beat/shared'
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
  spokePool: EthereumAddress
}

export const AcrossConfig = defineConfig<AcrossNetwork[]>('across')

const abi = parseAbi([
  'function crossChainContracts(uint256) view returns (address adapter, address spokePool)',
])
const HUB_POOL = EthereumAddress('0xc186fA914353c44b2E33eBE05f21846F1048bEda')

const OVERRIDES = [
  {
    name: 'hyperevm',
    id: 999,
  },
  {
    name: 'solana',
    id: 34268394551451,
  },
]

export class AcrossConfigPlugin
  extends TimeLoop
  implements InteropConfigPlugin
{
  provides = [AcrossConfig]

  constructor(
    private chains: { id: number; name: string }[],
    private store: InteropConfigStore,
    protected logger: Logger,
    private ethereumRpc: RpcClient,
  ) {
    super({ intervalMs: 20 * 60 * 1000 })
    this.logger = logger.for(this).tag({ tag: AcrossConfig.key })
  }

  async run() {
    const previous = this.store.get(AcrossConfig)
    const latest = await this.getLatestNetworks()

    const reconciled = reconcileNetworks(previous, latest)

    if (reconciled.removed.length > 0) {
      this.logger.error('Networks removed', {
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

    const chains = [...this.chains, ...OVERRIDES]

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

    return config
  }
}
