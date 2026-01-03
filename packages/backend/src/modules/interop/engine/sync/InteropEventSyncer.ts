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
  ChainSpecificAddress,
  type EthereumAddress,
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
import { logToViemLog } from '../capture/getItemsToCapture'
import type { InteropEventStore } from '../capture/InteropEventStore'
import { errorToString, toEventSelector } from '../utils'

const LOG_QUERY_RANGE: Record<string, bigint> = {
  DEFAULT: 2_000n,
  arbitrum: 10_000n,
  optimism: 10_000n,
}

const DEFAULT_RESYNC_DAYS = 1

interface LogQuery {
  topic0s: Set<string>
  addresses: Set<EthereumAddress>
}

export class InteropEventSyncer extends TimeLoop {
  public syncMode: 'follow' | 'catchUp' = 'follow'

  constructor(
    private chain: LongChainName,
    private plugin: InteropPluginResyncable,
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
    try {
      while (this.syncMode === 'catchUp') {
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

    await this.db.transaction(async () => {
      await this.store.saveNewEvents(interopEvents) // TODO: make this idempotent?
      await this.db.interopPluginSyncedRange.upsert({
        pluginName: this.plugin.name,
        chain: this.chain,
        ...syncData.fullRange,
        lastError: null,
      })
      await this.clearChainSyncError(this.chain)
    })

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
    assert(this.plugin.capture)
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
          timestamp: UnixTime(100),
          transactions: [],
        },
      }

      const produced = this.plugin.capture(logToCapture)
      if (produced) {
        interopEvents.push(
          produced.map((p) => ({ ...p, plugin: this.plugin.name })),
        )
      }
    }

    return interopEvents.flat()
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
    const latestBlock = await this.rpcClient.getBlockByNumber('latest', false)
    assert(latestBlock && !isNil(latestBlock.number))

    if (syncedRange?.toBlock === latestBlock.number) {
      return undefined
    }

    let nextFrom: bigint
    let fullFrom: bigint
    let fullFromTimestamp: UnixTime

    if (syncedRange) {
      fullFrom = syncedRange.fromBlock
      fullFromTimestamp = syncedRange.fromTimestamp
      nextFrom = syncedRange.toBlock + 1n
    } else {
      fullFrom = BigInt(
        await getBlockNumberAtOrBefore(
          UnixTime.now() - DEFAULT_RESYNC_DAYS * UnixTime.DAY,
          1,
          Number(latestBlock.number),
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

  private async clearChainSyncError(chain: string) {
    await this.db.interopPluginSyncedRange.updateByPluginNameAndChain(
      this.plugin.name,
      chain,
      {
        lastError: null,
      },
    )
  }

  private async saveChainSyncError(error: unknown) {
    const lastError = errorToString(error)
    await this.db.interopPluginSyncedRange.updateByPluginNameAndChain(
      this.plugin.name,
      this.chain,
      {
        lastError,
      },
    )
  }
}
