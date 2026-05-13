import type { Logger } from '@l2beat/backend-tools'
import type { Database, TokenDatabase } from '@l2beat/database'
import type { TokenIngestionQueueState } from '@l2beat/database/dist/repositories/TokenIngestionQueueRepository'
import {
  buildInteropTransferIndex,
  normalizeInteropTokenAddress,
} from './InteropTransferIndex'
import type { TokenIngestionProcessor } from './TokenIngestionProcessor'

const INTEROP_TRANSFERS_LAST_SERIAL_ID_KEY = 'interop-transfers:lastSerialId'

export interface TokenIngestionLoopConfig {
  intervalMs: number
  newQueueState?: Extract<TokenIngestionQueueState, 'staged' | 'pending'>
}

export class TokenIngestionLoop {
  private running = false
  private intervalHandle: ReturnType<typeof setInterval> | undefined

  constructor(
    private readonly db: Database,
    private readonly tokenDb: TokenDatabase,
    private readonly processor: TokenIngestionProcessor,
    private readonly logger: Logger,
    private readonly config: TokenIngestionLoopConfig,
  ) {
    this.logger = logger.for(this)
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
    const transfers = await this.db.interopTransfer.getAll()
    const transferIndex = buildInteropTransferIndex(transfers)

    while (true) {
      const entry = await this.tokenDb.tokenIngestionQueue.findNextPending()
      if (!entry) {
        return
      }

      await this.processor.process(entry, transferIndex)
    }
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
