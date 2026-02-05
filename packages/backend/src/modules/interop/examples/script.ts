import { type Env, getEnv, Logger } from '@l2beat/backend-tools'
import {
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient,
} from '@l2beat/shared'
import { assert, CoingeckoId, unique } from '@l2beat/shared-pure'
import { getTokenDbClient, type TokenDbClient } from '@l2beat/token-backend'
import {
  boolean,
  command,
  flag,
  option,
  optional,
  positional,
  run,
  string,
} from 'cmd-ts'
import { join } from 'path'
import type { DeployedTokenId } from '../engine/financials/DeployedTokenId'
import {
  getTokenInfos,
  type TokenInfos,
} from '../engine/financials/InteropFinancialsLoop'
import {
  type CoreResult,
  type Example,
  type RunResult,
  readExamples,
  Separated,
} from './core'
import { checkExpects, printExpectsResult } from './expects'
import { ExampleRunner } from './runner'
import { SnapshotService } from './snapshot/service'

const cmd = command({
  name: 'interop:example',
  args: {
    name: positional({ type: optional(string), displayName: 'name' }),
    simple: flag({ type: boolean, long: 'simple', defaultValue: () => false }),
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
    tags: option({
      type: optional(Separated(string)),
      long: 'tags',
      short: 't',
      description: 'tags to filter examples, comma separated.',
    }),
  },
  handler: async (args) => {
    const examples = readExamples()

    function getExamplesToRun() {
      if (args.name === 'all') {
        return Object.keys(examples)
      }

      if (args.tags) {
        return Object.entries(examples)
          .filter(([, { tags }]) =>
            tags?.some((tag) => args.tags?.includes(tag)),
          )
          .map(([key]) => key)
      }
      assert(args.name, 'name is required if tags are not provided')

      return [args.name]
    }

    const examplesToRun = getExamplesToRun()

    const env = getEnv()
    const http = new HttpClient()
    const tokenDbClient = getTokenDbClient({
      apiUrl: env.string('TOKEN_BACKEND_TRPC_URL'),
      authToken: env.string('TOKEN_BACKEND_CF_TOKEN'),
      callSource: 'interop',
    })
    const snapshotService = new SnapshotService({
      rootDir: join(__dirname, 'snapshots'),
      noCompression: args.uncompressed,
    })
    const coingecko = new CoingeckoQueryService(
      new CoingeckoClient({
        callsPerMinute: 60,
        sourceName: 'coingecko',
        retryStrategy: 'SCRIPT',
        http,
        logger: Logger.SILENT,
        apiKey: undefined,
      }),
    )

    console.log('Running examples:', examplesToRun.join(', '))

    const coreResults: {
      exampleId: string
      example: Example
      result: RunResult
    }[] = []
    for (const exampleId of examplesToRun) {
      const example = examples[exampleId]
      console.log(
        'Running example -',
        exampleId,
        example.description ? `(${example.description})` : '',
      )
      const result = await runExampleCore(exampleId, example, {
        seal: args.seal,
        uncompressed: args.uncompressed,
        env,
        http,
        tokenDbClient,
        snapshotService,
      })
      coreResults.push({ exampleId, example, result })
    }

    const allTokenIds = unique(
      coreResults
        .flatMap((r) => r.result.transfers)
        .flatMap((t) => [t.srcId, t.dstId])
        .filter((x) => x !== undefined),
    )

    const tokenInfos =
      allTokenIds.length > 0
        ? await getTokenInfos(allTokenIds, tokenDbClient, Logger.SILENT)
        : new Map()
    const prices =
      allTokenIds.length > 0
        ? await coingecko.getLatestMarketData(
            unique(
              Array.from(tokenInfos.values())
                .map((t) => CoingeckoId(t.coingeckoId))
                .filter((u) => u !== undefined),
            ),
          )
        : new Map()

    let success = true
    const bigResult: CoreResult = {
      events: [],
      matchedEventIds: new Set(),
      messages: [],
      transfers: [],
    }
    for (const { exampleId, example, result } of coreResults) {
      const withFinancials = applyFinancials(result, tokenInfos, prices)
      bigResult.events.push(...withFinancials.events)
      for (const id of withFinancials.matchedEventIds) {
        bigResult.matchedEventIds.add(id)
      }
      bigResult.messages.push(...withFinancials.messages)
      bigResult.transfers.push(...withFinancials.transfers)
      const partial = checkExample(
        exampleId,
        example,
        withFinancials,
        !args.simple,
      )
      success &&= partial
    }

    summarize(bigResult)
    if (!success) {
      console.log('Tests failed')
      process.exit(1)
    }
  },
})

async function runExampleCore(
  exampleId: string,
  example: Example,
  opts: {
    seal: boolean
    uncompressed: boolean
    env: Env
    http: HttpClient
    tokenDbClient: TokenDbClient
    snapshotService: SnapshotService
  },
) {
  const exampleInputs = opts.snapshotService.createEmptyExampleInputs()

  const runner = new ExampleRunner({
    exampleId,
    example,
    logger: Logger.ERROR,
    http: opts.http,
    tokenDbClient: opts.tokenDbClient,
    snapshotService: opts.snapshotService,
    env: opts.env,
    mode: opts.seal ? 'capture' : 'live',
    inputs: exampleInputs,
  })

  const coreResult = await runner.run()

  if (opts.seal) {
    await runner.flush(coreResult)
    if (!opts.uncompressed) {
      await runner.updateManifest()
    }
  }

  return coreResult
}

function applyFinancials(
  coreResult: RunResult,
  tokenInfos: TokenInfos,
  prices: Map<CoingeckoId, { price: number; circulating: number }>,
): CoreResult {
  const transfersWithFinancials = coreResult.transfers.map((transfer) => ({
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
    events: coreResult.events,
    matchedEventIds: coreResult.matchedEventIds,
    messages: coreResult.messages,
    transfers: transfersWithFinancials,
  }
}

function checkExample(
  exampleId: string,
  example: Example,
  result: CoreResult,
  verbose: boolean,
): boolean {
  const results = checkExpects(
    example.expects ?? {},
    {
      events: example.events,
      messages: example.messages,
      transfers: example.transfers,
    },
    result,
    verbose,
  )

  const header = example.description
    ? `${example.description} (${exampleId})`
    : exampleId

  console.log(`\n--- ${header} ---`)
  console.log(
    `    Txs: ${example.txs.map((t) => `${t.chain}:${t.tx.slice(0, 10)}...`).join(', ')}`,
  )

  printExpectsResult(example.expects, results)

  return (
    results.eventsResult.success &&
    results.messagesResult.success &&
    results.transfersResult.success
  )
}

function summarize(result: CoreResult) {
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
