import { getEnv, Logger } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { HttpClient, MulticallV3Client, RpcClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { boolean, command, flag, positional, run, string } from 'cmd-ts'
import { readFileSync } from 'fs'
import { type ParseError, parse } from 'jsonc-parser'
import { join } from 'path'
import { InMemoryEventDb } from '../engine/capture/InMemoryEventDb'
import { logToViemLog } from '../engine/capture/InteropBlockProcessor'
import { InteropConfigStore } from '../engine/config/InteropConfigStore'
import { match } from '../engine/match/InteropMatchingLoop'
import { createInteropPlugins } from '../plugins'
import {
  Address32,
  type InteropEvent,
  type InteropMessage,
  type InteropTransfer,
} from '../plugins/types'

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
  loadConfigs: v.array(v.string()).optional(),
  txs: v.array(
    v.object({
      chain: v.string(),
      tx: v.string(),
    }),
  ),
  events: v.array(v.string()).optional(),
  messages: v.array(v.string()).optional(),
  transfers: v.array(v.string()).optional(),
})

const cmd = command({
  name: 'interop:example',
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
  events: InteropEvent[]
  messages: InteropMessage[]
  transfers: InteropTransfer[]
}

async function runExample(example: Example): Promise<RunResult> {
  const logger = Logger.ERROR
  const http = new HttpClient()
  const env = getEnv()

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
    return new RpcClient({
      url: env.string(`${chain.toUpperCase()}_RPC_URL`),
      chain: chain,
      http,
      logger,
      callsPerMinute: 600,
      retryStrategy: 'SCRIPT',
      multicallClient,
    })
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
    httpClient: new HttpClient(),
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
      console.log('LOADING CONFIG:', key)
      await config.run()
    }
  }

  const events: InteropEvent[] = []
  for (const chain of chains) {
    const tx = await chain.rpc.getTransaction(chain.txHash)
    assert(tx.blockNumber)

    const block = await chain.rpc.getBlockWithTransactions(tx.blockNumber)
    const logs = await chain.rpc.getLogs(block.number, block.number)
    const txLogs = logs
      .filter((l) => l.transactionHash === tx.hash)
      .map(logToViemLog)

    const ctx = {
      timestamp: block.timestamp,
      chain: chain.name,
      blockNumber: block.number,
      blockHash: block.hash,
      txHash: tx.hash,
      txValue: tx.value,
      txTo: tx.to ? Address32.from(tx.to) : undefined,
      txFrom: tx.from ? Address32.from(tx.from) : undefined,
      txData: tx.data,
      logIndex: -1,
    }

    for (const plugin of plugins.eventPlugins) {
      if (!plugin.captureTx) {
        continue
      }
      const captured = plugin.captureTx({ tx: ctx, txLogs })
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
          log: log,
          txLogs: txLogs,
          ctx: { ...ctx, logIndex: log.logIndex ?? -1 },
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
    plugins.eventPlugins,
    chains.map((x) => x.name),
    logger,
  )

  return {
    events,
    messages: result.messages,
    transfers: result.transfers,
  }
}

function checkExample(
  example: Example,
  result: RunResult,
  verbose: boolean,
): boolean {
  const eventsOk = checkTyped(
    'Event   ',
    [...(example.events ?? [])],
    result.events,
    verbose,
  )
  const messagesOk = checkTyped(
    'Message ',
    [...(example.messages ?? [])],
    result.messages,
    verbose,
  )
  const transfersOk = checkTyped(
    'Transfer',
    [...(example.transfers ?? [])],
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
