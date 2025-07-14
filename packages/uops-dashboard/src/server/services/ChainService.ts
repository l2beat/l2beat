import { Logger } from '@l2beat/backend-tools'
import { HttpClient, RpcClient } from '@l2beat/shared'
import type { Chain } from '@/chains'
import type { CountedBlock, StatResults } from '@/types'
import type { BlockClient } from '../clients/block/BlockClient'
import { StarknetClient } from '../clients/block/StarknetClient'
import { RpcCodeClient } from '../clients/code/RpcCodeClient'
import { ScanClient } from '../clients/contract/ScanClient'
import { EtherfaceClient } from '../clients/signature/EtherfaceClient'
import { FourByteClient } from '../clients/signature/FourByteClient'
import { OpenChainClient } from '../clients/signature/OpenChainClient'
import type { Counter } from '../counters/counter'
import { RpcCounter } from '../counters/RpcCounter'
import { StarknetCounter } from '../counters/StarknetCounter'
import type { DB } from '../db/db'
import { NameService } from './NameService'

const DEFAULT_BATCH_SIZE = 10

export class ChainService {
  private readonly client: BlockClient
  private readonly counter: Counter
  private readonly nameService?: NameService

  constructor(chain: Chain, db: DB) {
    const http = new HttpClient()

    switch (chain.blockchainApi.type) {
      case 'starknet':
        this.client = new StarknetClient(chain)
        this.counter = new StarknetCounter()
        break
      case 'rpc': {
        this.client = new RpcClient({
          url: chain.blockchainApi.url,
          sourceName: chain.id,
          http,
          callsPerMinute: (chain.customBatchSize ?? DEFAULT_BATCH_SIZE) * 30,
          logger: Logger.SILENT,
          retryStrategy: 'RELIABLE',
        })

        this.counter = new RpcCounter()

        const signatureClients = [
          new EtherfaceClient(),
          new FourByteClient(),
          new OpenChainClient(),
        ]

        let contractClient = undefined
        const scanApiUrl = chain.etherscanApiUrl
        const scanApiKey = getEtherscanApiKey(chain.id)
        if (scanApiUrl && scanApiKey) {
          contractClient = new ScanClient(scanApiUrl, scanApiKey)
        }

        const codeClient = new RpcCodeClient(chain)
        this.nameService = new NameService(
          db,
          signatureClients,
          codeClient,
          contractClient,
        )
        break
      }
      default:
        throw new Error(`Unsupported chain: ${chain.id}`)
    }
  }

  async getBlockNumber(): Promise<number> {
    return await this.client.getLatestBlockNumber()
  }

  async getBlock(blockNumber: number): Promise<CountedBlock> {
    const block = await this.client.getBlockWithTransactions(blockNumber)
    const countedBlock = this.counter.countForBlock(block)

    if (this.nameService) {
      await this.nameService.fillNames(countedBlock)
    }

    return countedBlock
  }

  async analyzeBlocks(startBlock: number, count: number): Promise<StatResults> {
    const blocks = []
    for (let i = 0; i < count; i++) {
      const block = await this.client.getBlockWithTransactions(startBlock + i)
      blocks.push(block)
    }

    return this.counter.countForBlocks(blocks)
  }
}

export function getEtherscanApiKey(chainId: string): string | undefined {
  const envName = `${chainId.toUpperCase().replace('-', '_')}_SCAN_API_KEY`
  const value = process.env[envName]
  return value
}
