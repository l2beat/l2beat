import type { Logger } from '@l2beat/backend-tools'
import { type Log, createPublicClient, http, type PublicClient } from 'viem'
import type { TxService } from './TxService'
import type { ChainInfo } from './types'
import { analyzeLogs } from './analyze'

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
    this.client.watchEvent({
      onLogs: this.onLogs.bind(this),
    })
  }

  onLogs(logs: Log[]) {
    this.logger.info('Received logs', { count: logs.length })
    const txs = analyzeLogs(logs, this.chain)
    for (const tx of txs) {
      this.txService.save(tx)
    }
  }
}
