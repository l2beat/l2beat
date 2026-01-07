import type { Logger } from '@l2beat/backend-tools'
import type { BlockRangeWithTimestamps, Database } from '@l2beat/database'
import {
  type EthRpcClient,
  type RpcLog,
  toEVMLog,
  UpsertMap,
} from '@l2beat/shared'
import {
  assert,
  type Block,
  ChainSpecificAddress,
  type EthereumAddress,
  type Log,
  type LongChainName,
  UnixTime,
} from '@l2beat/shared-pure'
import isNil from 'lodash/isNil'
import type { Log as ViemLog } from 'viem'
import { getBlockNumberAtOrBefore } from '../../../../peripherals/getBlockNumberAtOrBefore'
import { TimeLoop } from '../../../../tools/TimeLoop'
import type {
  InteropEvent,
  InteropPluginResyncable,
  LogToCapture,
} from '../../plugins/types'
import { getItemsToCapture, logToViemLog } from '../capture/getItemsToCapture'
import type { InteropEventStore } from '../capture/InteropEventStore'
import { errorToString, toEventSelector } from '../utils'

const LOG_QUERY_RANGE: Record<string, bigint> = {
  DEFAULT: 10_000n,
  arbitrum: 100_000n,
  optimism: 100_000n,
}

const DEFAULT_RESYNC_DAYS = 8

export type SyncMode =
  | 'follow'
  | 'catchUp'
  | 'waitForLatestBlockNumber'
  | 'wipingForResync'
const DEFAULT_SYNC_MODE: SyncMode = 'waitForLatestBlockNumber'

interface LogQuery {
  topic0s: Set<string>
  addresses: Set<EthereumAddress>
}

export class InteropEventSyncer extends TimeLoop {
  public syncMode: SyncMode = DEFAULT_SYNC_MODE
  private latestBlockNumber?: bigint

  constructor(
    public readonly chain: LongChainName,
    public readonly plugin: InteropPluginResyncable,
    private cluterPlugins: InteropPluginResyncable[],
    private rpcClient: EthRpcClient,
    private store: InteropEventStore,
    private db: Database,
    protected logger: Logger,
    intervalMs = 10_000,
  ) {
    super({ intervalMs })
    this.logger = logger.for(this)
  }

  async run() {
    if (this.syncMode === 'catchUp') {
      await this.catchUp()
    }
  }

  async catchUp() {
    try {
      while (this.syncMode === 'catchUp') {
        if (await this.isResyncRequested()) {
          await this.wipeAndResync()
          return
        }
        const logQuery = this.buildLogQuery()
        if (logQuery.topic0s.size === 0 || logQuery.addresses.size === 0) {
          break
        }
        const status = await this.syncNextRange(logQuery)
        if (status === 'atTip') {
          this.syncMode = 'follow'
        }
      }
    } catch (error) {
      this.logger.error('Error syncing chain', error, {
        pluginName: this.plugin.name,
        chain: this.chain,
      })
      await this.saveChainSyncError(error)
    }
  }

  private async syncNextRange(
    logQuery: LogQuery,
  ): Promise<'beforeTip' | 'atTip'> {
    const syncData = await this.calculateNextRange()
    if (!syncData) {
      return 'atTip'
    }

    const interopEvents = await this.captureRange(syncData.nextRange, logQuery)

    await this.saveProducedInteropEvents(interopEvents, syncData.fullRange)

    this.logger.info('New range synced', {
      chain: this.chain,
      pluginName: this.plugin.name,
      range: syncData.nextRange,
    })

    return syncData.fullRange.toBlock === syncData.latestBlockNumber
      ? 'atTip'
      : 'beforeTip'
  }

  private async captureRange(
    range: { from: bigint; to: bigint },
    logQueryForChain: LogQuery,
  ): Promise<InteropEvent[]> {
    const logs = await this.fetchLogsForRange(
      this.chain,
      logQueryForChain,
      range,
    )

    const logsPerTx = new UpsertMap<string, ViemLog[]>()
    for (const log of logs) {
      assert(log.transactionHash)
      const v = logsPerTx.getOrInsert(log.transactionHash, [])
      v.push(logToViemLog(toEVMLog(log)))
    }

    const interopEvents = []
    for (const log of logs) {
      assert(log.transactionHash)
      assert(log.blockNumber)
      assert(
        log.blockTimestamp,
        `Missing log.blockTimestamp on chain ${this.chain}`,
      )

      const logToCapture: LogToCapture = {
        log: logToViemLog(toEVMLog(log)),
        txLogs: logsPerTx.get(log.transactionHash) ?? [],
        tx: { hash: log.transactionHash },
        chain: this.chain,
        block: {
          number: Number(log.blockNumber),
          // Fake the following fields, since block is not used and soon will be removed
          hash: '123',
          logsBloom: '123',
          timestamp: Number(log.blockTimestamp),
          transactions: [],
        },
      }

      const produced = this.captureLog(logToCapture)
      if (produced) {
        interopEvents.push(produced)
      }
    }

    return interopEvents.flat()
  }

  private captureLog(logToCapture: LogToCapture) {
    let produced
    // If you're in a cluster, go through plugins in order
    if (this.cluterPlugins.length > 0) {
      for (const p of this.cluterPlugins) {
        produced = p.capture(logToCapture)
        if (produced) {
          break
        }
      }
    } else {
      produced = this.plugin.capture(logToCapture)
    }

    if (!produced) {
      return
    }
    return produced.map((p) => ({ ...p, plugin: this.plugin.name }))
  }

  private getLatestBlockNumber(): bigint | undefined {
    return this.latestBlockNumber
  }

  private async calculateNextRange(): Promise<
    | {
        nextRange: { from: bigint; to: bigint }
        fullRange: BlockRangeWithTimestamps
        latestBlockNumber: bigint
      }
    | undefined
  > {
    const syncedRange =
      await this.db.interopPluginSyncedRange.findByPluginNameAndChain(
        this.plugin.name,
        this.chain,
      )

    // TODO: if there's no syncedRange, see if we're already following due to old implementation
    // and setup everything accordingly

    const latestBlockNumber = this.getLatestBlockNumber()
    assert(latestBlockNumber)
    const latestBlock = await this.rpcClient.getBlockByNumber(
      latestBlockNumber,
      false,
    )
    assert(latestBlock && !isNil(latestBlock.number))

    if ((syncedRange?.toBlock ?? -1) >= latestBlock.number) {
      return undefined // we're already at or after latest block
    }

    let nextFrom: bigint
    let fullFrom: bigint
    let fullFromTimestamp: UnixTime

    if (syncedRange) {
      fullFrom = syncedRange.fromBlock
      fullFromTimestamp = syncedRange.fromTimestamp
      nextFrom = syncedRange.toBlock + 1n
    } else {
      fullFrom = await this.getBlockNumberAtOrBefore(latestBlock.number)
      const fromBlock = await this.rpcClient.getBlockByNumber(fullFrom, false)
      assert(fromBlock)
      nextFrom = fullFrom
      fullFromTimestamp = UnixTime(Number(fromBlock.timestamp))
    }

    let nextTo: bigint
    let fullTo: bigint
    let fullToTimestamp: UnixTime

    const queryRange = LOG_QUERY_RANGE[this.chain] ?? LOG_QUERY_RANGE.DEFAULT
    nextTo = nextFrom + queryRange - 1n
    assert(nextTo > nextFrom)
    if (nextTo >= latestBlock.number) {
      nextTo = latestBlock.number
      fullTo = nextTo
      fullToTimestamp = UnixTime(Number(latestBlock.timestamp))
    } else {
      const toBlock = await this.rpcClient.getBlockByNumber(nextTo, false)
      assert(toBlock)
      fullTo = nextTo
      fullToTimestamp = UnixTime(Number(toBlock.timestamp))
    }

    return {
      nextRange: { from: nextFrom, to: nextTo },
      fullRange: {
        fromBlock: fullFrom,
        fromTimestamp: fullFromTimestamp,
        toBlock: fullTo,
        toTimestamp: fullToTimestamp,
      },
      latestBlockNumber: latestBlock.number,
    }
  }

  private async fetchLogsForRange(
    chain: string,
    logQuery: LogQuery,
    range: { from: bigint; to: bigint },
  ): Promise<RpcLog[]> {
    this.logger.info('Getting logs', {
      chain,
      from: range.from,
      to: range.to,
      addresses: logQuery.addresses,
      topics: [logQuery.topic0s],
    })

    const logs = await this.rpcClient.getLogs({
      fromBlock: range.from,
      toBlock: range.to,
      address: Array.from(logQuery.addresses),
      topics: [Array.from(logQuery.topic0s)],
    })

    return logs
  }

  buildLogQuery() {
    const result: LogQuery = {
      topic0s: new Set(),
      addresses: new Set(),
    }
    const eventRequests = this.plugin
      .getDataRequests()
      .filter((r) => r.type === 'event')

    for (const eventRequest of eventRequests) {
      let addressesOnThisChain = 0
      for (const address of eventRequest.addresses) {
        if (ChainSpecificAddress.longChain(address) !== this.chain) {
          continue
        }
        const ethAddress = ChainSpecificAddress.address(address)
        result.addresses.add(ethAddress)
        addressesOnThisChain++
      }
      if (addressesOnThisChain > 0) {
        const topic0 = toEventSelector(eventRequest.signature)
        result.topic0s.add(topic0)
      }
    }

    return result
  }

  private async isResyncRequested() {
    const syncState =
      await this.db.interopPluginSyncState.findByPluginNameAndChain(
        this.plugin.name,
        this.chain,
      )
    return !!syncState?.resyncRequestedFrom
  }

  private async clearChainSyncError() {
    await this.db.interopPluginSyncState.setLastError(
      this.plugin.name,
      this.chain,
      null,
    )
  }

  private async saveChainSyncError(error: unknown) {
    await this.db.interopPluginSyncState.setLastError(
      this.plugin.name,
      this.chain,
      errorToString(error),
    )
  }

  private async bootstrapSyncedRange(
    incomingBlock: Block,
  ): Promise<BlockRangeWithTimestamps> {
    const oldestEvent =
      await this.db.interopEvent.getOldestEventForPluginAndChan(
        this.plugin.name,
        this.chain,
      )
    return oldestEvent
      ? {
          fromBlock: BigInt(oldestEvent.blockNumber),
          fromTimestamp: oldestEvent.timestamp,
          toBlock: BigInt(incomingBlock.number),
          toTimestamp: UnixTime(incomingBlock.timestamp),
        }
      : {
          fromBlock: BigInt(incomingBlock.number),
          fromTimestamp: UnixTime(incomingBlock.timestamp),
          toBlock: BigInt(incomingBlock.number),
          toTimestamp: UnixTime(incomingBlock.timestamp),
        }
  }

  async processNewestBlock(block: Block, logs: Log[]) {
    if (await this.isResyncRequested()) {
      await this.wipeAndResync()
      return
    }

    if (
      this.syncMode !== 'follow' &&
      this.syncMode !== 'waitForLatestBlockNumber'
    ) {
      return
    }

    const blockNumber = BigInt(block.number)
    this.latestBlockNumber = blockNumber

    const lastSyncedRecord =
      await this.db.interopPluginSyncedRange.findByPluginNameAndChain(
        this.plugin.name,
        this.chain,
      )

    let updatedSyncedRange: BlockRangeWithTimestamps
    if (lastSyncedRecord) {
      if (lastSyncedRecord.toBlock < blockNumber - 1n) {
        this.syncMode = 'catchUp' // block too far ahead, let's catch up first
        return
      }

      if (lastSyncedRecord.toBlock >= blockNumber) {
        return // skip, we're already synced further than this block
      }
      updatedSyncedRange = {
        fromBlock: lastSyncedRecord.fromBlock,
        fromTimestamp: lastSyncedRecord.fromTimestamp,
        toBlock: blockNumber,
        toTimestamp: block.timestamp,
      }
    } else {
      updatedSyncedRange = await this.bootstrapSyncedRange(block)
    }

    this.syncMode = 'follow'

    const interopEvents = []
    const toCapture = getItemsToCapture(this.chain, block, logs)
    for (const logToCapture of toCapture.logsToCapture) {
      const produced = this.captureLog(logToCapture)
      if (produced) {
        interopEvents.push(
          produced.map((p) => ({ ...p, plugin: this.plugin.name })),
        )
      }
    }

    await this.saveProducedInteropEvents(
      interopEvents.flat(),
      updatedSyncedRange,
    )
  }

  private async saveProducedInteropEvents(
    interopEvents: InteropEvent[],
    fullRange: BlockRangeWithTimestamps,
  ) {
    await this.db.transaction(async () => {
      await this.store.saveNewEvents(interopEvents) // TODO: make this idempotent?
      await this.db.interopPluginSyncedRange.upsert({
        pluginName: this.plugin.name,
        chain: this.chain,
        ...fullRange,
      })
      await this.clearChainSyncError()
    })

    this.logger.info('Events captured for resyncable plugin', {
      plugin: this.plugin.name,
      chain: this.chain,
      blockNumber: fullRange.toBlock,
      events: interopEvents.length,
    })

    this.logger.info('Block processed for resyncable plugin', {
      plugin: this.plugin.name,
      chain: this.chain,
      blockNumber: fullRange.toBlock,
      events: interopEvents.length,
    })
  }

  private async getBlockNumberAtOrBefore(blockNumber: bigint): Promise<bigint> {
    return BigInt(
      await getBlockNumberAtOrBefore(
        UnixTime.now() - DEFAULT_RESYNC_DAYS * UnixTime.DAY,
        1,
        Number(blockNumber),
        async (number: number) => {
          const block = await this.rpcClient.getBlockByNumber(
            BigInt(number),
            false,
          )
          assert(block)
          return { timestamp: Number(block.timestamp) }
        },
      ),
    )
  }

  private async wipeAndResync() {
    this.syncMode = 'wipingForResync'
    await this.db.transaction(async () => {
      await this.db.interopMessage.deleteForPlugin(this.plugin.name)
      await this.db.interopTransfer.deleteForPlugin(this.plugin.name)
      await this.store.deleteAllForPlugin(this.plugin.name)
    })
    this.db.interopPluginSyncedRange.deleteByPluginName(this.plugin.name)
    this.db.interopPluginSyncState.setResyncRequestedFrom(
      this.plugin.name,
      this.chain,
      null,
    )
    this.syncMode = DEFAULT_SYNC_MODE
  }
}
