import type { Logger } from '@l2beat/backend-tools'
import type { BlockRangeWithTimestamps } from '@l2beat/database'
import {
  getBlockNumberAtOrBefore,
  type RpcLog,
  toEVMLog,
  UpsertMap,
} from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import isNil from 'lodash/isNil'
import type { Log as ViemLog } from 'viem'
import type { InteropEvent, LogToCapture } from '../../plugins/types'
import { logToViemLog } from '../capture/getItemsToCapture'
import { FollowingState } from './FollowingState'
import type {
  InteropEventSyncer,
  LogQuery,
  SyncerState,
  TimeloopState,
} from './InteropEventSyncer'

const LOG_QUERY_RANGE: Record<string, bigint> = {
  DEFAULT: 10_000n,
  arbitrum: 100_000n,
  optimism: 100_000n,
}

interface RangeData {
  nextRange: { from: bigint; to: bigint }
  fullRange: BlockRangeWithTimestamps
  latestBlockNumber: bigint
}

export class CatchingUpState implements TimeloopState {
  type = 'timeLoop' as const
  name = 'catchingUp'
  status = 'starting'
  working = false

  constructor(
    private readonly syncer: InteropEventSyncer,
    private readonly logger: Logger,
  ) {}

  async run(): Promise<SyncerState> {
    return await this.catchUp()
  }

  async catchUp(): Promise<SyncerState> {
    while (true) {
      if (this.syncer.latestBlockNumber === undefined) {
        this.status = 'waiting for block number'
        return this
      }

      const resyncFrom = await this.syncer.isResyncRequestedFrom()
      if (resyncFrom !== undefined) {
        this.status = 'deleting all data for resync'
        await this.deleteAllClusterData()
      }

      this.status = 'syncing'
      const rangeData = await this.calculateNextRange(
        this.syncer.latestBlockNumber,
        resyncFrom,
      )
      if (rangeData) {
        const logQuery = this.syncer.buildLogQuery()
        await this.syncRange(logQuery, rangeData)

        if (resyncFrom) {
          await this.clearResyncRequestFlag()
        }
      }

      if (
        rangeData &&
        rangeData.fullRange.toBlock === rangeData.latestBlockNumber
      ) {
        // we're at tip, start following
        this.status = 'idle'
        return new FollowingState(this.syncer, this.logger)
      }
    }
  }

  private async syncRange(logQuery: LogQuery, rangeData: RangeData) {
    const interopEvents = logQuery.isEmpty()
      ? []
      : await this.captureRange(rangeData.nextRange, logQuery)

    await this.syncer.saveProducedInteropEvents(
      interopEvents,
      rangeData.fullRange,
    )

    this.logger.info('New range synced', {
      chain: this.syncer.chain,
      pluginName: this.syncer.plugin.name,
      range: rangeData.nextRange,
    })
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

    const logs = await this.syncer.rpcClient.getLogs({
      fromBlock: range.from,
      toBlock: range.to,
      address: Array.from(logQuery.addresses),
      topics: [Array.from(logQuery.topic0s)],
    })

    return logs
  }

  private async captureRange(
    range: { from: bigint; to: bigint },
    logQueryForChain: LogQuery,
  ): Promise<InteropEvent[]> {
    const logs = await this.fetchLogsForRange(
      this.syncer.chain,
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
        `Missing log.blockTimestamp on chain ${this.syncer.chain}`,
      )

      const logToCapture: LogToCapture = {
        log: logToViemLog(toEVMLog(log)),
        txLogs: logsPerTx.get(log.transactionHash) ?? [],
        tx: { hash: log.transactionHash },
        chain: this.syncer.chain,
        block: {
          number: Number(log.blockNumber),
          // Fake the following fields, since block is not used and soon will be removed
          hash: '123',
          logsBloom: '123',
          timestamp: Number(log.blockTimestamp),
          transactions: [],
        },
      }

      const produced = this.syncer.captureLog(logToCapture)
      if (produced) {
        interopEvents.push(produced)
      }
    }

    return interopEvents.flat()
  }

  private async deleteAllClusterData() {
    const pluginsToWipe =
      this.syncer.clusterPlugins.length > 0
        ? this.syncer.clusterPlugins
        : [this.syncer.plugin]

    await this.syncer.db.transaction(async () => {
      for (const plugin of pluginsToWipe) {
        // Delete messages:
        await this.syncer.db.interopMessage.deleteForPlugin(plugin.name)
        // Delete transfers:
        await this.syncer.db.interopTransfer.deleteForPlugin(plugin.name)
        // Delete events:
        await this.syncer.store.deleteAllForPlugin(plugin.name)
        // Delete synced range data:
        await this.syncer.db.interopPluginSyncedRange.deleteByPluginName(
          plugin.name,
        )
      }
    })
  }

  async clearResyncRequestFlag() {
    await this.syncer.db.interopPluginSyncState.setResyncRequestedFrom(
      this.syncer.plugin.name,
      this.syncer.chain,
      null,
    )
  }

  private async calculateNextRange(
    toBlockNumber: bigint,
    forcedFromTimestamp?: UnixTime,
  ): Promise<RangeData | undefined> {
    const syncedRange =
      await this.syncer.db.interopPluginSyncedRange.findByPluginNameAndChain(
        this.syncer.plugin.name,
        this.syncer.chain,
      )

    const latestBlock = await this.syncer.rpcClient.getBlockByNumber(
      toBlockNumber,
      false,
    )
    assert(latestBlock && !isNil(latestBlock.number))

    if ((syncedRange?.toBlock ?? -1) >= latestBlock.number) {
      return undefined // we're already at or after latest block
    }

    let nextFrom: bigint
    let fullFrom: bigint
    let fullFromTimestamp: UnixTime

    if (forcedFromTimestamp) {
      fullFrom = await this.getBlockNumberAtOrBefore(
        forcedFromTimestamp,
        toBlockNumber,
      )
      const fromBlock = await this.syncer.rpcClient.getBlockByNumber(
        fullFrom,
        false,
      )
      assert(fromBlock)
      fullFromTimestamp = UnixTime(Number(fromBlock.timestamp))
      nextFrom = fullFrom
    } else if (syncedRange) {
      fullFrom = syncedRange.fromBlock
      fullFromTimestamp = syncedRange.fromTimestamp
      nextFrom = syncedRange.toBlock + 1n
    } else {
      throw new Error(
        `Can't resync ${this.syncer.plugin.name} plugin without "from" timestamp`,
      )
    }

    let nextTo: bigint
    let fullTo: bigint
    let fullToTimestamp: UnixTime

    const queryRange =
      LOG_QUERY_RANGE[this.syncer.chain] ?? LOG_QUERY_RANGE.DEFAULT
    nextTo = nextFrom + queryRange - 1n
    assert(nextTo > nextFrom)
    if (nextTo >= latestBlock.number) {
      nextTo = latestBlock.number
      fullTo = nextTo
      fullToTimestamp = UnixTime(Number(latestBlock.timestamp))
    } else {
      const toBlock = await this.syncer.rpcClient.getBlockByNumber(
        nextTo,
        false,
      )
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

  private async getBlockNumberAtOrBefore(
    timestamp: UnixTime,
    latestBlockNumber: bigint,
  ): Promise<bigint> {
    return BigInt(
      await getBlockNumberAtOrBefore(
        timestamp,
        1,
        Number(latestBlockNumber),
        async (number: number) => {
          const block = await this.syncer.rpcClient.getBlockByNumber(
            BigInt(number),
            false,
          )
          assert(block)
          return { timestamp: Number(block.timestamp) }
        },
      ),
    )
  }
}
