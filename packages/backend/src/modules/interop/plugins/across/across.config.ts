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

export interface AcrossNetwork {
  chainId: number
  chain: string
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
  provides = AcrossConfig

  constructor(
    private chains: { id: number; name: string }[],
    protected logger: Logger,
    private ethereumRpc: RpcClient,
    private configs: InteropConfigStore,
    intervalMs = 20 * 60 * 1000,
  ) {
    super({ intervalMs })
  }

  async run() {
    const previous = this.configs.get(AcrossConfig)
    const latest = await this.getLatestNetworks()
    const reconciled = this.reconcileNetworks(previous, latest)
    if (reconciled !== 'not-changed') {
      await this.configs.set(AcrossConfig, reconciled)
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

    const config: AcrossNetwork[] = []

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

  reconcileNetworks(
    previous: AcrossNetwork[] | undefined,
    latest: AcrossNetwork[],
  ): AcrossNetwork[] | 'not-changed' {
    if (previous === undefined) {
      return latest
    }

    if (previous.length !== latest.length) {
      return latest
    }

    const sortedPrevious = [...previous].sort((a, b) => a.chainId - b.chainId)
    const sortedLatest = [...latest].sort((a, b) => a.chainId - b.chainId)

    for (let i = 0; i < sortedPrevious.length; i++) {
      const prev = sortedPrevious[i]
      const curr = sortedLatest[i]

      if (
        prev.chainId !== curr.chainId ||
        prev.chain !== curr.chain ||
        prev.spokePool !== curr.spokePool
      ) {
        return latest
      }
    }

    return 'not-changed'
  }
}
