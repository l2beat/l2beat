import type { Logger } from '@l2beat/backend-tools'
import { http, type Log, type PublicClient, createPublicClient } from 'viem'
import type { ChainInfo } from '../config/chains'
import { TaskQueue } from '../services/TaskQueue'
import type { MessageService } from './MessageService'
import { type LogWithTimestamp, analyzeLogs } from './analyze'

export class ChainProcessor {
  private client: PublicClient
  private nextJobId = 1
  private jobs: Record<number, Log[]> = {}
  private queue: TaskQueue<number>

  constructor(
    private chain: ChainInfo,
    rpcUrl: string,
    private messageService: MessageService,
    private logger: Logger,
  ) {
    this.logger = logger.for(this).configure({ tag: chain.name })
    this.client = createPublicClient({
      transport: http(rpcUrl),
    })
    this.queue = new TaskQueue(this.processLogs, this.logger)
  }

  async start() {
    this.logger.info('Started')
    const block = await this.client.getBlockNumber()
    this.client.watchEvent({
      fromBlock: block - 10n,
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
    const logsWithTimestamps = await this.addTimestamps(logs)
    const messages = analyzeLogs(logsWithTimestamps, this.chain)
    for (const message of messages) {
      this.messageService.onMessage(message)
    }
    delete this.jobs[jobId]
  }

  private async addTimestamps(logs: Log[]): Promise<LogWithTimestamp[]> {
    const hashSet = new Set<`0x${string}`>()
    for (const log of logs) {
      if (log.blockHash) {
        hashSet.add(log.blockHash)
      }
    }
    const hashes = [...hashSet]

    const timestamps: Record<`0x${string}`, number> = {}
    const blocks = await Promise.all(
      hashes.map((blockHash) => this.client.getBlock({ blockHash })),
    )
    for (let i = 0; i < hashes.length; i++) {
      timestamps[hashes[i]] = Number(blocks[i].timestamp)
    }

    return logs.map((log) => ({
      ...log,
      timestamp: timestamps[log.blockHash ?? `0x`] ?? 0,
    }))
  }
}
