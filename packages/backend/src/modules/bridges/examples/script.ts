import { getEnv, Logger } from '@l2beat/backend-tools'
import {
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient,
  PriceProvider,
  RpcClient,
} from '@l2beat/shared'
import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { boolean, command, flag, positional, run, string } from 'cmd-ts'
import { readFileSync } from 'fs'
import { type ParseError, parse } from 'jsonc-parser'
import { join } from 'path'
import { logToViemLog } from '../BridgeBlockProcessor'
import { match } from '../BridgeMatcher'
import { FinancialsService } from '../financials/FinancialsService'
import { INTEROP_TOKENS } from '../financials/tokens'
import { createBridgePlugins } from '../plugins'
import type {
  BridgeEvent,
  BridgeMessage,
  BridgeTransfer,
  BridgeTransferWithFinancials,
} from '../plugins/types'
import { InMemoryEventDb } from '../InMemoryEventDb'

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
    simple: flag({ type: boolean, long: 'simple' }),
  },
  handler: async (args) => {
    const examples = v
      .record(v.string(), Example)
      .validate(readJsonc(join(__dirname, 'examples.jsonc')))

    if (args.name === 'all') {
      const bigResult: RunResult = {
        events: [],
        messages: [],
        transfers: [],
      }

      let success = true
      for (const [key, example] of Object.entries(examples)) {
        console.log('\nExample:', key, '\n')
        const result = await runExample(example)
        bigResult.events.push(...result.events)
        bigResult.messages.push(...result.messages)
        bigResult.transfers.push(...result.transfers)
        const partial = checkExample(example, result, false)
        success &&= partial
      }
      summarize(bigResult)
      if (!success) {
        console.error('Tests failed')
        process.exit(1)
      }
    } else {
      const example = examples[args.name as keyof typeof examples]
      if (!example) {
        console.error(`${args.name}: example not found, see examples.jsonc`)
        return
      }
      const result = await runExample(example)
      const success = checkExample(example, result, !args.simple)
      summarize(result)
      if (!success) {
        console.error('Tests failed')
        process.exit(1)
      }
    }
  },
})

interface RunResult {
  events: BridgeEvent[]
  messages: BridgeMessage[]
  transfers: BridgeTransfer[]
}

async function runExample(example: Example): Promise<RunResult> {
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

  const plugins = createBridgePlugins()

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
          events.push(event)
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
    events,
    plugins,
    chains.map((x) => x.name),
    logger,
  )
  const transfers: BridgeTransferWithFinancials[] = await Promise.all(
    result.transfers.map(async (b) => await financialsService.addFinancials(b)),
  )

  return {
    events,
    messages: result.messages,
    transfers: transfers,
  }
}

function checkExample(
  example: Example,
  result: RunResult,
  verbose: boolean,
): boolean {
  const eventsOk = checkTyped(
    'Event   ',
    [...example.events],
    result.events,
    verbose,
  )
  const messagesOk = checkTyped(
    'Message ',
    [...example.messages],
    result.messages,
    verbose,
  )
  const transfersOk = checkTyped(
    'Transfer',
    [...example.transfers],
    result.transfers,
    verbose,
  )
  return eventsOk && messagesOk && transfersOk
}

const PASS = '[\x1B[1;32mPASS\x1B[0m]'
const XTRA = '[\x1B[1;34mXTRA\x1B[0m]'
const FAIL = '[\x1B[1;31mFAIL\x1B[0m]'

function checkTyped(
  name: string,
  expected: string[],
  values: { type: string }[],
  verbose: boolean,
): boolean {
  for (const value of values) {
    const idx = expected.indexOf(value.type)
    if (idx !== -1) {
      expected.splice(idx, 1)
    }
    const tag = idx !== -1 ? PASS : XTRA
    console.log(tag, name, verbose ? value : value.type)
  }
  for (const type of expected) {
    console.log(FAIL, name, type)
  }
  return expected.length === 0
}

function summarize(result: RunResult) {
  console.log('\nSUMMARY\n')
  summarizeType('Events', result.events)
  summarizeType('Messages', result.messages)
  summarizeType('Transfers', result.transfers)
}

function summarizeType(name: string, items: { type: string }[]) {
  const counts: Record<string, number> = {}
  for (const item of items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1
  }
  const types = Object.entries(counts)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map((x) => ({
      type: x[0],
      count: x[1],
    }))
  console.log(`${name}:`)
  for (const { type, count } of types) {
    console.log('   ', type, count)
  }
}

run(cmd, process.argv.slice(2))
