import type { Logger } from '@l2beat/backend-tools'
import type {
  BlockRangeWithTimestamps,
  Database,
  InteropPluginStatusRecord,
} from '@l2beat/database'
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
  InteropPlugin,
  LogToCapture,
} from '../../plugins/types'
import { logToViemLog } from '../capture/getItemsToCapture'
import type { InteropEventStore } from '../capture/InteropEventStore'

const DEFAULT_LOGS_MAX_BLOCK_RANGE = 2_000n
const DEFAULT_RESYNC_BLOCKS = 900n

interface LogQuery {
  topic0s: Set<string>
  addresses: Set<EthereumAddress>
}

export class InteropPluginSyncer {
  private rpcClients: { [chain: string]: EthRpcClient } = {}

  constructor(
    private enabledChains: { name: string; type: 'evm' }[],
    private chainConfigs: ChainApi[],
    private plugins: InteropPlugin[],
    private store: InteropEventStore,
    private db: Database,
    private logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  async start() {
    // For now let's not Promise.all to not overwhelm RPCs
    for (const plugin of this.plugins) {
      await this.syncNextRange(plugin)
    }
  }

  async syncNextRange(plugin: InteropPlugin) {
    if (!plugin.getDataRequests || !plugin.capture) {
      return // This plugin doesn't support re-syncing.
    }

    const logQueryPerChain = this.groupEventDataRequests(
      plugin.getDataRequests(),
    )

    for (const [chain, logQuery] of logQueryPerChain) {
      if (!this.enabledChains.map((c) => c.name).includes(chain)) {
        this.logger.warn(
          `Skipping events from chain '${chain}' (requested by plugin '${plugin.name}') because it's turned off in config`,
        )
        continue
      }
      await this.syncNextChainRange(plugin, chain, logQuery)
    }

    // TODO: Add try/catch error handling
    // TODO: save lastOpError
  }

  private async syncNextChainRange(
    plugin: InteropPlugin,
    chain: string,
    logQueryForChain: LogQuery,
  ) {
    assert(plugin.capture)

    const syncData = await this.calculateNextRange(plugin.name, chain)
    const logs = await this.fetchLogsForNextRange(
      chain,
      logQueryForChain,
      syncData.nextRange,
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
      assert(log.blockTimestamp)

      const logToCapture: LogToCapture = {
        log: logToViemLog(toEVMLog(log)),
        txLogs: logsPerTx.get(log.transactionHash) ?? [],
        tx: { hash: log.transactionHash },
        chain,
        block: {
          number: Number(log.blockNumber),
          hash: '123',
          logsBloom: '123',
          timestamp: Number(log.blockTimestamp),
          transactions: [],
        },
      }

      const produced = plugin.capture(logToCapture)
      if (produced) {
        interopEvents.push(produced.map((p) => ({ ...p, plugin: plugin.name })))
      }
    }

    // TODO: in transaction
    await this.store.saveNewEvents(interopEvents.flat()) // TODO: make this idempotent?
    await this.db.interopPluginSyncedRange.upsert({
      pluginName: plugin.name,
      chain,
      ...syncData.fullRange,
    })
    // TODO: update plugin status

    // TODO: add try catch
    // TODO: save error
  }

  private async calculateNextRange(
    pluginName: string,
    chain: string,
  ): Promise<{
    nextRange: { from: bigint; to: bigint }
    fullRange: BlockRangeWithTimestamps
  }> {
    const client = this.getRpcClient(chain)
    const syncedRange =
      await this.db.interopPluginSyncedRange.findByPluginNameAndChain(
        pluginName,
        chain,
      )
    const latestBlock = await client.getBlockByNumber('latest', false)
    assert(latestBlock && !isNil(latestBlock.number))

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

    nextTo = nextFrom + DEFAULT_LOGS_MAX_BLOCK_RANGE - 1n
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
    }
  }

  private async fetchLogsForNextRange(
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

  private async getPluginStatus(plugin: InteropPlugin) {
    let pluginStatus = await this.db.interopPluginStatus.findByPluginName(
      plugin.name,
    )
    if (!pluginStatus) {
      pluginStatus = await this.initializePluginStatus(plugin.name)
    }
    return pluginStatus
  }

  async initializePluginStatus(pluginName: string) {
    const record: InteropPluginStatusRecord = {
      pluginName,
      resyncRequestedFrom: null,
    }
    return await this.db.interopPluginStatus.insert(record)
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
}

function toEventSelector(eventSignature: string): string {
  const abi = parseAbi([eventSignature as string])
  // biome-ignore lint/suspicious/noExplicitAny: Viem types are hell
  return encodeEventTopics({ abi } as any)[0]
}
