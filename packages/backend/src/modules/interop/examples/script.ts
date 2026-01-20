import { getEnv, Logger } from '@l2beat/backend-tools'
import {
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient,
  type MulticallV3Client,
  RpcClientCompat,
} from '@l2beat/shared'
import { CoingeckoId, unique } from '@l2beat/shared-pure'
import { getTokenDbClient } from '@l2beat/token-backend'
import { boolean, command, flag, positional, run, string } from 'cmd-ts'
import { join } from 'path'
import type { DeployedTokenId } from '../engine/financials/DeployedTokenId'
import {
  getTokenInfos,
  type TokenInfos,
} from '../engine/financials/InteropFinancialsLoop'
import type {
  InteropEvent,
  InteropMessage,
  InteropTransfer,
} from '../plugins/types'
import {
  type Example,
  type ExpectedMessageType,
  readExamples,
  runExampleCore,
} from './core'
import { hashExampleDefinition, SnapshotService } from './snapshot/service'
import { RpcSnapshotClient } from './snapshot/snapshot'

const cmd = command({
  name: 'interop:example',
  args: {
    name: positional({ type: string, displayName: 'name' }),
    simple: flag({ type: boolean, long: 'simple' }),
    seal: flag({
      type: boolean,
      long: 'seal',
      short: 's',
      defaultValue: () => false,
    }),
    uncompressed: flag({
      type: boolean,
      long: 'uncompressed',
      short: 'u',
      defaultValue: () => false,
      description: 'Do not compress the snapshot files',
    }),
  },
  handler: async (args) => {
    const examples = readExamples()

    if (args.name === 'all') {
      const bigResult: RunResult = {
        events: [],
        messages: [],
        transfers: [],
      }

      let success = true
      for (const [key, example] of Object.entries(examples)) {
        console.log('\nExample:', key, '\n')
        const result = await runExample(key, example, {
          seal: args.seal,
          uncompressed: args.uncompressed,
        })
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
      const result = await runExample(args.name, example, {
        seal: args.seal,
        uncompressed: args.uncompressed,
      })
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

async function runExample(
  exampleName: string,
  example: Example,
  opts: { seal: boolean; uncompressed: boolean },
): Promise<RunResult> {
  const logger = Logger.ERROR
  const snapshotService = new SnapshotService({
    rootDir: join(__dirname, 'snapshots'),
    noCompression: opts.uncompressed,
  })

  const exampleInputs = snapshotService.createEmptyExampleInputs()

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

  const makeRpcClient = ({
    chain,
    multicallClient,
  }: {
    chain: string
    multicallClient?: MulticallV3Client
  }) => {
    const baseClientDeps = {
      url: env.string(`${chain.toUpperCase()}_RPC_URL`),
      chain,
      http,
      logger,
      callsPerMinute: 600,
      retryStrategy: 'SCRIPT' as const,
      multicallClient,
    }

    if (opts.seal) {
      return RpcSnapshotClient.create({ ...baseClientDeps, exampleInputs })
    }

    return RpcClientCompat.create(baseClientDeps)
  }

  const coreResult = await runExampleCore(example, {
    makeRpcClient,
    logger,
    httpClient: http,
  })

  const transfers = coreResult.transfers.map((u) => ({
    transfer: u.transfer,
    srcId: u.srcId,
    dstId: u.dstId,
  }))

  const tokenInfos = await getTokenInfos(
    unique(
      transfers
        .flatMap((t) => [t.srcId, t.dstId])
        .filter((x) => x !== undefined),
    ),
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

  const transfersWithFinancials = []

  for (const transfer of transfers) {
    transfersWithFinancials.push({
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
    })
  }

  const result = {
    events: coreResult.events,
    messages: coreResult.messages,
    transfers: coreResult.transfers,
  }

  if (opts.seal) {
    await snapshotService.saveInputs(exampleName, exampleInputs)
    await snapshotService.saveOutputs(exampleName, result)
    if (!opts.uncompressed) {
      const definitionHash = hashExampleDefinition(example)
      await snapshotService.updateManifest(exampleName, definitionHash)
    }
  }

  return {
    events: coreResult.events,
    messages: coreResult.messages,
    transfers: transfersWithFinancials.map((t) => ({
      ...t,
      events: t.events.map((e) => ({ ...e, chain: e.ctx.chain })),
      src: { ...t.src, chain: t.src.event.ctx.chain },
      dst: { ...t.dst, chain: t.dst.event.ctx.chain },
    })),
  }
}

function normalizeExpectedMessage(item: ExpectedMessageType): {
  type: string
  app?: string
} {
  if (typeof item === 'string') {
    return { type: item }
  }
  return item
}

function checkExample(
  example: Example,
  result: RunResult,
  verbose: boolean,
): boolean {
  const eventsOk = checkTypedSimple(
    'Event   ',
    [...(example.events ?? [])],
    result.events,
    verbose,
  )
  const messagesOk = checkTypedWithApp(
    'Message ',
    [...(example.messages ?? [])].map(normalizeExpectedMessage),
    result.messages,
    verbose,
  )
  const transfersOk = checkTypedSimple(
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
