import type { Logger } from '@l2beat/backend-tools'
import type { Database, InteropPluginStatusRecord } from '@l2beat/database'
import type { InteropPluginSyncedBlockRanges } from '@l2beat/database/dist/repositories/InteropPluginStatusRepository'
import {
  EthRpcClient,
  Http,
  toEVMBlock,
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
import { onlyConsistent } from '../../../block-sync/BlockIndexer'
import type {
  DataRequest,
  InteropEvent,
  InteropPlugin,
  LogToCapture,
} from '../../plugins/types'
import { getItemsToCapture, logToViemLog } from '../capture/getItemsToCapture'
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
      // This plugin doesn't support re-syncing.
      return
    }
    const pluginStatus = await this.getPluginStatus(plugin)
    const logQueryPerChain = this.processEvmEventDataRequests(
      plugin.getDataRequests(),
    )

    const interopEventsPerChain: InteropEvent[][] = []

    // BEGIN: Block based
    const blocksToProcessPerChain = new Map<string, bigint[]>()
    // END

    for (const [chain, logQuery] of logQueryPerChain) {
      if (!this.enabledChains.map((c) => c.name).includes(chain)) {
        this.logger.warn(
          `Skipping events from chain '${chain}' (requested by plugin '${plugin.name}') because it's turned off in config`,
        )
        continue
      }
      const logs = await this.fetchLogsForNextRange(
        chain,
        logQuery,
        pluginStatus.syncedBlockRanges?.perChain[chain],
      )

      // BEGIN: Block based
      const uniqueBlocksToProcess = new Set<bigint>()
      for (const log of logs.logs) {
        assert(log.blockNumber)
        uniqueBlocksToProcess.add(log.blockNumber)
      }
      blocksToProcessPerChain.set(chain, Array.from(uniqueBlocksToProcess))
      // END

      // const logsPerTx = new UpsertMap<string, ViemLog[]>()
      // for (const log of logs.logs) {
      //   assert(log.transactionHash)
      //   const v = logsPerTx.getOrInsert(log.transactionHash, [])
      //   v.push(logToViemLog(toEVMLog(log)))
      // }

      // const interopEvents = []
      // for (const log of logs.logs) {
      //   assert(log.transactionHash)
      //   assert(log.blockNumber)
      //   assert(log.blockTimestamp)

      //   const logToCapture: LogToCapture = {
      //     log: logToViemLog(toEVMLog(log)),
      //     txLogs: logsPerTx.get(log.transactionHash) ?? [],
      //     tx: { hash: log.transactionHash },
      //     chain,
      //     block: {
      //       number: Number(log.blockNumber),
      //       hash: '123',
      //       logsBloom: '123',
      //       timestamp: Number(log.blockTimestamp),
      //       transactions: [],
      //     },
      //   }

      //   const produced = plugin.capture(logToCapture)
      //   if (produced) {
      //     interopEvents.push(
      //       produced.map((p) => ({ ...p, plugin: plugin.name })),
      //     )
      //   }
      // }

      // interopEventsPerChain.push(interopEvents.flat())

    }
    // BEGIN: Block based
    const toRun = []
    for (const [chain, blockNumbers] of blocksToProcessPerChain) {
      toRun.push(this.captureBlocks(chain, blockNumbers, plugin))
    }
    interopEventsPerChain.push(((await Promise.all(toRun)).flat()))
    // END

    await this.store.saveNewEvents(interopEventsPerChain.flat())

    // TODO: in transaction
    // TODO: update plugin status
    // await this.store.saveNewEvents(events)
    // update pluginStatus

    // TODO: Add try/catch error handling

    // TODO: call matching loop here, not as TimeLoop outside
  }

  private async fetchLogsForNextRange(
    chain: string,
    logQuery: LogQuery,
    syncedBlockRanges:
      | InteropPluginSyncedBlockRanges['perChain'][0]
      | undefined,
  ) {
    const client = this.getRpcClient(chain)
    const latestBlock = await client.getBlockByNumber('latest', false)
    assert(latestBlock && !isNil(latestBlock.number))

    let prevFrom = syncedBlockRanges?.from
    if (!prevFrom) {
      const fromBlockNumber = latestBlock.number - DEFAULT_RESYNC_BLOCKS
      const fromBlock = await client.getBlockByNumber(fromBlockNumber, false)
      assert(fromBlock)
      prevFrom = {
        block: fromBlockNumber,
        timestamp: UnixTime(Number(fromBlock.timestamp)),
      }
    }

    const prevTo = syncedBlockRanges?.from
    const syncFrom = prevTo?.block ?? prevFrom.block
    const min = (a: bigint, b: bigint) => (a < b ? a : b)
    const syncTo = min(
      syncFrom + DEFAULT_LOGS_MAX_BLOCK_RANGE,
      latestBlock.number,
    )
    const syncToBlock = await client.getBlockByNumber(syncTo, false)
    assert(syncToBlock && !isNil(syncToBlock.number))

    this.logger.info('Getting logs', {
      chain,
      syncFrom,
      syncTo,
      addresses: logQuery.addresses,
      topics: [logQuery.topic0s],
    })

    const logs = await client.getLogs({
      fromBlock: syncFrom,
      toBlock: syncTo,
      address: Array.from(logQuery.addresses),
      topics: [Array.from(logQuery.topic0s)],
    })

    return {
      logs,
      origFrom: prevFrom,
      from: syncFrom,
      to: {
        block: syncToBlock.number,
        timestamp: UnixTime(Number(syncToBlock.timestamp)),
      },
    }
  }

  private async captureBlocks(
    chain: string,
    blockNumbers: bigint[],
    plugin: InteropPlugin,
  ): Promise<InteropEvent[]> {
    assert(plugin.capture)
    const interopEvents: InteropEvent[] = []
    const client = this.getRpcClient(chain)
    let count = 0
    for (const blockNumber of blockNumbers) {
      count++
      console.log(
        `Getting block ${blockNumber} for chain ${chain} ${(100 * count) / blockNumbers.length}%`,
      )
      const block = await client.getBlockByNumber(blockNumber, true)
      const logs = await client.getLogs({
        fromBlock: blockNumber,
        toBlock: blockNumber,
      })
      assert(block)
      const evmBlock = toEVMBlock(Number(block.number), block)
      const evmLogs = logs.map(toEVMLog)
      if (onlyConsistent([evmBlock], evmLogs).length !== 1) {
        throw new Error(
          `Couldn't consistently find logs for block ${evmBlock.number} on chain ${chain}`,
        )
      }
      const toCapture = getItemsToCapture(chain, evmBlock, evmLogs)
      for (const logToCapture of toCapture.logsToCapture) {
        const captured = plugin.capture(logToCapture)
        if (captured) {
          interopEvents.push(
            ...captured.map((c) => ({ ...c, plugin: plugin.name })),
          )
        }
      }
    }
    return interopEvents
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
      syncedBlockRanges: null,
      resyncRequestedFrom: null,
    }
    return await this.db.interopPluginStatus.insert(record)
  }

  processEvmEventDataRequests(dataRequests: DataRequest[]) {
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
