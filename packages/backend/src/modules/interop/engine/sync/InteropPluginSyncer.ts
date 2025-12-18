import type { Logger } from '@l2beat/backend-tools'
import type { Database, InteropPluginStatusRecord } from '@l2beat/database'
import { ChainSpecificAddress, type EthereumAddress } from '@l2beat/shared-pure'
import type { Clients } from '../../../../providers/Clients'
import type { InteropPlugin } from '../../plugins/types'

interface LogQuery {
  topics: string[]
  addresses: EthereumAddress[]
}

export class InteropPluginSyncer {
  constructor(
    private chains: { name: string; type: 'evm' }[],
    private clients: Clients,
    private plugins: InteropPlugin[],
    private db: Database,
    private logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  async start() {
    for (const plugin of this.plugins) {
      await this.syncPlugin(plugin)
    }
  }

  async syncPlugin(plugin: InteropPlugin) {
    if (!plugin.capturesEvents) {
      // This plugin doesn't support re-syncing.
      return
    }
    let pluginStatus = await this.db.interopPluginStatus.findByPluginName(
      plugin.name,
    )
    if (!pluginStatus) {
      pluginStatus = await this.initializePluginStatus(plugin.name)
    }

    const logQueriesPerChain = this.generateLogQueriesPerChain(
      plugin.capturesEvents,
    )

    for (const [chain, logQueries] of logQueriesPerChain) {
      if (!this.chains.map((c) => c.name).includes(chain)) {
        this.logger.warn(
          `Skipping events from chain ${chain} for plugin ${plugin.name} because it's turned off in config`,
        )
      }
      for (const logQuery of logQueries) {
        const client = this.clients.getRpcClient(chain)
        const _syncedRangesPerChain = pluginStatus.syncedBlockRanges[chain]
        const syncFrom = 1 // TODO: add +1 to syncedTo or get from Plugin
        const syncTo = 100 // TODO: next day
        client.getLogs(syncFrom, syncTo, logQuery.addresses, logQuery.topics)
      }
    }

    // TODO: run .capture

    // TODO: update plugin status

    // TODO: Add try/catch error handling

    // TODO: call matching loop here, not as TimeLoop outside
  }

  generateLogQueriesPerChain(
    capturesEvents: NonNullable<InteropPlugin['capturesEvents']>,
  ) {
    type LongChain = ReturnType<typeof ChainSpecificAddress.longChain>
    type Topic = string
    const chainToAddressToTopics = new Map<
      LongChain,
      Map<EthereumAddress, Topic[]>
    >()

    for (const [event, params] of capturesEvents) {
      for (const address of params.addresses) {
        const longChain: LongChain = ChainSpecificAddress.longChain(address)
        const ethAddress = ChainSpecificAddress.address(address)
        const perChain = getOrSetDefault(
          chainToAddressToTopics,
          longChain,
          () => new Map(),
        )
        const perAddress = getOrSetDefault(perChain, ethAddress, () => [])
        perAddress.push(event)
      }
    }

    const result = new Map<LongChain, LogQuery[]>()
    for (const [longChain, addressToTopics] of chainToAddressToTopics) {
      const queriesForChain: LogQuery[] = []
      for (const [ethAddress, topics] of addressToTopics) {
        queriesForChain.push({
          addresses: [ethAddress],
          topics,
        })
      }
      result.set(longChain, queriesForChain)
    }

    return result
  }

  async initializePluginStatus(pluginName: string) {
    const record: InteropPluginStatusRecord = {
      pluginName,
      syncedBlockRanges: {},
      resyncRequestedFrom: null,
    }
    return await this.db.interopPluginStatus.insert(record)
  }
}

function getOrSetDefault<K, V>(map: Map<K, V>, key: K, defaultFn: () => V): V {
  let value = map.get(key)
  if (!value) {
    value = defaultFn()
    map.set(key, value)
  }
  return value
}
