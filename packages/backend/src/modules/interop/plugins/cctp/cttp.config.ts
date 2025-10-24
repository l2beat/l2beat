import type { Logger } from '@l2beat/backend-tools'
import type { RpcClient } from '@l2beat/shared'
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

export interface CCTPV2Network {
  chain: string
  chainId: number
  domain: number
  messageTransmitter: EthereumAddress
}

export const CCTPV2Config = defineConfig<CCTPV2Network[]>('cctp-v2')

const ABI = parseAbi(['function localDomain() returns (uint32)'])
const V2_MESSAGE_TRANSMITTER = EthereumAddress(
  '0x81D40F21F12A8F0E3252Bccb954D722d4c464B64',
)

const OVERRIDES = [
  { chain: 'solana', domain: 5, chainId: -1 },
  { chain: 'sonic', domain: 13, chainId: -1 },
  { chain: 'sei', domain: 16, chainId: -1 },
  { chain: 'xdc', domain: 18, chainId: -1 },
  { chain: 'hyperevm', domain: 19, chainId: -1 },
]

export class CCTPConfigPlugin extends TimeLoop implements InteropConfigPlugin {
  provides = [CCTPV2Config]

  constructor(
    private chains: { id: number; name: string }[],
    private store: InteropConfigStore,
    protected logger: Logger,
    private rpcs: Map<string, RpcClient>,
  ) {
    super({ intervalMs: 20 * 60 * 1000 })
    this.logger = logger.for(this).tag({ tag: CCTPV2Config.key })
  }

  async run() {
    const previous = this.store.get(CCTPV2Config)
    const latest = await this.getLatestNetworks()

    const reconciled = reconcileNetworks(previous, latest)

    if (reconciled.removed.length > 0) {
      this.logger.error('Networks removed', {
        plugin: CCTPV2Config.key,
        removed: reconciled.removed,
      })
    }

    if (reconciled.updated.length > 0) {
      this.logger.info('Networks updated', {
        plugin: CCTPV2Config.key,
      })
      this.store.set(CCTPV2Config, reconciled.updated)
    }
  }

  async getLatestNetworks(): Promise<CCTPV2Network[]> {
    const calldata = encodeFunctionData({
      abi: ABI,
      functionName: 'localDomain',
    })

    const chainPromises = this.chains.map(async (chain) => {
      const rpc = this.rpcs.get(chain.name)
      if (!rpc) return

      try {
        const result = await rpc.call(
          {
            to: V2_MESSAGE_TRANSMITTER,
            data: Bytes.fromHex(calldata),
          },
          'latest',
        )

        if (result.toString() === '0x') {
          return
        }

        const decoded = decodeFunctionResult({
          data: result.toString() as Hex,
          abi: ABI,
          functionName: 'localDomain',
        })

        return {
          chain: chain.name,
          chainId: chain.id,
          domain: decoded,
          messageTransmitter: V2_MESSAGE_TRANSMITTER,
        }
      } catch (_) {
        return
      }
    })

    const results = await Promise.all(chainPromises)
    const cctpDomains = results.filter((result) => result !== undefined)

    return [
      ...cctpDomains,
      ...OVERRIDES.map((o) => ({
        ...o,
        messageTransmitter: EthereumAddress.ZERO,
      })),
    ]
  }
}
