import { getEnv, Logger } from '@l2beat/backend-tools'
import {
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient,
} from '@l2beat/shared'
import { assert, CoingeckoId, unique } from '@l2beat/shared-pure'
import { getTokenDbClient } from '@l2beat/token-backend'
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
import { type CoreResult, type Example, readExamples, Separated } from './core'
import { checkExpects, printExpectsResult } from './expects'
import { ExampleRunner } from './runner'
import { hashExampleDefinition, SnapshotService } from './snapshot/service'

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

    let success = true
    const bigResult: CoreResult = {
      events: [],
      matchedEventIds: new Set(),
      messages: [],
      transfers: [],
    }

    console.log('Running examples:', examplesToRun.join(', '))

    for (const exampleId of examplesToRun) {
      const example = examples[exampleId]
      console.log('\nExample:', exampleId, '\n')
      const result = await runExample(exampleId, example, {
        seal: args.seal,
        uncompressed: args.uncompressed,
      })
      bigResult.events.push(...result.events)
      for (const id of result.matchedEventIds) {
        bigResult.matchedEventIds.add(id)
      }
      bigResult.messages.push(...result.messages)
      bigResult.transfers.push(...result.transfers)
      const partial = checkExample(exampleId, example, result, !args.simple)
      success &&= partial
    }
    summarize(bigResult)
    if (!success) {
      console.log('Tests failed')
      process.exit(1)
    }
  },
})

async function runExample(
  exampleId: string,
  example: Example,
  opts: {
    seal: boolean
    uncompressed: boolean
  },
) {
  const env = getEnv()
  const tokenDbClient = getTokenDbClient({
    apiUrl: env.string('TOKEN_BACKEND_TRPC_URL'),
    authToken: env.string('TOKEN_BACKEND_CF_TOKEN'),
    callSource: 'interop',
  })

  const snapshotService = new SnapshotService({
    rootDir: join(__dirname, 'snapshots'),
    noCompression: opts.uncompressed,
  })
  const exampleInputs = snapshotService.createEmptyExampleInputs()

  const runner = new ExampleRunner({
    exampleId,
    example,
    logger: Logger.ERROR,
    http: new HttpClient(),
    snapshotService,
    env: getEnv(),
    mode: opts.seal ? 'capture' : 'live',
    inputs: exampleInputs,
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

  const coreResult = await runner.run()

  if (opts.seal) {
    await snapshotService.saveInputs(exampleId, exampleInputs)
    await snapshotService.saveOutputs(exampleId, coreResult)
    if (!opts.uncompressed) {
      const definitionHash = hashExampleDefinition(example)
      await snapshotService.updateManifest(exampleId, definitionHash)
    }
  }

  // Second pass: batch fetch token info and prices for all groups
  const allTokenIds = unique(
    coreResult.transfers
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

  const header = example.name ? `${example.name} (${exampleId})` : exampleId

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
