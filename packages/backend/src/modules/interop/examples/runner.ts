import type { Env, Logger } from '@l2beat/backend-tools'
import { INTEROP_CHAINS, ProjectService } from '@l2beat/config'
import {
  type HttpClient,
  MulticallV3Client,
  RpcClientCompat,
} from '@l2beat/shared'
import { assert, unique } from '@l2beat/shared-pure'
import { logToViemLog } from '../engine/capture/getItemsToCapture'
import { InMemoryEventDb } from '../engine/capture/InMemoryEventDb'
import { InteropConfigStore } from '../engine/config/InteropConfigStore'
import { toDeployedId } from '../engine/financials/InteropFinancialsLoop'
import { match } from '../engine/match/InteropMatchingLoop'
import {
  createInteropPlugins,
  flattenClusters,
  type InteropPlugins,
} from '../plugins'
import type { InteropEvent } from '../plugins/types'
import type { Example, RunResult } from './core'
import { RpcReplay } from './snapshot/replay'
import {
  type ExampleInputs,
  hashExampleDefinition,
  type SnapshotService,
} from './snapshot/service'
import { RpcSnapshotClient } from './snapshot/snapshot'

type Dependencies = {
  exampleId: string
  example: Example
  logger: Logger
  http: HttpClient
  snapshotService: SnapshotService
  env: Env
  mode: 'capture' | 'replay' | 'live'
  inputs?: ExampleInputs
}

export class ExampleRunner {
  private readonly rpcClientCache: Map<string, RpcClientCompat | RpcReplay> =
    new Map()

  private inputs: ExampleInputs
  private store = new InteropConfigStore(undefined)
  constructor(private readonly $: Dependencies) {
    this.inputs = $.inputs ?? $.snapshotService.createEmptyExampleInputs()
  }

  async run() {
    const chainConfigs = await this.getChainConfigs()
    const pluginChains = chainConfigs
      .filter((c) => c.chainId !== undefined)
      .map((c) => ({ name: c.name, id: c.chainId as number }))

    const allChains = unique(this.$.example.txs?.flatMap((t) => t.chain) ?? [])

    const rpcClients = await Promise.all(
      allChains.map((chain) => this.getRpcClient(chain)),
    )

    if (!rpcClients.some((x) => x.chain === 'ethereum')) {
      rpcClients.push(await this.getRpcClient('ethereum'))
    }

    const plugins = createInteropPlugins({
      chains: pluginChains,
      configs: this.store,
      httpClient: this.$.http,
      logger: this.$.logger,
      rpcClients,
    })

    await this.loadConfigs(plugins)

    const events: InteropEvent[] = []

    for (const txEntry of this.$.example.txs) {
      const rpc = await this.getRpcClient(txEntry.chain)
      const tx = await rpc.getTransaction(txEntry.tx)
      assert(tx.blockNumber)

      const block = await rpc.getBlockWithTransactions(tx.blockNumber)
      const logs = await rpc.getLogs(block.number, block.number)
      const txLogs = logs
        .filter((l) => l.transactionHash === tx.hash)
        .map(logToViemLog)

      for (const plugin of flattenClusters(plugins.eventPlugins)) {
        if (!plugin.captureTx) {
          continue
        }
        const captured = plugin.captureTx({
          chain: txEntry.chain,
          tx,
          block,
          txLogs,
        })
        if (captured) {
          events.push(...captured.map((c) => ({ ...c, plugin: plugin.name })))
          break
        }
      }

      for (const log of txLogs) {
        for (const plugin of flattenClusters(plugins.eventPlugins)) {
          if (!plugin.capture) {
            continue
          }
          const captured = plugin.capture({
            chain: txEntry.chain,
            log: log,
            tx,
            block,
            txLogs,
          })
          if (captured) {
            events.push(...captured.map((c) => ({ ...c, plugin: plugin.name })))
            break
          }
        }
      }
    }

    const eventDb = new InMemoryEventDb()
    for (const event of events) {
      eventDb.addEvent(event)
    }

    const result = await match(
      eventDb,
      (type) => events.filter((x) => x.type === type),
      [...new Set(events.map((x) => x.type))],
      events.length,
      flattenClusters(plugins.eventPlugins),
      this.$.example.txs.map((x) => x.chain),
      this.$.logger,
    )

    const eventsWithContext = events.map((e) => ({ ...e, chain: e.ctx.chain }))

    const transfersWithContext = result.transfers.map((u) => ({
      transfer: u,
      srcId: toDeployedId(
        INTEROP_CHAINS,
        u.src.event.ctx.chain,
        u.src.tokenAddress,
      ),
      dstId: toDeployedId(
        INTEROP_CHAINS,
        u.dst.event.ctx.chain,
        u.dst.tokenAddress,
      ),
      events: u.events.map((e) => ({ ...e, chain: e.ctx.chain })),
      src: { ...u.src, chain: u.src.event.ctx.chain },
      dst: { ...u.dst, chain: u.dst.event.ctx.chain },
    }))

    return {
      events: eventsWithContext,
      matchedEventIds: new Set(result.matched.map((e) => e.eventId)),
      messages: result.messages,
      transfers: transfersWithContext,
    }
  }

  public async flush(result: RunResult) {
    if (this.$.mode === 'capture') {
      this.inputs.writeSpace('config', this.store.getAll())
    }

    await this.$.snapshotService.saveInputs(this.$.exampleId, this.inputs)
    await this.$.snapshotService.saveOutputs(this.$.exampleId, result)
  }

  public async updateManifest() {
    const definitionHash = hashExampleDefinition(this.$.example)
    await this.$.snapshotService.updateManifest(
      this.$.exampleId,
      definitionHash,
    )
  }

  private async loadConfigs(plugins: InteropPlugins) {
    if (this.$.mode === 'replay') {
      this.store.writeAll(this.inputs.readSpace('config'))
      return
    }

    if (this.$.example.loadConfigs && this.$.example.loadConfigs.length > 0) {
      for (const key of this.$.example.loadConfigs) {
        const config = plugins.configPlugins.find((x) =>
          x.provides.map((k) => k.key).includes(key),
        )

        assert(config, `Cannot load configs: ${key}`)

        this.$.logger.info('Loading config', { key })
        await config.run()
      }
    }
  }

  private async getRpcClient(chain: string) {
    const cached = this.rpcClientCache.get(chain)

    if (cached) {
      return cached
    }

    const client = await this._getRpcClient(chain)
    this.rpcClientCache.set(chain, client)
    return client
  }

  private async _getRpcClient(chain: string) {
    if (this.$.mode === 'replay') {
      return RpcReplay.create({
        chain,
        logger: this.$.logger,
        inputs: this.inputs,
      })
    }

    const base = {
      chain,
      url: this.$.env.string(`${chain.toUpperCase()}_RPC_URL`),
      http: this.$.http,
      logger: this.$.logger,
      callsPerMinute: 600,
      retryStrategy: 'SCRIPT' as const,
      multicallClient: await this.getMulticallClient(chain),
    }

    if (this.$.mode === 'capture') {
      return RpcSnapshotClient.create({
        ...base,
        inputs: this.inputs,
      })
    }

    return RpcClientCompat.create(base)
  }

  private async getMulticallClient(chain: string) {
    const chainConfigs = await this.getChainConfigs()
    const mcConfigV3 = chainConfigs
      .find((c) => c.name === chain)
      ?.multicallContracts?.find((c) => c.version === '3')

    if (!mcConfigV3) {
      return
    }

    return new MulticallV3Client(
      mcConfigV3.address,
      mcConfigV3.sinceBlock,
      mcConfigV3.batchSize,
    )
  }

  private async getChainConfigs() {
    const ps = new ProjectService()
    const projects = await ps.getProjects({ select: ['chainConfig'] })

    return projects.map((p) => p.chainConfig)
  }
}
