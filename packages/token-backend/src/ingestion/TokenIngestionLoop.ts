import type { Logger } from '@l2beat/backend-tools'
import type { Database, TokenDatabase } from '@l2beat/database'
import type { ChainRecord } from '@l2beat/database/dist/repositories/ChainRepository'
import type { Chain } from '../chains/Chain'
import type { CoingeckoClient } from '../chains/clients/coingecko/CoingeckoClient'
import type { DeployedTokenFacts } from '../chains/fetchDeployedTokenFacts'
import {
  buildInteropTransferIndex,
  normalizeInteropTokenAddress,
} from './InteropTransferIndex'
import { TokenIngestionProcessor } from './TokenIngestionProcessor'

const INTEROP_TRANSFERS_LAST_SERIAL_ID_KEY = 'interop-transfers:lastSerialId'

export interface TokenIngestionLoopConfig {
  intervalMs: number
  etherscanApiKey: string | undefined
  createChain?: (chainRecord: ChainRecord) => Chain
  fetchDeployedTokenFacts?: (
    chain: Chain,
    address: string,
  ) => Promise<DeployedTokenFacts>
  generateAbstractTokenId?: () => string
}

export class TokenIngestionLoop {
  private running = false
  private intervalHandle: ReturnType<typeof setInterval> | undefined
  private readonly processor: TokenIngestionProcessor

  constructor(
    private readonly db: Database,
    private readonly tokenDb: TokenDatabase,
    coingeckoClient: CoingeckoClient,
    private readonly logger: Logger,
    private readonly config: TokenIngestionLoopConfig,
  ) {
    this.logger = logger.for(this)
    this.processor = new TokenIngestionProcessor({
      db,
      tokenDb,
      coingeckoClient,
      etherscanApiKey: config.etherscanApiKey,
      createChain: config.createChain,
      fetchDeployedTokenFacts: config.fetchDeployedTokenFacts,
      generateAbstractTokenId: config.generateAbstractTokenId,
    })
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
        await this.tokenDb.tokenIngestionQueue.enqueue({
          chain: tokenAddress.chain,
          address,
        })
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
