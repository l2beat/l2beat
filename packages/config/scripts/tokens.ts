import { getEnv } from '@l2beat/backend-tools'
import { CoingeckoClient, HttpClient } from '@l2beat/shared'
import {
  AssetId,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  Token,
} from '@l2beat/shared-pure'
import { providers } from 'ethers'
import { readFileSync, writeFileSync } from 'fs'
import { parse, ParseError } from 'jsonc-parser'

import { chains } from '../src/chains'
import { ChainConfig } from '../src/common'
import { Output, Source, SourceEntry } from '../src/tokens/types'
import { getCoingeckoId } from '../src/tokens/utils/getCoingeckoId'
import { getTokenInfo } from '../src/tokens/utils/getTokenInfo'
import { ScriptLogger } from '../src/tokens/utils/ScriptLogger'

const SOURCE_FILE_PATH = './src/tokens/tokens.jsonc'
const OUTPUT_FILE_PATH = './src/tokens/generated.json'

async function main() {
  const logger = new ScriptLogger({})
  const coingeckoClient = getCoingeckoClient()
  logger.fetching('coin list from Coingecko')
  const coinList = await coingeckoClient.getCoinList({
    includePlatform: true,
  })
  const source = readTokensFile(logger)
  const output = readGeneratedFile(logger)
  const result: Token[] = []

  for (const [devId, tokens] of Object.entries(source)) {
    const chainLogger = logger.prefix(devId)
    const chain = getChainConfiguration(chainLogger, devId)
    const chainId = getChainId(chainLogger, chain)

    chainLogger.processing()

    for (const token of tokens) {
      const tokenLogger: ScriptLogger = chainLogger.addMetadata(token.symbol)

      const type = getType(tokenLogger, devId, token)
      const formula = getFormula(tokenLogger, devId, token)
      const category = token.category ?? 'other'

      const existingToken = findTokenInOutput(output, chainId, token)

      if (existingToken) {
        const bridgedUsing = token.bridgedUsing ?? existingToken.bridgedUsing
        const coingeckoId = token.coingeckoId ?? existingToken.coingeckoId
        // If token is already in output, use the existing data and override
        // the category, type, formula and bridgedUsing fields.
        result.push({
          ...existingToken,
          category,
          type,
          formula,
          coingeckoId,
          bridgedUsing,
        })
        continue
      }

      tokenLogger.assert(
        token.address !== undefined,
        `Native asset detected - configure manually`,
      )
      tokenLogger.processing()

      const coingeckoId =
        token.coingeckoId ??
        getCoingeckoId(logger, coinList, chain.coingeckoPlatform, token.address)

      const info = await fetchTokenInfo(
        tokenLogger,
        coingeckoClient,
        coingeckoId,
        chain,
        token.address,
        token.symbol,
      )

      const assetId = getAssetId(chain, token, info.name)

      result.push({
        id: assetId,
        chainId,
        address: token.address,
        symbol: token.symbol,
        name: info.name,
        decimals: info.decimals,
        coingeckoId: info.coingeckoId,
        sinceTimestamp: info.sinceTimestamp,
        iconUrl: info.iconUrl,
        category,
        type,
        formula,
      })

      tokenLogger.processed()
    }

    chainLogger.processed()
  }

  const sorted = sortByChainAndName(result)
  logger.success('\nSorted ', 'tokens by chain and name')

  saveResults(sorted)
  logger.success('\nSaved ', 'output file')
}

function readTokensFile(logger: ScriptLogger) {
  logger.notify('Loading... ', 'source file')

  const sourceFile = readFileSync(SOURCE_FILE_PATH, 'utf-8')
  const errors: ParseError[] = []
  const parsed = parse(sourceFile, errors, {
    allowTrailingComma: true,
  }) as Record<string, string>
  logger.assert(errors.length === 0, 'Cannot parse source.jsonc')
  const source = Source.parse(parsed)

  logger.success('Loaded ', 'source file')

  return source
}

function readGeneratedFile(logger: ScriptLogger) {
  logger.notify('Loading... ', 'output file')

  const outputFile = readFileSync(OUTPUT_FILE_PATH, 'utf-8')
  const output = Output.parse(JSON.parse(outputFile))

  logger.success('Loaded ', 'output file')

  return output
}

function getCoingeckoClient() {
  const env = getEnv()
  const coingeckoApiKey = env.optionalString('COINGECKO_API_KEY')
  const http = new HttpClient()
  const coingeckoClient = new CoingeckoClient(http, coingeckoApiKey)
  return coingeckoClient
}

function getChainConfiguration(logger: ScriptLogger, devId: string) {
  const chain = chains.find((c) => c.devId === devId)
  logger.assert(
    chain !== undefined,
    `Configuration not found, add chain configuration to project .ts file`,
  )
  return chain
}

function getChainId(logger: ScriptLogger, chain: ChainConfig) {
  let chainId: ChainId | undefined = undefined
  try {
    chainId = ChainId(chain.chainId)
  } catch (e) {
    logger.assert(false, `ChainId not found for`)
  }
  return chainId
}

function getType(tokenLogger: ScriptLogger, devId: string, entry: SourceEntry) {
  const type = devId === 'ethereum' ? 'CBV' : entry.type
  tokenLogger.assert(type !== undefined, `Missing type`)
  return type
}

function getFormula(
  tokenLogger: ScriptLogger,
  devId: string,
  entry: SourceEntry,
) {
  const formula = devId === 'ethereum' ? 'locked' : entry.formula
  tokenLogger.assert(formula !== undefined, `Missing formula`)
  return formula
}

function getAssetId(chain: ChainConfig, token: SourceEntry, name: string) {
  return AssetId(
    `${chain.devId}:${token.symbol.replaceAll(' ', '-').toLowerCase()}-${name
      .replaceAll(' ', '-')
      .toLowerCase()}`,
  )
}

function sortByChainAndName(result: Token[]) {
  return result.sort((a, b) => {
    if (a.chainId !== b.chainId) {
      return Number(a.chainId) - Number(b.chainId)
    }
    return a.name.localeCompare(b.name)
  })
}

function saveResults(result: Token[]) {
  const comment = 'This file was autogenerated. Please do not edit it manually.'
  const outputJson = JSON.stringify(
    {
      comment: comment,
      tokens: result,
    },
    null,
    2,
  )
  writeFileSync(OUTPUT_FILE_PATH, outputJson + '\n')
}

function findTokenInOutput(
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
  coingeckoId: CoingeckoId,
  chain: ChainConfig,
  address: EthereumAddress,
  symbol: string,
) {
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
    address,
    symbol,
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

main().catch((e: unknown) => {
  console.error(e)
})
