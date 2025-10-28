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

export interface CCTPNetwork {
  chain: string
  chainId?: number
  domain: number
  messageTransmitter?: EthereumAddress
}

export const CCTPV1Config = defineConfig<CCTPNetwork[]>('cctp-v1')
export const CCTPV2Config = defineConfig<CCTPNetwork[]>('cctp-v2')

const ABI = parseAbi(['function localDomain() returns (uint32)'])
const V2_MESSAGE_TRANSMITTER = EthereumAddress(
  '0x81D40F21F12A8F0E3252Bccb954D722d4c464B64',
)

// https://developers.circle.com/cctp/v1/evm-smart-contracts
// V1 is an older version, we assume there wont any changes
const OVERRIDES_V1 = [
  {
    chain: 'ethereum',
    domain: 0,
    messageTransmitter: EthereumAddress(
      '0x0a992d191DEeC32aFe36203Ad87D7d289a738F81',
    ),
  },
  {
    chain: 'avalanche',
    domain: 1,
    messageTransmitter: EthereumAddress(
      '0x8186359aF5F57FbB40c6b14A588d2A59C0C29880',
    ),
  },
  {
    chain: 'optimism',
    domain: 2,
    messageTransmitter: EthereumAddress(
      '0x4D41f22c5a0e5c74090899E5a8Fb597a8842b3e8',
    ),
  },
  {
    chain: 'arbitrum',
    domain: 3,
    messageTransmitter: EthereumAddress(
      '0xC30362313FBBA5cf9163F0bb16a0e01f01A896ca',
    ),
  },
  {
    chain: 'base',
    domain: 6,
    messageTransmitter: EthereumAddress(
      '0xAD09780d193884d503182aD4588450C416D6F9D4',
    ),
  },
  {
    chain: 'polygonpos',
    domain: 7,
    messageTransmitter: EthereumAddress(
      '0xAD09780d193884d503182aD4588450C416D6F9D4',
    ),
  },
  {
    chain: 'unichain',
    domain: 10,
    messageTransmitter: EthereumAddress(
      '0x353bE9E2E38AB1D19104534e4edC21c643Df86f4',
    ),
  },
]

// https://developers.circle.com/cctp/evm-smart-contracts
const OVERRIDES_V2 = [
  { chain: 'solana', domain: 5 },
  { chain: 'sonic', domain: 13 },
  { chain: 'sei', domain: 16 },
  { chain: 'xdc', domain: 18 },
  { chain: 'hyperevm', domain: 19 },
]

export class CCTPConfigPlugin extends TimeLoop implements InteropConfigPlugin {
  provides = [CCTPV1Config, CCTPV2Config]

  constructor(
    private chains: { id: number; name: string }[],
    private store: InteropConfigStore,
    protected logger: Logger,
    private rpcs: Map<string, RpcClient>,
  ) {
    super({ intervalMs: 20 * 60 * 1000 })
    this.logger = logger.for(this).tag({ tag: 'cctp' })
  }

  async run() {
    const latest = await this.getLatestNetworks()

    const previousV1 = this.store.get(CCTPV1Config)
    const reconciledV1 = reconcileNetworks(previousV1, latest.v1)

    if (reconciledV1.removed.length > 0) {
      this.logger.error('Networks removed', {
        plugin: CCTPV1Config.key,
        removed: reconciledV1.removed,
      })
    }

    if (reconciledV1.updated.length > 0) {
      this.logger.info('Networks updated', {
        plugin: CCTPV1Config.key,
      })
      this.store.set(CCTPV1Config, reconciledV1.updated)
    }

    const previousV2 = this.store.get(CCTPV2Config)
    const reconciledV2 = reconcileNetworks(previousV2, latest.v2)

    if (reconciledV2.removed.length > 0) {
      this.logger.error('Networks removed', {
        plugin: CCTPV2Config.key,
        removed: reconciledV2.removed,
      })
    }

    if (reconciledV2.updated.length > 0) {
      this.logger.info('Networks updated', {
        plugin: CCTPV2Config.key,
      })
      this.store.set(CCTPV2Config, reconciledV2.updated)
    }
  }

  async getLatestNetworks(): Promise<{ v1: CCTPNetwork[]; v2: CCTPNetwork[] }> {
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
      } catch {
        return
      }
    })

    const results = await Promise.all(chainPromises)
    const cctpDomains = results.filter((result) => result !== undefined)

    return {
      v1: OVERRIDES_V1,
      v2: [...cctpDomains, ...OVERRIDES_V2],
    }
  }
}
