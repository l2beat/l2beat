import type { Logger } from '@l2beat/backend-tools'
import { http, type PublicClient, createPublicClient } from 'viem'
import type { TxService } from './TxService'
import { type BlockWithTxs, analyzeBlock } from './analyze'
import type { ChainInfo } from './types'

export class ChainListener {
  private client: PublicClient

  constructor(
    private chain: ChainInfo,
    rpcUrl: string,
    private txService: TxService,
    private logger: Logger,
  ) {
    this.logger = logger.for(this).configure({ tag: chain.name })
    this.client = createPublicClient({
      transport: http(rpcUrl),
    })
  }

  start() {
    this.logger.info('Started')
    this.client.watchBlocks({
      emitMissed: true,
      includeTransactions: true,
      emitOnBegin: true,
      blockTag: 'latest',
      onBlock: this.onBlock.bind(this),
    })
  }

  onBlock(block: BlockWithTxs) {
    this.logger.info('Received block', { number: Number(block.number) })
    const txs = analyzeBlock(block, this.chain)
    for (const tx of txs) {
      this.txService.save(tx)
    }
  }
}
