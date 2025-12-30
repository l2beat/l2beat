import type { Logger } from '@l2beat/backend-tools'
import type { BlockRangeWithTimestamps, Database } from '@l2beat/database'
import {
  EthRpcClient,
  Http,
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
import { encodeEventTopics, parseAbi } from 'viem'
import type { ChainApi } from '../../../../config/chain/ChainApi'
import type {
  DataRequest,
  InteropEvent,
  InteropPlugin,
  LogToCapture,
} from '../../plugins/types'
import { logToViemLog } from '../capture/getItemsToCapture'
import type { InteropEventStore } from '../capture/InteropEventStore'

const DEFAULT_LOGS_RANGE = 2_000n
const DEFAULT_RESYNC_BLOCKS = 20_000n

interface LogQuery {
  topic0s: Set<string>
  addresses: Set<EthereumAddress>
}

export class InteropPluginSyncer {
  private rpcClients: { [chain: string]: EthRpcClient } = {}

  constructor(
    private enabledChains: { name: string; type: 'evm' }[],
    private chainConfigs: ChainApi[],
    private plugin: InteropPlugin,
    private store: InteropEventStore,
    private db: Database,
    private logger: Logger,
    private delayMs = 10 * 1_000,
    private errorDelayMs = 10 * 1_000,
  ) {
    this.logger = logger.for(this)
  }

  async start() {
    try {
      if (!this.plugin.getDataRequests || !this.plugin.capture) {
        return // This plugin doesn't support re-syncing.
      }

      const logQueryPerChain = this.groupEventDataRequests(
        this.plugin.getDataRequests(),
      )

      await this.getPluginStatus(this.plugin.name) // init plugin status if null

      const tasksPerChain = []
      for (const [chain, logQuery] of logQueryPerChain) {
        if (!this.enabledChains.map((c) => c.name).includes(chain)) {
          continue
        }
        const syncLoop = this.chainSyncLoop(chain, logQuery)
        tasksPerChain.push(syncLoop)
      }

      await this.clearPluginError()
      await Promise.all(tasksPerChain)
    } catch (error) {
      this.savePluginError(error, 'SYNCING STOPPED! ')
    }
  }

  private async chainSyncLoop(chain: string, logQueryForChain: LogQuery) {
    while (true) {
      try {
        const syncData = await this.calculateNextRange(this.plugin.name, chain)
        if (!syncData) {
          await this.sleepMs(this.delayMs)
          continue
        }

        const interopEvents = await this.captureRange(
          chain,
          syncData.nextRange,
          logQueryForChain,
        )

        await this.db.transaction(async () => {
          await this.store.saveNewEvents(interopEvents) // TODO: make this idempotent?
          await this.db.interopPluginSyncedRange.upsert({
            pluginName: this.plugin.name,
            chain,
            ...syncData.fullRange,
            lastError: null,
          })
          await this.clearChainSyncError(chain)
        })

        this.logger.info('New range synced', {
          chain,
          pluginName: this.plugin.name,
          range: syncData.nextRange,
        })

        if (syncData.fullRange.toBlock === syncData.latestBlockNumber) {
          await this.sleepMs(this.delayMs)
        }
      } catch (error) {
        await this.saveChainSyncError(chain, error)
        await this.sleepMs(this.errorDelayMs ?? this.delayMs)
      }
    }
  }

  private async captureRange(
    chain: string,
    range: { from: bigint; to: bigint },
    logQueryForChain: LogQuery,
  ): Promise<InteropEvent[]> {
    assert(this.plugin.capture)
    const logs = await this.fetchLogsForRange(chain, logQueryForChain, range)

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
        chain,
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

  private async calculateNextRange(
    pluginName: string,
    chain: string,
  ): Promise<
    | {
        nextRange: { from: bigint; to: bigint }
        fullRange: BlockRangeWithTimestamps
        latestBlockNumber: bigint
      }
    | undefined
  > {
    const client = this.getRpcClient(chain)
    const syncedRange =
      await this.db.interopPluginSyncedRange.findByPluginNameAndChain(
        pluginName,
        chain,
      )
    const latestBlock = await client.getBlockByNumber('latest', false)
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
      fullFrom = latestBlock.number - DEFAULT_RESYNC_BLOCKS
      const fromBlock = await client.getBlockByNumber(fullFrom, false)
      assert(fromBlock)
      nextFrom = fullFrom
      fullFromTimestamp = UnixTime(Number(fromBlock.timestamp))
    }

    let nextTo: bigint
    let fullTo: bigint
    let fullToTimestamp: UnixTime

    nextTo = nextFrom + DEFAULT_LOGS_RANGE - 1n
    assert(nextTo > nextFrom)
    if (nextTo >= latestBlock.number) {
      nextTo = latestBlock.number
      fullTo = nextTo
      fullToTimestamp = UnixTime(Number(latestBlock.timestamp))
    } else {
      const toBlock = await client.getBlockByNumber(nextTo, false)
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
    const client = this.getRpcClient(chain)

    this.logger.info('Getting logs', {
      chain,
      from: range.from,
      to: range.to,
      addresses: logQuery.addresses,
      topics: [logQuery.topic0s],
    })

    const logs = await client.getLogs({
      fromBlock: range.from,
      toBlock: range.to,
      address: Array.from(logQuery.addresses),
      topics: [Array.from(logQuery.topic0s)],
    })

    return logs
  }

  private async getPluginStatus(pluginName: string) {
    let pluginStatus =
      await this.db.interopPluginStatus.findByPluginName(pluginName)

    if (!pluginStatus) {
      pluginStatus = await this.db.interopPluginStatus.insert({
        pluginName,
        lastError: null,
        resyncRequestedFrom: null,
      })
    }

    return pluginStatus
  }

  groupEventDataRequests(dataRequests: DataRequest[]) {
    const chainToLogQuery = new UpsertMap<LongChainName, LogQuery>()
    const eventRequests = dataRequests.filter((r) => r.type === 'evmEvent')

    for (const eventRequest of eventRequests) {
      const topic0 = toEventSelector(eventRequest.signature)
      for (const address of eventRequest.addresses) {
        const longChain = ChainSpecificAddress.longChain(address)
        const ethAddress = ChainSpecificAddress.address(address)
        const logQuery = chainToLogQuery.getOrInsert(longChain, {
          topic0s: new Set(),
          addresses: new Set(),
        })
        logQuery.topic0s.add(topic0)
        logQuery.addresses.add(ethAddress)
      }
    }

    return chainToLogQuery
  }

  getRpcClient(chain: string) {
    let client = this.rpcClients[chain]
    if (!client) {
      const chainConfig = this.chainConfigs.find((c) => c.name === chain)
      if (!chainConfig) {
        throw new Error(`Missing configuration for chain ${chain}`)
      }
      const rpcConfig = chainConfig.blockApis.find((a) => a.type === 'rpc')
      if (!rpcConfig || rpcConfig.type !== 'rpc') {
        throw new Error(`Missing RPC config for chain ${chain}`)
      }

      const rpcLogger = this.logger
        .for(EthRpcClient.name)
        .tag({ source: chain })

      const http = new Http({
        logger: rpcLogger,
        maxCallsPerMinute: 120, // rpcConfig.callsPerMinute
      })

      client = new EthRpcClient(
        http,
        rpcConfig.url,
        `${EthRpcClient.name}:${chain}`,
      )
      this.rpcClients[chain] = client
    }
    return client
  }

  private async sleepMs(ms: number) {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }

  private async clearPluginError() {
    await this.db.interopPluginStatus.updateByPluginName(this.plugin.name, {
      lastError: null,
    })
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

  private async savePluginError(error: unknown, prefix?: string) {
    this.logger.error('Error in syncer', error, {
      pluginName: this.plugin.name,
    })
    await this.db.interopPluginStatus.updateByPluginName(this.plugin.name, {
      lastError: (prefix ?? '') + errorToString(error),
    })
  }

  private async saveChainSyncError(chain: string, error: unknown) {
    const lastError = errorToString(error)
    this.logger.error('Error syncing chain', error, {
      pluginName: this.plugin.name,
      chain,
    })
    await this.db.interopPluginStatus.updateByPluginName(this.plugin.name, {
      lastError,
    })
    await this.db.interopPluginSyncedRange.updateByPluginNameAndChain(
      this.plugin.name,
      chain,
      {
        lastError,
      },
    )
  }
}

function toEventSelector(eventSignature: string): string {
  const abi = parseAbi([eventSignature as string])
  // biome-ignore lint/suspicious/noExplicitAny: Viem types are hell
  return encodeEventTopics({ abi } as any)[0]
}

function errorToString(error: unknown): string {
  return error instanceof Error
    ? JSON.stringify(error, Object.getOwnPropertyNames(error))
    : JSON.stringify({ message: String(error), value: error })
}
