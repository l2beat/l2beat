import type { Chain } from '@/chains'
import type { CountedBlock, StatResults } from '@/types'
import { BlockClient } from '../clients/block/BlockClient'
import { RpcClient } from '../clients/block/RpcClient'
import { StarknetClient } from '../clients/block/StarknetClient'
import { ScanClient } from '../clients/contract/ScanClient'
import { EtherfaceClient } from '../clients/signature/EtherfaceClient'
import { FourByteClient } from '../clients/signature/FourByteClient'
import { OpenChainClient } from '../clients/signature/OpenChainClient'
import { RpcCounter } from '../counters/RpcCounter'
import { StarknetCounter } from '../counters/StarknetCounter'
import type { Counter } from '../counters/counter'
import { DB } from '../db/db'
import { NameService } from './NameService'

export class ChainService {
  private readonly client: BlockClient
  private readonly counter: Counter
  private readonly nameService?: NameService

  constructor(chain: Chain, db: DB) {
    switch (chain.id) {
      case 'starknet':
        this.client = new StarknetClient(chain)
        this.counter = new StarknetCounter()
        break
      case 'base':
      case 'ethereum':
      case 'xai':
      case 'taiko':
      case 'arbitrum':
      case 'gravity':
      case 'optimism': {
        this.client = new RpcClient(chain)
        this.counter = new RpcCounter()
        const signatureClients = [
          new EtherfaceClient(),
          new FourByteClient(),
          new OpenChainClient(),
        ]
        const contractClient = new ScanClient(chain)
        this.nameService = new NameService(db, signatureClients, contractClient)
        break
      }
      default:
        throw new Error(`Unsupported chain: ${chain.id}`)
    }
  }

  async getBlockNumber(): Promise<number> {
    return await this.client.getBlockNumber()
  }

  async getBlock(blockNumber: number): Promise<CountedBlock> {
    const block = await this.client.getBlock(blockNumber)
    const countedBlock = await this.counter.countForBlock(block)

    if (this.nameService) {
      await this.nameService.fillNames(countedBlock)
    }

    return countedBlock
  }

  async analyzeBlocks(startBlock: number, count: number): Promise<StatResults> {
    const blocks = []
    for (let i = 0; i < count; i++) {
      const block = await this.client.getBlock(startBlock + i)
      blocks.push(block)
    }

    return await this.counter.countForBlocks(blocks)
  }
}
