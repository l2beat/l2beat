import type { Logger } from '@l2beat/backend-tools'
import type { Database, TokenDatabase } from '@l2beat/database'
import type { TokenIngestionQueueState } from '@l2beat/database/dist/repositories/TokenIngestionQueueRepository'
import type { IngestionOutcome } from './IngestionTrace'
import {
  buildInteropTransferIndex,
  normalizeInteropTokenAddress,
} from './InteropTransferIndex'
import type { TokenIngestionProcessor } from './TokenIngestionProcessor'

const INTEROP_TRANSFERS_LAST_SERIAL_ID_KEY = 'interop-transfers:lastSerialId'
const DEFAULT_MAX_PROCESSED_PER_RUN = 1_000

export interface TokenIngestionLoopConfig {
  intervalMs: number
  newQueueState?: Extract<TokenIngestionQueueState, 'staged' | 'pending'>
  maxProcessedPerRun?: number
}

export class TokenIngestionLoop {
  private running = false
  private intervalHandle: ReturnType<typeof setInterval> | undefined
  private readonly maxProcessedPerRun: number

  constructor(
    private readonly db: Database,
    private readonly tokenDb: TokenDatabase,
    private readonly processor: TokenIngestionProcessor,
    private readonly logger: Logger,
    private readonly config: TokenIngestionLoopConfig,
  ) {
    this.logger = logger.for(this)
    this.maxProcessedPerRun =
      config.maxProcessedPerRun ?? DEFAULT_MAX_PROCESSED_PER_RUN

    if (
      !Number.isInteger(this.maxProcessedPerRun) ||
      this.maxProcessedPerRun < 1
    ) {
      throw new Error('maxProcessedPerRun must be an integer greater than 0')
    }
  }

  start() {
    if (this.intervalHandle) {
      return
    }

    this.logger.info('Started', { intervalMs: this.config.intervalMs })
    void this.runTick()
    this.intervalHandle = setInterval(
      () => void this.runTick(),
      this.config.intervalMs,
    )
  }

  stop() {
    if (!this.intervalHandle) {
      return
    }

    clearInterval(this.intervalHandle)
    this.intervalHandle = undefined
    this.logger.info('Stopped')
  }

  async runOnce() {
    await this.enqueueNewInteropTransferTokens()
    await this.drainPendingQueue()
  }

  private async enqueueNewInteropTransferTokens() {
    const setting = await this.tokenDb.tokenDbSetting.get(
      INTEROP_TRANSFERS_LAST_SERIAL_ID_KEY,
    )
    const lastSerialId = setting?.value ?? '0'
    const batch =
      await this.db.interopTransfer.getTokenAddressesAfterSerialId(lastSerialId)

    if (batch.latestSerialId === undefined) {
      this.logger.debug('No new interop transfers found')
      return
    }

    for (const tokenAddress of batch.tokenAddresses) {
      const address = normalizeInteropTokenAddress(tokenAddress.address)
      if (address) {
        await this.tokenDb.tokenIngestionQueue.enqueue(
          {
            chain: tokenAddress.chain,
            address,
          },
          this.getNewQueueState(),
        )
      }
    }

    await this.tokenDb.tokenDbSetting.set({
      key: INTEROP_TRANSFERS_LAST_SERIAL_ID_KEY,
      value: batch.latestSerialId,
    })

    this.logger.info('Queued token ingestion addresses', {
      transfers: batch.transferCount,
      tokenAddresses: batch.tokenAddresses.length,
      lastSerialId: batch.latestSerialId,
    })
  }

  private getNewQueueState() {
    return this.config.newQueueState ?? 'pending'
  }

  private async drainPendingQueue() {
    const startedAt = Date.now()
    const outcomeCounts = createOutcomeCounts()
    const seenAddresses = new Set<string>()
    const reprocessedAddresses = new Set<string>()
    let processed = 0

    const transfers = await this.db.interopTransfer.getAll()
    const transferIndex = buildInteropTransferIndex(transfers)
    let entry = await this.tokenDb.tokenIngestionQueue.findNextPending()

    while (entry && processed < this.maxProcessedPerRun) {
      const addressKey = queueAddressKey(entry)
      if (seenAddresses.has(addressKey)) {
        reprocessedAddresses.add(addressKey)
      }
      seenAddresses.add(addressKey)

      const trace = await this.processor.process(entry, transferIndex)
      outcomeCounts[trace.outcome.kind] += 1
      processed += 1
      entry = await this.tokenDb.tokenIngestionQueue.findNextPending()
    }

    const limitReached = entry !== undefined
    const remainingPending = limitReached
      ? await this.tokenDb.tokenIngestionQueue.countPending()
      : 0

    this.logDrainSummary({
      processed,
      remainingPending,
      limitReached,
      outcomeCounts,
      reprocessedAddressesCount: reprocessedAddresses.size,
      durationMs: Date.now() - startedAt,
    })
  }

  private logDrainSummary(summary: {
    processed: number
    remainingPending: number
    limitReached: boolean
    outcomeCounts: OutcomeCounts
    reprocessedAddressesCount: number
    durationMs: number
  }) {
    const parameters = {
      processed: summary.processed,
      remainingPending: summary.remainingPending,
      maxProcessedPerRun: this.maxProcessedPerRun,
      limitReached: summary.limitReached,
      outcomes: summary.outcomeCounts,
      reprocessedAddressesCount: summary.reprocessedAddressesCount,
      durationMs: summary.durationMs,
    }

    if (summary.limitReached) {
      this.logger.warn(
        'Token ingestion queue drain stopped at processing limit',
        parameters,
      )
      return
    }

    this.logger.info('Token ingestion queue drain finished', parameters)
  }

  private async runTick() {
    if (this.running) {
      return
    }

    this.running = true
    try {
      await this.runOnce()
    } catch (error) {
      this.logger.error(error)
    } finally {
      this.running = false
    }
  }
}

type OutcomeCounts = Record<IngestionOutcome['kind'], number>

function createOutcomeCounts(): OutcomeCounts {
  return {
    skip: 0,
    conflict: 0,
    error: 0,
    noop: 0,
    write: 0,
    pending: 0,
  }
}

function queueAddressKey(address: { chain: string; address: string }): string {
  return `${address.chain}:${address.address.toLowerCase()}`
}
