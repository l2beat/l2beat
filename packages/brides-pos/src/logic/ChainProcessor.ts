import type { Logger } from '@l2beat/backend-tools'
import type { Log, PublicClient } from 'viem'
import type { ChainInfo } from '../config/chains'
import { TaskQueue } from '../services/TaskQueue'
import type { MessageService } from './MessageService'
import { analyzeLogs } from './analyze/analyze'
import type { LogWithTimestamp } from './analyze/common'

const MAX_BLOCK_RANGE = 50n

export class ChainProcessor {
  private nextJobId = 1
  private jobs: Record<number, Log[]> = {}
  private queue: TaskQueue<number>
  private lastBlock: bigint = 0n

  constructor(
    private chain: ChainInfo,
    private client: PublicClient,
    private messageService: MessageService,
    private logger: Logger,
  ) {
    this.logger = logger.for(this).configure({ tag: chain.name })
    this.queue = new TaskQueue(this.processLogs, this.logger)
  }

  async start() {
    this.lastBlock =
      this.chain.name === 'ethereum'
        ? 22274990n
        : this.chain.name === 'gnosis'
          ? 39573640n
          : await this.client.getBlockNumber()
    this.logger.info('Started', { fromBlock: Number(this.lastBlock) })
    setTimeout(this.pollLogs)
  }

  private pollLogs = async () => {
    try {
      const currentBlock = await this.client.getBlockNumber()
      if (currentBlock !== this.lastBlock) {
        const target = min(this.lastBlock + MAX_BLOCK_RANGE, currentBlock)
        const logs = await this.client.getLogs({
          fromBlock: this.lastBlock + 1n,
          toBlock: target,
        })
        this.lastBlock = target
        this.onLogs(logs)
      }
    } catch (e) {
      console.error(e)
    }
    setTimeout(this.pollLogs, 2_000)
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
    this.logger.info('Job completed', { jobId, messages: messages.length })
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

const min = (a: bigint, b: bigint) => (a > b ? b : a)
