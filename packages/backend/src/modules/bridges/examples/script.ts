import { getEnv, Logger } from '@l2beat/backend-tools'
import {
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient,
  PriceProvider,
  RpcClient,
} from '@l2beat/shared'
import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { command, positional, run, string } from 'cmd-ts'
import { logToViemLog } from '../BridgeBlockProcessor'
import { match } from '../BridgeMatcher'
import { FinancialsService } from '../financials/FinancialsService'
import { INTEROP_TOKENS } from '../financials/tokens'
import { createBridgePlugins } from '../plugins'
import type {
  BridgeEvent,
  BridgeTransferWithFinancials,
} from '../plugins/types'
import { InMemoryEventDb } from './InMemoryEventDb'
import { readFileSync } from 'fs'
import { join } from 'path'
import { type ParseError, parse } from 'jsonc-parser'
import { v } from '@l2beat/validate'

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

type Example = v.infer<typeof Example>
const Example = v.object({
  txs: v.array(
    v.object({
      chain: v.string(),
      tx: v.string(),
    }),
  ),
  events: v.array(v.string()),
  messages: v.array(v.string()),
  transfers: v.array(v.string()),
})

const cmd = command({
  name: 'bridges:example',
  args: {
    name: positional({ type: string, displayName: 'name' }),
  },
  handler: async (args) => {
    const examples = v
      .record(v.string(), Example)
      .validate(readJsonc(join(__dirname, 'examples.jsonc')))

    if (args.name === 'all') {
      for (const [key, example] of Object.entries(examples)) {
        console.log('Runnning', key)
        await runExample(example)
      }
    } else {
      const example = examples[args.name as keyof typeof examples]
      if (!example) {
        console.error(`${args.name}: example not found, see examples.jsonc`)
        return
      }
      await runExample(example)
    }
  },
})

async function runExample(example: Example) {
  const logger = Logger.INFO
  const http = new HttpClient()
  const env = getEnv()
  const coingeckoClient = new CoingeckoClient({
    http,
    logger,
    sourceName: 'coingecko',
    callsPerMinute: 600,
    retryStrategy: 'SCRIPT',
    apiKey: env.optionalString('COINGECKO_API_KEY'),
  })
  const priceProvider = new PriceProvider(
    new CoingeckoQueryService(coingeckoClient),
  )
  const financialsService = new FinancialsService(INTEROP_TOKENS, priceProvider)

  const chains = example.txs.map(({ chain, tx }) => {
    return {
      txHash: tx,
      name: chain,
      rpc: new RpcClient({
        url: env.string(`${chain.toUpperCase()}_RPC_URL`),
        sourceName: chain,
        http,
        logger,
        callsPerMinute: 600,
        retryStrategy: 'SCRIPT',
      }),
    }
  })

  const plugins = createBridgePlugins(logger)

  const events: BridgeEvent[] = []
  for (const chain of chains) {
    const tx = await chain.rpc.getTransaction(chain.txHash)
    assert(tx.blockNumber)
    const block = await chain.rpc.getBlockWithTransactions(tx.blockNumber)
    const logs = await chain.rpc.getLogs(block.number, block.number)
    const txLogs = logs
      .filter((l) => l.transactionHash === tx.hash)
      .map(logToViemLog)

    for (const log of txLogs) {
      for (const plugin of plugins) {
        if (!plugin.capture) {
          continue
        }
        const event = await plugin.capture({
          log: log,
          txLogs: txLogs,
          ctx: {
            timestamp: block.timestamp,
            chain: chain.name,
            blockNumber: block.number,
            blockHash: block.hash,
            txHash: tx.hash,
            txTo: tx.to ? EthereumAddress(tx.to) : undefined,
            logIndex: log.logIndex ?? -1,
          },
        })

        if (event) {
          logger.info('Captured', event)
          events.push(event)
        }
      }
    }
  }

  const eventDb = new InMemoryEventDb(events)

  const result = await match(
    eventDb,
    events,
    plugins,
    chains.map((x) => x.name),
    logger,
  )
  const transfers: BridgeTransferWithFinancials[] = await Promise.all(
    result.transfers.map(async (b) => await financialsService.addFinancials(b)),
  )

  for (const [index, message] of result.messages.entries()) {
    logger.info(`Message #${index + 1}`, message)
  }
  for (const [index, transfer] of transfers.entries()) {
    logger.info(`Transfer #${index + 1}`, transfer)
  }
}

run(cmd, process.argv.slice(2))
