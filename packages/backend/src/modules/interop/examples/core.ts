import { Logger } from '@l2beat/backend-tools'
import { INTEROP_CHAINS, ProjectService } from '@l2beat/config'
import { HttpClient, type IRpcClient, MulticallV3Client } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { readFileSync } from 'fs'
import { type ParseError, parse } from 'jsonc-parser'
import { join } from 'path'
import { logToViemLog } from '../engine/capture/getItemsToCapture'
import { InMemoryEventDb } from '../engine/capture/InMemoryEventDb'
import { InteropConfigStore } from '../engine/config/InteropConfigStore'
import type { DeployedTokenId } from '../engine/financials/DeployedTokenId'
import { toDeployedId } from '../engine/financials/InteropFinancialsLoop'
import { match } from '../engine/match/InteropMatchingLoop'
import { createInteropPlugins } from '../plugins'
import type {
  InteropEvent,
  InteropMessage,
  InteropTransfer,
} from '../plugins/types'

export interface TransferWithTokenIds {
  transfer: InteropTransfer
  srcId: DeployedTokenId | undefined
  dstId: DeployedTokenId | undefined
}

export interface CoreResult {
  events: InteropEvent[]
  messages: InteropMessage[]
  transfers: TransferWithTokenIds[]
}

export interface TransactionSpec {
  chain: string
  tx: string
}

export interface CoreExample {
  loadConfigs?: string[]
  txs: TransactionSpec[]
}

export interface RunExampleCoreOptions {
  makeRpcClient: (params: {
    chain: string
    multicallClient?: MulticallV3Client
  }) => IRpcClient
  logger?: Logger
  httpClient?: HttpClient
}

export async function runExampleCore(
  example: CoreExample,
  options: RunExampleCoreOptions,
): Promise<CoreResult> {
  const logger = options.logger ?? Logger.ERROR
  const httpClient = options.httpClient ?? new HttpClient()

  const ps = new ProjectService()
  const psChains = (await ps.getProjects({ select: ['chainConfig'] })).map(
    (p) => p.chainConfig,
  )
  const pluginChains = psChains
    .filter((c) => c.chainId !== undefined)
    .map((c) => ({ name: c.name, id: c.chainId as number }))

  const makeRpcClient = (chain: string) => {
    let multicallClient: MulticallV3Client | undefined
    const multicallConfig = psChains
      .find((c) => c.name === chain)
      ?.multicallContracts?.find((c) => c.version === '3')
    if (multicallConfig) {
      multicallClient = new MulticallV3Client(
        multicallConfig.address,
        multicallConfig.sinceBlock,
        multicallConfig.batchSize,
      )
    }

    return options.makeRpcClient({ chain, multicallClient })
  }

  const chains = example.txs.map(({ chain, tx }) => {
    return {
      txHash: tx,
      name: chain,
      rpc: makeRpcClient(chain),
    }
  })

  const rpcClients = chains.map((x) => x.rpc)
  if (!rpcClients.some((x) => x.chain === 'ethereum')) {
    rpcClients.push(makeRpcClient('ethereum'))
  }

  const configs = new InteropConfigStore(undefined)

  const plugins = createInteropPlugins({
    chains: pluginChains,
    configs,
    httpClient,
    logger,
    rpcClients,
  })

  if (example.loadConfigs && example.loadConfigs.length > 0) {
    for (const key of example.loadConfigs) {
      const config = plugins.configPlugins.find((x) =>
        x.provides.map((k) => k.key).includes(key),
      )
      if (!config) {
        throw new Error(`Cannot load configs: ${key}`)
      }
      logger.info('Loading config', { key })
      await config.run()
    }
  }

  const events: InteropEvent[] = []
  for (const chain of chains) {
    logger.info('Getting transaction', {
      chain: chain.name,
      txHash: chain.txHash,
    })
    const tx = await chain.rpc.getTransaction(chain.txHash)
    logger.debug('Transaction retrieved', { tx })
    assert(tx.blockNumber)

    const block = await chain.rpc.getBlockWithTransactions(tx.blockNumber)
    const logs = await chain.rpc.getLogs(block.number, block.number)
    const txLogs = logs
      .filter((l) => l.transactionHash === tx.hash)
      .map(logToViemLog)

    for (const plugin of plugins.eventPlugins) {
      if (!plugin.captureTx) {
        continue
      }
      const captured = plugin.captureTx({
        chain: chain.name,
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
      for (const plugin of plugins.eventPlugins) {
        if (!plugin.capture) {
          continue
        }
        const captured = plugin.capture({
          chain: chain.name,
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

  const matchingResult = await match(
    eventDb,
    (type) => events.filter((x) => x.type === type),
    [...new Set(events.map((x) => x.type))],
    events.length,
    plugins.eventPlugins,
    chains.map((x) => x.name),
    logger,
  )

  const transfers = matchingResult.transfers.map((u) => ({
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
  }))

  return {
    events: events.map((e) => ({ ...e, chain: e.ctx.chain })),
    messages: matchingResult.messages.map((m) => ({
      ...m,
      src: { ...m.src, chain: m.src.ctx.chain },
      dst: { ...m.dst, chain: m.dst.ctx.chain },
    })),
    transfers,
  }
}

// app matching only works for messages (InteropEvent and InteropTransfer don't have app field)
export const ExpectedMessage = v.union([
  v.string(),
  v.object({
    type: v.string(),
    app: v.string().optional(),
  }),
])
export type ExpectedMessageType = v.infer<typeof ExpectedMessage>

export type Example = v.infer<typeof Example>
export const Example = v.object({
  loadConfigs: v.array(v.string()).optional(),
  txs: v.array(
    v.object({
      chain: v.string(),
      tx: v.string(),
    }),
  ),
  events: v.array(v.string()).optional(),
  messages: v.array(ExpectedMessage).optional(),
  transfers: v.array(v.string()).optional(),
})

export function readJsonc(path: string): JSON {
  const contents = readFileSync(path, 'utf-8')
  const errors: ParseError[] = []
  const parsed = parse(contents, errors, {
    allowTrailingComma: true,
  }) as JSON
  if (errors.length !== 0) {
    throw new Error(`Cannot parse file ${path}`)
  }
  return parsed
}

export function readExamples(): Record<string, CoreExample> {
  const examples = v
    .record(v.string(), Example)
    .validate(readJsonc(join(__dirname, 'examples.jsonc')))
  return examples
}
