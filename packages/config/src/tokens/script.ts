import { getEnv } from '@l2beat/backend-tools'
import { CoingeckoClient, HttpClient } from '@l2beat/shared'
import {
  AssetId,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  stringAs,
  Token,
} from '@l2beat/shared-pure'
import chalk from 'chalk'
import { providers } from 'ethers'
import { readFileSync, writeFileSync } from 'fs'
import { parse, ParseError } from 'jsonc-parser'
import { z } from 'zod'

import { chains } from '../chains'
import { getTokenInfo } from './utils/getTokenInfo'
import { ScriptLogger } from './utils/ScriptLogger'

const SOURCE_FILE_PATH = './src/tokens/source.jsonc'
const OUTPUT_FILE_PATH = './src/tokens/tokenList.json'

const SourceEntry = z.object({
  symbol: z.string(),
  address: stringAs(EthereumAddress).optional(),
  coingeckoId: stringAs((s) => CoingeckoId(s)).optional(),
  category: z
    .union([z.literal('ether'), z.literal('stablecoin'), z.literal('other')])
    .optional(),
  type: z
    .union([z.literal('CBV'), z.literal('EBV'), z.literal('NMV')])
    .optional(),
  formula: z
    .union([
      z.literal('totalSupply'),
      z.literal('locked'),
      z.literal('circulatingSupply'),
    ])
    .optional(),

  bridgedUsing: z.optional(
    z.object({
      bridge: z.string(),
      slug: z.string().optional(),
    }),
  ),
})

const Source = z.record(z.array(SourceEntry))
const Output = z.object({
  comment: z.string().optional(),
  tokens: z.array(Token),
})

async function main() {
  const logger = new ScriptLogger()

  logger.notify('Loading... ', 'environment variables')
  const env = getEnv()
  const coingeckoApiKey = env.optionalString('COINGECKO_API_KEY')
  const http = new HttpClient()
  const coingeckoClient = new CoingeckoClient(http, coingeckoApiKey)
  logger.success('Loaded ', 'environment variables')

  logger.notify('Loading... ', 'source file')
  const sourceFile = readFileSync(SOURCE_FILE_PATH, 'utf-8')
  const errors: ParseError[] = []
  const parsed = parse(sourceFile, errors, {
    allowTrailingComma: true,
  }) as Record<string, string>
  logger.check(errors.length === 0, 'Cannot parse source.jsonc')
  const source = Source.parse(parsed)
  logger.success('Loaded ', 'source file')

  logger.notify('Loading... ', 'output file')
  const outputFile = readFileSync(OUTPUT_FILE_PATH, 'utf-8')
  const output = Output.parse(JSON.parse(outputFile))
  logger.success('Loaded ', 'output file')

  const result: Token[] = []

  for (const [devId, entries] of Object.entries(source)) {
    // TODO: check chainId is valid
    logger.notify('Processing... ', `chain ${devId}`)

    for (const entry of entries) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const type = devId === 'ethereum' ? 'CBV' : entry.type!
      logger.check(
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        type !== undefined,
        `Missing type for ${devId} ${entry.symbol} ${
          entry.address?.toString() ?? ''
        }`,
      )

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const formula = devId === 'ethereum' ? 'locked' : entry.formula!
      logger.check(
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        formula !== undefined,
        `Missing formula for ${devId} ${entry.symbol} ${
          entry.address?.toString() ?? ''
        }`,
      )

      const category = entry.category ?? 'other'

      const present = output.tokens.find((e) => {
        if (ChainId.fromName(devId) !== e.chainId) {
          return false
        }
        if (!e.address) {
          return e.symbol === entry.symbol
        }
        return e.address === entry.address
      })

      if (present) {
        console.log(
          chalk.gray('Skipping ') +
            `${devId} ${entry.symbol} ${entry.address?.toString() ?? ''}`,
        )
        result.push({
          ...present,
          category,
          type,
          formula,
        })
        continue
      }

      logger.check(
        entry.address !== undefined,
        `native asset detected ${entry.symbol}. Configure manually`,
      )
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const address = entry.address!

      const chain = chains.find((c) => c.devId === devId.replaceAll('-', '')) // handle manta pacific case

      logger.check(chain !== undefined, `Chain ${devId} not found`)

      logger.notify(
        'Fetching... ',
        `${devId} ${entry.symbol} ${address.toString()}`,
      )

      const coingeckoId =
        entry.coingeckoId ??
        (await getCoingeckoId(
          coingeckoClient,
          logger,
          address,
          chain?.coingeckoPlatform,
          entry.symbol,
        ))

      const env = getEnv()
      const rpcUrl = env.optionalString(`${devId.toUpperCase()}_RPC_URL`)
      logger.check(rpcUrl !== undefined, `Missing RPC URL for ${devId}`)
      const provider = new providers.JsonRpcProvider(rpcUrl)

      const tokenInfo = await getTokenInfo(
        logger,
        provider,
        coingeckoClient,
        address,
        entry.symbol,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        coingeckoId!,
      )

      logger.success(
        'Fetched',
        `${devId} ${entry.symbol} ${address.toString()}`,
      )

      const id = `${devId}:${tokenInfo.symbol
        .replaceAll(' ', '-')
        .toLowerCase()}-${tokenInfo.name.replaceAll(' ', '-').toLowerCase()}`

      result.push({
        id: AssetId(id),
        name: tokenInfo.name,
        coingeckoId: tokenInfo.coingeckoId,
        address,
        symbol: tokenInfo.symbol,
        decimals: tokenInfo.decimals,
        sinceTimestamp: tokenInfo.sinceTimestamp,
        category,
        iconUrl: tokenInfo.iconUrl,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        chainId: ChainId(chain!.chainId),
        type,
        formula,
        bridgedUsing: entry.bridgedUsing,
      })
    }

    logger.success('Processed ', `chain ${devId}`)
  }

  logger.notify('Sorting... ', 'tokens by chain and name')
  result.sort((a, b) => {
    if (a.chainId !== b.chainId) {
      return Number(a.chainId) - Number(b.chainId)
    }
    return a.name.localeCompare(b.name)
  })
  logger.success('Sorted ', 'tokens by chain and name')

  logger.notify('Saving... ', 'output file')
  const outputJson = JSON.stringify(
    {
      comment: output.comment,
      tokens: result,
    },
    null,
    2,
  )
  writeFileSync(OUTPUT_FILE_PATH, outputJson + '\n')
  logger.success('Saved ', 'output file')
}

main().catch((e: unknown) => {
  console.error(e)
})

async function getCoingeckoId(
  coingeckoClient: CoingeckoClient,
  logger: ScriptLogger,
  address: EthereumAddress,
  platform: string | undefined,
  symbol: string,
) {
  logger.check(
    platform !== undefined,
    'could not find coingecko platform identifier for token ' +
      symbol +
      '. Please add it chain config of the project',
  )

  const coinList = await coingeckoClient.getCoinList({
    includePlatform: true,
  })

  const coin = coinList.find((coin) => {
    return (
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      coin.platforms[platform!]?.toLowerCase() ===
      address.toString().toLowerCase()
    )
  })

  logger.check(
    coin?.id !== undefined,
    'could not find coingeckoId for token ' +
      symbol +
      '. Please add it manually to source.jsonc',
  )

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return coin!.id
}
