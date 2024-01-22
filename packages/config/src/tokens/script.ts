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
import { providers } from 'ethers'
import { readFileSync, writeFileSync } from 'fs'
import { parse, ParseError } from 'jsonc-parser'
import { z } from 'zod'

import { chains } from '../chains'
import { ChainConfig } from '../common'
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
export type SourceEntry = z.infer<typeof SourceEntry>

const Source = z.record(z.array(SourceEntry))
const Output = z.object({
  comment: z.string().optional(),
  tokens: z.array(Token),
})
export type Output = z.infer<typeof Output>

async function main() {
  let logger: ScriptLogger = new ScriptLogger({})

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
  logger.assert(errors.length === 0, 'Cannot parse source.jsonc')
  const source = Source.parse(parsed)
  logger.success('Loaded ', 'source file')

  logger.notify('Loading... ', 'output file')
  const outputFile = readFileSync(OUTPUT_FILE_PATH, 'utf-8')
  const output = Output.parse(JSON.parse(outputFile))
  logger.success('Loaded ', 'output file')

  const result: Token[] = []

  for (const [devId, entries] of Object.entries(source)) {
    const chain = chains.find((c) => c.devId === devId.replaceAll('-', '')) // handle manta pacific case
    logger.assert(
      chain !== undefined,
      `Configuration not found, TODO add readme`,
    )
    logger.processing(`chain ${devId}`)

    let chainId: ChainId | undefined = undefined
    try {
      chainId = ChainId(chain.chainId)
    } catch (e) {
      logger.assert(false, `ChainId not found for`)
    }

    for (const entry of entries) {
      logger = logger.addMetadata(entry.symbol)

      const type = devId === 'ethereum' ? 'CBV' : entry.type
      logger.assert(type !== undefined, `Missing type`)

      const formula = devId === 'ethereum' ? 'locked' : entry.formula
      logger.assert(formula !== undefined, `Missing formula`)

      const category = entry.category ?? 'other'

      const generated = getFromGenerated(output, chainId, entry)

      if (generated) {
        logger.skipping()
        result.push({
          ...generated,
          category,
          type,
          formula,
        })
        continue
      }

      logger.processing()

      const info = await fetchTokenInfo(logger, coingeckoClient, chain, entry)

      const id = `${chain.devId}:${entry.symbol
        .replaceAll(' ', '-')
        .toLowerCase()}-${info.name.replaceAll(' ', '-').toLowerCase()}`

      result.push({
        id: AssetId(id),
        chainId,
        address: entry.address,
        symbol: entry.symbol,
        name: info.name,
        decimals: info.decimals,
        coingeckoId: info.coingeckoId,
        sinceTimestamp: info.sinceTimestamp,
        iconUrl: info.iconUrl,
        category,
        type,
        formula,
      })

      logger.processed()
    }

    logger.processed()
  }

  result.sort((a, b) => {
    if (a.chainId !== b.chainId) {
      return Number(a.chainId) - Number(b.chainId)
    }
    return a.name.localeCompare(b.name)
  })
  logger.success('\nSorted ', 'tokens by chain and name')

  const outputJson = JSON.stringify(
    {
      comment: output.comment,
      tokens: result,
    },
    null,
    2,
  )
  writeFileSync(OUTPUT_FILE_PATH, outputJson + '\n')
  logger.success('\nSaved ', 'output file')
}

function getFromGenerated(
  output: Output,
  chainId: ChainId | undefined,
  entry: SourceEntry,
) {
  return output.tokens.find((e) => {
    if (chainId !== e.chainId) {
      return false
    }
    if (!e.address) {
      return e.symbol === entry.symbol
    }
    return e.address === entry.address
  })
}

async function fetchTokenInfo(
  logger: ScriptLogger,
  coingeckoClient: CoingeckoClient,
  chain: ChainConfig,
  entry: SourceEntry,
) {
  logger.assert(
    entry.address !== undefined,
    `Native asset detected - configure manually`,
  )

  const coingeckoId =
    entry.coingeckoId ??
    (await getCoingeckoId(
      coingeckoClient,
      logger,
      entry.address,
      chain.coingeckoPlatform,
    ))

  const env = getEnv()
  const rpcUrl = env.optionalString(`${chain.devId.toUpperCase()}_RPC_URL`)
  logger.assert(
    rpcUrl !== undefined,
    `Missing environmental variable: ${chain.devId.toUpperCase()}_RPC_URL`,
  )
  const provider = new providers.JsonRpcProvider(rpcUrl)

  const tokenInfo = await getTokenInfo(
    logger,
    provider,
    coingeckoClient,
    entry.address,
    entry.symbol,
    coingeckoId,
  )

  return {
    name: tokenInfo.name,
    coingeckoId: tokenInfo.coingeckoId,
    decimals: tokenInfo.decimals,
    sinceTimestamp: tokenInfo.sinceTimestamp,
    iconUrl: tokenInfo.iconUrl,
  }
}

async function getCoingeckoId(
  coingeckoClient: CoingeckoClient,
  logger: ScriptLogger,
  address: EthereumAddress,
  platform: string | undefined,
) {
  logger.assert(
    platform !== undefined,
    'Could not find coingecko platform identifier. Please add it chain config of the project',
  )

  const coinList = await coingeckoClient.getCoinList({
    includePlatform: true,
  })

  const coin = coinList.find((coin) => {
    return (
      coin.platforms[platform]?.toLowerCase() ===
      address.toString().toLowerCase()
    )
  })

  logger.assert(
    coin?.id !== undefined,
    'Could not find coingeckoId for token. Please add it manually to source.jsonc',
  )

  return coin.id
}

main().catch((e: unknown) => {
  console.error(e)
})
