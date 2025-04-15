import type { Logger } from '@l2beat/backend-tools'
import { http, type Log, type PublicClient, createPublicClient } from 'viem'
import { TaskQueue } from './TaskQueue'
import type { TxService } from './TxService'
import { analyzeLogs } from './analyze'
import type { ChainInfo } from './types'

export class ChainListener {
  private client: PublicClient
  private nextJobId = 1
  private jobs: Record<number, Log[]> = {}
  private queue: TaskQueue<number>

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
    this.queue = new TaskQueue(this.processLogs, this.logger)
  }

  start() {
    this.logger.info('Started')
    this.client.watchEvent({
      onLogs: this.onLogs.bind(this),
    })
  }

  private onLogs(logs: Log[]) {
    this.logger.info('Received logs', { count: logs.length })
    this.jobs[this.nextJobId] = logs
    this.queue.addToBack(this.nextJobId)
    this.nextJobId += 1
  }

  private processLogs = async (jobId: number): Promise<void> => {
    const logs = this.jobs[jobId] ?? []
    const blockHashes = getBlockHashes(logs)
    const timestamps = await this.getBlockTimestamps(blockHashes)

    const txs = analyzeLogs(
      logs.map((log) => ({
        ...log,
        timestamp: timestamps[log.blockHash ?? `0x`] ?? 0,
      })),
      this.chain,
    )
    for (const tx of txs) {
      this.txService.save(tx)
    }

    delete this.jobs[jobId]
  }

  private async getBlockTimestamps(
    hashes: `0x${string}`[],
  ): Promise<Record<`0x${string}`, number>> {
    const result: Record<`0x${string}`, number> = {}
    const blocks = await Promise.all(
      hashes.map((blockHash) => this.client.getBlock({ blockHash })),
    )
    for (let i = 0; i < hashes.length; i++) {
      result[hashes[i]] = Number(blocks[i].timestamp)
    }
    return result
  }
}

function getBlockHashes(logs: Log[]) {
  const hashes = new Set<`0x${string}`>()
  for (const log of logs) {
    if (log.blockHash) {
      hashes.add(log.blockHash)
    }
  }
  return [...hashes]
}
