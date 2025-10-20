import { getEnv, Logger } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import {
  type CallParameters,
  HttpClient,
  MulticallV3Client,
  RpcClient,
} from '@l2beat/shared'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import {
  decodeFunctionResult,
  encodeFunctionData,
  type Hex,
  parseAbi,
} from 'viem'
import type { AcrossNetwork, InteropConfigPlugin } from './types'

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

export class AcrossConfigPlugin implements InteropConfigPlugin {
  name = 'across'

  constructor(
    private chains: { id: number; name: string }[],
    private db: Database,
    private logger: Logger,
    private ethereumRpc: RpcClient,
  ) {}

  async getLatestConfig(): Promise<AcrossNetwork[]> {
    const latest = await this.ethereumRpc.getLatestBlockNumber()

    const calls: CallParameters[] = []

    const chains = [...this.chains, ...OVERRIDES]

    for (const chain of chains) {
      const data = encodeFunctionData({
        abi,
        functionName: 'crossChainContracts',
        args: [BigInt(chain.id)],
      })

      calls.push({
        to: HUB_POOL,
        data: Bytes.fromHex(data),
      })
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
}

async function main() {
  const env = getEnv()
  const logger = Logger.INFO

  const rpc = new RpcClient({
    http: new HttpClient(),
    logger,
    url: env.string('ETHEREUM_RPC_URL'),
    retryStrategy: 'SCRIPT',
    sourceName: 'ethereum',
    callsPerMinute: 60,
    multicallClient: new MulticallV3Client(
      EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
      14353601,
      500,
    ),
  })

  const ps = new ProjectService()
  const chains = (await ps.getProjects({ select: ['chainConfig'] }))
    .map((p) => p.chainConfig)
    .filter((c) => c.chainId !== undefined)
    .map((c) => ({ id: c.chainId as number, name: c.name }))

  const extractor = new AcrossConfigPlugin(chains, logger, rpc)

  const result = await extractor.getLatestConfig()

  console.log(result.sort((a, b) => a.chain.localeCompare(b.chain)))
}

main().catch((e: unknown) => {
  console.error(e)
})
