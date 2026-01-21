import { getEnv, Logger } from '@l2beat/backend-tools'
import { INTEROP_CHAINS, ProjectService } from '@l2beat/config'
import {
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient,
  MulticallV3Client,
  RpcClientCompat,
} from '@l2beat/shared'
import { assert, CoingeckoId, unique } from '@l2beat/shared-pure'
import { getTokenDbClient } from '@l2beat/token-backend'
import { v } from '@l2beat/validate'
import { boolean, command, flag, positional, run, string } from 'cmd-ts'
import { readFileSync } from 'fs'
import { type ParseError, parse } from 'jsonc-parser'
import { join } from 'path'
import { logToViemLog } from '../engine/capture/getItemsToCapture'
import { InMemoryEventDb } from '../engine/capture/InMemoryEventDb'
import { InteropConfigStore } from '../engine/config/InteropConfigStore'
import type { DeployedTokenId } from '../engine/financials/DeployedTokenId'
import {
  getTokenInfos,
  type TokenInfos,
  toDeployedId,
} from '../engine/financials/InteropFinancialsLoop'
import { match } from '../engine/match/InteropMatchingLoop'
import { createInteropPlugins } from '../plugins'
import type {
  InteropEvent,
  InteropMessage,
  InteropTransfer,
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

// app matching only works for messages (InteropEvent and InteropTransfer don't have app field)
const ExpectedMessage = v.union([
  v.string(),
  v.object({
    type: v.string(),
    app: v.string().optional(),
  }),
])

const TxEntry = v.object({
  chain: v.string(),
  tx: v.string(),
})

// A group of related transactions that should match together
const TxGroup = v.object({
  name: v.string().optional(),
  txs: v.array(TxEntry),
  events: v.array(v.string()).optional(),
  messages: v.array(ExpectedMessage).optional(),
  transfers: v.array(v.string()).optional(),
})

type TxGroup = v.infer<typeof TxGroup>

// Support both old format (flat txs) and new format (groups)
type Example = v.infer<typeof Example>
const Example = v.object({
  loadConfigs: v.array(v.string()).optional(),
  // Old format: flat list of txs with global expectations
  txs: v.array(TxEntry).optional(),
  events: v.array(v.string()).optional(),
  messages: v.array(ExpectedMessage).optional(),
  transfers: v.array(v.string()).optional(),
  // New format: grouped txs with per-group expectations
  groups: v.array(TxGroup).optional(),
})

// Convert old format to new format for unified processing
function normalizeExample(example: Example): TxGroup[] {
  if (example.groups && example.groups.length > 0) {
    return example.groups
  }
  // Old format: single group with all txs
  return [
    {
      txs: example.txs ?? [],
      events: example.events,
      messages: example.messages,
      transfers: example.transfers,
    },
  ]
}

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
      const bigResult: GroupResult = {
        events: [],
        matchedEventIds: new Set(),
        messages: [],
        transfers: [],
      }

      let success = true
      for (const [key, example] of Object.entries(examples)) {
        console.log('\nExample:', key, '\n')
        const groups = normalizeExample(example)
        const result = await runExample(example, groups)
        // Merge all group results
        for (const groupResult of result.groupResults) {
          bigResult.events.push(...groupResult.events)
          for (const id of groupResult.matchedEventIds) {
            bigResult.matchedEventIds.add(id)
          }
          bigResult.messages.push(...groupResult.messages)
          bigResult.transfers.push(...groupResult.transfers)
        }
        const partial = checkGroupedExample(groups, result, false)
        success &&= partial
      }
      summarizeGroupResult(bigResult)
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
      const groups = normalizeExample(example)
      const result = await runExample(example, groups)
      const success = checkGroupedExample(groups, result, !args.simple)
      // Summarize all groups combined
      const combinedResult: GroupResult = {
        events: [],
        matchedEventIds: new Set(),
        messages: [],
        transfers: [],
      }
      for (const groupResult of result.groupResults) {
        combinedResult.events.push(...groupResult.events)
        for (const id of groupResult.matchedEventIds) {
          combinedResult.matchedEventIds.add(id)
        }
        combinedResult.messages.push(...groupResult.messages)
        combinedResult.transfers.push(...groupResult.transfers)
      }
      summarizeGroupResult(combinedResult)
      if (!success) {
        console.error('Tests failed')
        process.exit(1)
      }
    }
  },
})

interface GroupResult {
  events: InteropEvent[]
  matchedEventIds: Set<string>
  messages: InteropMessage[]
  transfers: InteropTransfer[]
}

interface RunResult {
  groupResults: GroupResult[]
}

async function runExample(
  example: Example,
  groups: TxGroup[],
): Promise<RunResult> {
  const logger = Logger.ERROR
  const http = new HttpClient()
  const env = getEnv()
  const tokenDbClient = getTokenDbClient({
    apiUrl: env.string('TOKEN_BACKEND_TRPC_URL'),
    authToken: env.string('TOKEN_BACKEND_CF_TOKEN'),
    callSource: 'interop',
  })

  const coingecko = new CoingeckoQueryService(
    new CoingeckoClient({
      callsPerMinute: 60,
      sourceName: 'coingecko',
      retryStrategy: 'SCRIPT',
      http: new HttpClient(),
      logger: Logger.SILENT,
      apiKey: undefined,
    }),
  )

  const ps = new ProjectService()
  const psChains = (await ps.getProjects({ select: ['chainConfig'] })).map(
    (p) => p.chainConfig,
  )
  const pluginChains = psChains
    .filter((c) => c.chainId !== undefined)
    .map((c) => ({ name: c.name, id: c.chainId as number }))

  const rpcClientCache = new Map<string, RpcClientCompat>()
  const makeRpcClient = (chain: string) => {
    const cached = rpcClientCache.get(chain)
    if (cached) return cached

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
    const client = RpcClientCompat.create({
      url: env.string(`${chain.toUpperCase()}_RPC_URL`),
      chain: chain,
      http,
      logger,
      callsPerMinute: 600,
      retryStrategy: 'SCRIPT',
      multicallClient,
    })
    rpcClientCache.set(chain, client)
    return client
  }

  // Collect all unique chains from all groups
  const allChains = unique(groups.flatMap((g) => g.txs.map((t) => t.chain)))
  const rpcClients = allChains.map(makeRpcClient)
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

  // Process each group separately - first pass: capture and match
  interface GroupMatchResult {
    events: InteropEvent[]
    matchedEventIds: Set<string>
    messages: InteropMessage[]
    transfers: {
      transfer: InteropTransfer
      srcId: DeployedTokenId | undefined
      dstId: DeployedTokenId | undefined
    }[]
  }

  const groupMatchResults: GroupMatchResult[] = []

  for (const group of groups) {
    const events: InteropEvent[] = []

    for (const txEntry of group.txs) {
      const rpc = makeRpcClient(txEntry.chain)
      const tx = await rpc.getTransaction(txEntry.tx)
      assert(tx.blockNumber)

      const block = await rpc.getBlockWithTransactions(tx.blockNumber)
      const logs = await rpc.getLogs(block.number, block.number)
      const txLogs = logs
        .filter((l) => l.transactionHash === tx.hash)
        .map(logToViemLog)

      for (const plugin of plugins.eventPlugins.flat()) {
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
        for (const plugin of plugins.eventPlugins.flat()) {
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
      plugins.eventPlugins.flat(),
      group.txs.map((x) => x.chain),
      logger,
    )

    const transfers = result.transfers.map((u) => ({
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

    groupMatchResults.push({
      events,
      matchedEventIds: new Set(result.matched.map((e) => e.eventId)),
      messages: result.messages,
      transfers,
    })
  }

  // Second pass: batch fetch token info and prices for all groups
  const allTokenIds = unique(
    groupMatchResults
      .flatMap((g) => g.transfers)
      .flatMap((t) => [t.srcId, t.dstId])
      .filter((x) => x !== undefined),
  )

  const tokenInfos = await getTokenInfos(
    allTokenIds,
    tokenDbClient,
    Logger.SILENT,
  )

  const prices = await coingecko.getLatestMarketData(
    unique(
      Array.from(tokenInfos.values())
        .map((t) => CoingeckoId(t.coingeckoId))
        .filter((u) => u !== undefined),
    ),
  )

  // Third pass: enrich transfers with financials and build final results
  const groupResults: GroupResult[] = groupMatchResults.map((groupMatch) => {
    const transfersWithFinancials = groupMatch.transfers.map((transfer) => ({
      ...transfer.transfer,
      src: {
        ...transfer.transfer.src,
        financials: calculateFinancials(
          transfer.srcId,
          transfer.transfer.src.tokenAmount,
          tokenInfos,
          prices,
        ),
      },
      dst: {
        ...transfer.transfer.dst,
        financials: calculateFinancials(
          transfer.dstId,
          transfer.transfer.dst.tokenAmount,
          tokenInfos,
          prices,
        ),
      },
    }))

    return {
      events: groupMatch.events.map((e) => ({ ...e, chain: e.ctx.chain })),
      matchedEventIds: groupMatch.matchedEventIds,
      messages: groupMatch.messages.map((m) => ({
        ...m,
        src: { ...m.src, chain: m.src.ctx.chain },
        dst: { ...m.dst, chain: m.dst.ctx.chain },
      })),
      transfers: transfersWithFinancials.map((t) => ({
        ...t,
        events: t.events.map((e) => ({ ...e, chain: e.ctx.chain })),
        src: { ...t.src, chain: t.src.event.ctx.chain },
        dst: { ...t.dst, chain: t.dst.event.ctx.chain },
      })),
    }
  })

  return { groupResults }
}

type ExpectedMessageType = v.infer<typeof ExpectedMessage>

function normalizeExpectedMessage(item: ExpectedMessageType): {
  type: string
  app?: string
} {
  if (typeof item === 'string') {
    return { type: item }
  }
  return item
}

function checkGroupedExample(
  groups: TxGroup[],
  result: RunResult,
  verbose: boolean,
): boolean {
  let allOk = true

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i]
    const groupResult = result.groupResults[i]

    // Print group header
    const groupName =
      group.name ??
      `Group ${i + 1}: ${group.txs.map((t) => t.tx.slice(0, 10)).join(', ')}`
    console.log(`\n--- ${groupName} ---`)
    console.log(
      `    Txs: ${group.txs.map((t) => `${t.chain}:${t.tx.slice(0, 10)}...`).join(', ')}`,
    )

    const eventsOk = checkEvents(
      'Event   ',
      [...(group.events ?? [])],
      groupResult.events,
      groupResult.matchedEventIds,
      verbose,
    )
    const messagesOk = checkTypedWithApp(
      'Message ',
      [...(group.messages ?? [])].map(normalizeExpectedMessage),
      groupResult.messages,
      verbose,
    )
    const transfersOk = checkTypedSimple(
      'Transfer',
      [...(group.transfers ?? [])],
      groupResult.transfers,
      verbose,
    )

    allOk = allOk && eventsOk && messagesOk && transfersOk
  }

  return allOk
}

const PASS = '[\x1B[1;32mPASS\x1B[0m]'
const XTRA = '[\x1B[1;34mXTRA\x1B[0m]'
const FAIL = '[\x1B[1;31mFAIL\x1B[0m]'
const MTCH = '[\x1B[1;32mMTCH\x1B[0m]'
const UNMT = '[\x1B[1;33mUNMT\x1B[0m]'

function checkTypedSimple(
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

function checkEvents(
  name: string,
  expected: string[],
  events: InteropEvent[],
  matchedEventIds: Set<string>,
  verbose: boolean,
): boolean {
  for (const event of events) {
    const idx = expected.indexOf(event.type)
    if (idx !== -1) {
      expected.splice(idx, 1)
    }
    const isMatched = matchedEventIds.has(event.eventId)
    const matchTag = isMatched ? MTCH : UNMT
    const expectedTag = idx !== -1 ? PASS : XTRA
    console.log(expectedTag, matchTag, name, verbose ? event : event.type)
  }
  for (const type of expected) {
    console.log(FAIL, name, type)
  }
  return expected.length === 0
}

function checkTypedWithApp(
  name: string,
  expected: { type: string; app?: string }[],
  values: { type: string; app?: string }[],
  verbose: boolean,
): boolean {
  for (const value of values) {
    const idx = expected.findIndex(
      (e) =>
        e.type === value.type && (e.app === undefined || e.app === value.app),
    )
    if (idx !== -1) {
      expected.splice(idx, 1)
    }
    const tag = idx !== -1 ? PASS : XTRA
    const display = verbose
      ? value
      : value.app
        ? `${value.type} (app: ${value.app})`
        : value.type
    console.log(tag, name, display)
  }
  for (const exp of expected) {
    const display = exp.app ? `${exp.type} (app: ${exp.app})` : exp.type
    console.log(FAIL, name, display)
  }
  return expected.length === 0
}

function summarizeGroupResult(result: GroupResult) {
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

function calculateFinancials(
  deployedTokenId: DeployedTokenId | undefined,
  rawAmount: bigint | undefined,
  tokenInfos: TokenInfos,
  prices: Map<CoingeckoId, { price: number; circulating: number }>,
) {
  if (!deployedTokenId) return undefined

  const tokenInfo = tokenInfos.get(deployedTokenId)
  if (!tokenInfo) return undefined

  const price = prices.get(CoingeckoId(tokenInfo.coingeckoId))
  if (!price) return undefined

  if (!rawAmount) return undefined

  const amount =
    Number((rawAmount * 1_000_000n) / 10n ** BigInt(tokenInfo.decimals)) /
    1_000_000

  return {
    symbol: tokenInfo.symbol,
    price: price.price,
    amount,
    value: price.price * amount,
  }
}

run(cmd, process.argv.slice(2))
