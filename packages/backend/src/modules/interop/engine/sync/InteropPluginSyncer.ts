import type { Logger } from '@l2beat/backend-tools'
import type { Database, InteropPluginStatusRecord } from '@l2beat/database'
import { EthRpcClient, Http, toEVMBlock, toEVMLog } from '@l2beat/shared'
import {
  assert,
  ChainSpecificAddress,
  type EthereumAddress,
} from '@l2beat/shared-pure'
import isNil from 'lodash/isNil'
import { encodeEventTopics, parseAbi } from 'viem'
import type { ChainApi } from '../../../../config/chain/ChainApi'
import type { InteropEvent, InteropPlugin } from '../../plugins/types'
import { getItemsToCapture } from '../capture/getItemsToCapture'
import type { InteropEventStore } from '../capture/InteropEventStore'
import type { InteropMatchingLoop } from '../match/InteropMatchingLoop'

const DEFAULT_LOGS_MAX_BLOCK_RANGE = 2_000n
const DEFAULT_RESYNC_BLOCKS = 100n

interface LogQuery {
  topic0s: Set<string>
  addresses: Set<EthereumAddress>
}

export class InteropPluginSyncer {
  private matcherLocked = false
  private rpcClients: { [chain: string]: EthRpcClient } = {}

  constructor(
    private capturedChains: { name: string; type: 'evm' }[],
    private chainConfigs: ChainApi[],
    private plugins: InteropPlugin[],
    private store: InteropEventStore,
    private db: Database,
    private logger: Logger,
    private matcher: InteropMatchingLoop,
  ) {
    this.logger = logger.for(this)
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

  async start() {
    for (const plugin of this.plugins) {
      await this.syncPlugin(plugin)
    }
  }

  async syncPlugin(plugin: InteropPlugin) {
    if (!plugin.getCapturedEvents) {
      // This plugin doesn't support re-syncing.
      return
    }
    const pluginStatus = await this.getPluginStatus(plugin)
    const logQueryPerChain = this.generateLogQueryPerChain(
      plugin.getCapturedEvents(),
    )

    const blocksToProcessPerChain = new Map<string, Set<bigint>>()

    for (const [chain, logQuery] of logQueryPerChain) {
      if (!this.capturedChains.map((c) => c.name).includes(chain)) {
        this.logger.warn(
          `Skipping events from chain '${chain}' (requested by plugin '${plugin.name}') because it's turned off in config`,
        )
        continue
      }
      const client = this.getRpcClient(chain)
      const latestBlock = await client.getBlockByNumber('latest', false)
      assert(latestBlock)
      assert(!isNil(latestBlock.number))
      const isSyncedTo =
        pluginStatus.syncedBlockRanges?.perChain[chain].to.block

      let syncFrom: bigint
      if (isSyncedTo !== undefined) {
        if (isSyncedTo >= latestBlock.number) {
          // No new block since last sync
          continue
        }
        syncFrom = BigInt(isSyncedTo) + 1n
      } else {
        syncFrom = latestBlock.number - DEFAULT_RESYNC_BLOCKS
        const fromBlock = await client.getBlockByNumber(BigInt(syncFrom), false)
        assert(fromBlock)
        const _syncFromTimestamp = fromBlock.timestamp
      }
      if (syncFrom > latestBlock.number) {
        this.logger.error(
          `Plugin ${plugin.name} is synced futher than the latest block. ${syncFrom} > ${latestBlock.number}`,
        )
      }

      const min = (a: bigint, b: bigint) => (a < b ? a : b)
      const syncTo = min(
        syncFrom + DEFAULT_LOGS_MAX_BLOCK_RANGE,
        latestBlock.number,
      )

      console.log('Asking for logs:', {
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

      const blocksToProcess = new Set<bigint>()
      for (const log of logs) {
        assert(log.blockNumber)
        blocksToProcess.add(log.blockNumber)
      }
      blocksToProcessPerChain.set(chain, blocksToProcess)
    }

    const toRun = []
    for (const [chain, blockNumbers] of blocksToProcessPerChain) {
      toRun.push(this.captureBlocks(chain, blockNumbers, plugin))
    }
    await Promise.all(toRun)
    // TODO: in transaction
    // capture
    // update status

    // TODO: run .capture

    // TODO: update plugin status

    // TODO: Add try/catch error handling

    // TODO: call matching loop here, not as TimeLoop outside
  }

  private async captureBlocks(
    chain: string,
    blockNumbers: Set<bigint>,
    plugin: InteropPlugin,
  ) {
    assert(plugin.capture)
    const client = this.getRpcClient(chain)
    let count = 0
    for (const blockNumber of blockNumbers) {
      count++
      console.log(
        `Getting block ${blockNumber} for chain ${chain} ${(100 * count) / blockNumbers.size}%`,
      )
      const block = await client.getBlockByNumber(blockNumber, true)
      const logs = await client.getLogs({
        fromBlock: blockNumber,
        toBlock: blockNumber,
      })
      // TODO: check that logs are consistent with block
      assert(block)
      const evmBlock = toEVMBlock(Number(block.number), block)
      const evmLogs = logs.map(toEVMLog)
      const toCapture = getItemsToCapture(chain, evmBlock, evmLogs)
      if (plugin.capture) {
        for (const logToCapture of toCapture.logsToCapture) {
          const captured = plugin.capture(logToCapture)
          const events: InteropEvent[] = []
          if (captured) {
            events.push(...captured.map((c) => ({ ...c, plugin: plugin.name })))
            await this.store.saveNewEvents(events)

            if (!this.matcherLocked) {
              this.matcherLocked = true
              await this.matcher.run()
              this.matcherLocked = false
            }
          }
        }
      }
    }
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

  generateLogQueryPerChain(
    capturedEvents: ReturnType<NonNullable<InteropPlugin['getCapturedEvents']>>,
  ) {
    type LongChain = ReturnType<typeof ChainSpecificAddress.longChain>
    const chainToLogQuery = new Map<LongChain, LogQuery>()

    for (const [eventSignature, params] of Object.entries(capturedEvents)) {
      const abi = parseAbi([eventSignature as string])
      // biome-ignore lint/suspicious/noExplicitAny: Viem types are hell
      const topic0 = encodeEventTopics({ abi } as any)[0]

      for (const address of params.addresses) {
        const longChain: LongChain = ChainSpecificAddress.longChain(address)
        const ethAddress = ChainSpecificAddress.address(address)
        let logQuery = chainToLogQuery.get(longChain)
        if (!logQuery) {
          logQuery = { topic0s: new Set(), addresses: new Set() }
          chainToLogQuery.set(longChain, logQuery)
        }
        logQuery.topic0s.add(topic0)
        logQuery.addresses.add(ethAddress)
      }
    }

    return chainToLogQuery
  }
}
